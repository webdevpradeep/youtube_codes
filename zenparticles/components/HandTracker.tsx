import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { HandTrackingResult } from '../types';
import { RefreshCw, CameraOff, Loader2 } from 'lucide-react';

interface HandTrackerProps {
  onUpdate: (result: HandTrackingResult) => void;
}

const HandTracker: React.FC<HandTrackerProps> = ({ onUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  // Initialize MediaPipe
  const initializeMediaPipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });
      
      startCamera();
    } catch (err) {
      console.error(err);
      setError("Failed to load AI models.");
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', predictWebcam);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Camera access denied.");
      setLoading(false);
    }
  };

  const calculateTension = (landmarks: any[]): number => {
    // Indices for fingertips and wrist
    // 0: Wrist, 5: IndexMCP
    // 8: IndexTip, 12: MiddleTip, 16: RingTip, 20: PinkyTip
    const wrist = landmarks[0];
    const indexMCP = landmarks[5];
    
    // Calculate palm size reference (Wrist to IndexMCP)
    const palmSize = Math.sqrt(
      Math.pow(wrist.x - indexMCP.x, 2) + 
      Math.pow(wrist.y - indexMCP.y, 2) + 
      Math.pow(wrist.z - indexMCP.z, 2)
    );

    const tips = [8, 12, 16, 20];
    let totalDist = 0;

    tips.forEach(tipIdx => {
      const tip = landmarks[tipIdx];
      const dist = Math.sqrt(
        Math.pow(wrist.x - tip.x, 2) + 
        Math.pow(wrist.y - tip.y, 2) + 
        Math.pow(wrist.z - tip.z, 2)
      );
      totalDist += dist;
    });

    const avgDist = totalDist / 4;
    
    // Normalized ratio. 
    // Open hand: avgDist is roughly 2.0 to 2.5x palmSize
    // Fist: avgDist is roughly 0.8 to 1.0x palmSize
    const ratio = avgDist / palmSize;

    // Map ratio to 0.0 (Open) - 1.0 (Closed)
    // Empirically: Open ~ 2.2, Closed ~ 0.9
    // Clamped linear mapping
    const minRatio = 0.9; // Fist
    const maxRatio = 2.2; // Open

    let tension = (maxRatio - ratio) / (maxRatio - minRatio);
    return Math.max(0, Math.min(1, tension));
  };

  const predictWebcam = () => {
    if (!videoRef.current || !handLandmarkerRef.current) return;
    
    const startTimeMs = performance.now();
    
    if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      const detections = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
      
      processDetections(detections);
    }
    
    animationFrameRef.current = requestAnimationFrame(predictWebcam);
  };

  const processDetections = (result: HandLandmarkerResult) => {
    if (result.landmarks && result.landmarks.length > 0) {
      const tension = calculateTension(result.landmarks[0]);
      onUpdate({ isDetected: true, tension });
      
      // Draw landmarks on canvas for feedback
      drawHand(result.landmarks[0]);
    } else {
      onUpdate({ isDetected: false, tension: 0 });
      clearCanvas();
    }
  };

  const drawHand = (landmarks: any[]) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current || !videoRef.current) return;
    
    // Match dimensions
    if (canvasRef.current.width !== videoRef.current.videoWidth) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
    }

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
    ctx.lineWidth = 2;

    // Simple connection drawing could go here, but dots are enough for small preview
    landmarks.forEach(lm => {
      const x = lm.x * canvasRef.current!.width;
      const y = lm.y * canvasRef.current!.height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    initializeMediaPipe();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <div className="relative rounded-lg overflow-hidden border border-white/20 shadow-2xl w-40 h-30 bg-black/50 backdrop-blur-md">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-2 text-center bg-black/80">
            <CameraOff className="w-6 h-6 mb-1" />
            <span className="text-xs">{error}</span>
          </div>
        )}

        <video 
          ref={videoRef} 
          className="w-full h-full object-cover transform -scale-x-100 opacity-60" 
          autoPlay 
          playsInline 
          muted 
        />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full transform -scale-x-100" 
        />
      </div>
      
      {error && (
        <button 
          onClick={initializeMediaPipe}
          className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-full transition"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      )}
    </div>
  );
};

export default HandTracker;