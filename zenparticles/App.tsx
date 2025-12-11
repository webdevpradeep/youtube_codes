import React, { useState, useCallback } from 'react';
import ParticleSystem from './components/ParticleSystem';
import HandTracker from './components/HandTracker';
import Controls from './components/Controls';
import { ParticleConfig, ShapeType, ParticleStyle, HandTrackingResult } from './types';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ParticleConfig>({
    color: '#00ffff',
    shape: ShapeType.SPHERE,
    style: ParticleStyle.GLOW,
  });

  const [handData, setHandData] = useState<HandTrackingResult>({
    tension: 0,
    isDetected: false
  });

  // Optimize updates to avoid excessive re-renders in heavy components
  const handleHandUpdate = useCallback((result: HandTrackingResult) => {
    setHandData(result);
  }, []);

  // Compute visual tension for UI (matches shader logic: Open=1.0, Fist=0.0)
  const uiTension = 1.0 - handData.tension;

  return (
    // Removed bg-[#050505] to prevent obscuring the canvas. Background is handled by body.
    <div className="relative w-full h-screen text-white overflow-hidden selection:bg-purple-500/30">
      
      {/* Background UI Layers */}
      <div className="absolute top-8 left-8 z-10 select-none pointer-events-none">
        <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          <Sparkles className="w-8 h-8 text-white" />
          ZEN PARTICLES
        </h1>
        <p className="mt-2 text-sm text-gray-400 font-mono tracking-widest opacity-80 pl-1">
          OPEN HAND TO EXPAND • FIST TO CONTRACT • CLAP TO EXPLODE
        </p>
      </div>

      <HandTracker onUpdate={handleHandUpdate} />
      
      {/* ParticleSystem is absolutely positioned behind content but visible */}
      <ParticleSystem config={config} handData={handData} />
      
      <Controls 
        config={config} 
        setConfig={setConfig} 
        visualTension={uiTension} 
      />
      
      {!handData.isDetected && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="text-white/20 text-xl font-light tracking-[1em] animate-pulse">
            WAITING FOR HAND...
          </div>
        </div>
      )}
    </div>
  );
};

export default App;