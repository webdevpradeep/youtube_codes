import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ParticleConfig, ShapeType, ParticleStyle, PARTICLE_COUNT, HandTrackingResult, TRAIL_LENGTH } from '../types';
import { generateGeometry, generateAttributes } from '../utils/geometryFactory';

interface ParticleSystemProps {
  config: ParticleConfig;
  handData: HandTrackingResult;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ config, handData }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  
  // State refs for smoothing and logic
  const smoothedTensionRef = useRef(0);
  const prevTensionRef = useRef(0);
  const explosionRef = useRef(0);

  // Shader Code
  const vertexShader = `
    uniform float uTime;
    uniform float uTension; // 0.0 (Contract) to 1.0 (Expand)
    uniform float uExplosion;
    
    attribute vec3 targetPos;
    attribute float trailIdx;
    attribute float pScale;
    
    varying float vTrailIdx;
    varying float vDepth;

    // Simplex Noise (Standard GLSL chunk)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) { 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; 
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vTrailIdx = trailIdx;
      
      // Calculate delay based on trail index
      float lag = trailIdx * 0.08;
      float effectiveTime = uTime - lag;
      
      // Base Noise Movement
      // Increase noise frequency for better effect
      float noiseVal = snoise(targetPos * 1.5 + vec3(effectiveTime * 0.5));
      
      // Breathing / Expansion logic
      float breath = sin(effectiveTime * 2.0) * 0.1;
      float expansion = uTension * 2.5 + 0.5; // Base size + expansion
      
      // Apply Explosion
      float explode = uExplosion * 5.0 * (1.0 + trailIdx * 0.5);
      vec3 explodeDir = normalize(targetPos + vec3(0.001)) * explode; // Avoid div by zero

      vec3 pos = targetPos * (expansion + breath);
      
      // Add turbulence
      pos += vec3(noiseVal) * (0.2 + uTension * 0.3); // More noise when expanded
      
      // Apply explosion
      pos += explodeDir;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation
      vDepth = -mvPosition.z;
      // Ensure points aren't too small
      float size = (300.0 / max(vDepth, 0.1)) * pScale * (1.0 - trailIdx * 0.15);
      gl_PointSize = max(size, 4.0); // Minimum size
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    uniform int uStyle; // 0: Glow, 1: Digital, 2: Cyber, 3: Magic
    varying float vTrailIdx;
    
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = 0.0;
      float alpha = 1.0;
      
      if (uStyle == 0) {
        // GLOW (Standard)
        d = length(uv);
        if (d > 0.5) discard;
        float strength = 1.0 - (d * 2.0);
        alpha = pow(strength, 1.5);
      } 
      else if (uStyle == 1) {
        // DIGITAL (Pixel/Square)
        // Box SDF
        if (abs(uv.x) > 0.45 || abs(uv.y) > 0.45) discard;
        alpha = 0.8;
        // Scanline effect
        if (mod(gl_PointCoord.y * 10.0, 2.0) < 1.0) alpha *= 0.5;
      }
      else if (uStyle == 2) {
        // CYBER (Ring)
        d = length(uv);
        if (d > 0.5 || d < 0.25) discard;
        alpha = 1.0;
      }
      else if (uStyle == 3) {
        // MAGIC (Star/Diamond)
        // Manhattan distance
        d = abs(uv.x) + abs(uv.y);
        if (d > 0.5) discard;
        alpha = pow(1.0 - d * 2.0, 0.5);
        // Highlight center
        if (length(uv) < 0.1) alpha = 1.0;
      }

      // Trail fade logic
      alpha *= (1.0 - vTrailIdx * 0.2);
      
      // Color mixing (White hot center for Glow/Magic)
      vec3 finalColor = uColor;
      if (uStyle == 0 || uStyle == 3) {
         finalColor = mix(uColor, vec3(1.0), alpha * 0.5);
      }
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  // Helper to convert Enum string to int for shader
  const getStyleInt = (style: ParticleStyle): number => {
    switch(style) {
      case ParticleStyle.GLOW: return 0;
      case ParticleStyle.DIGITAL: return 1;
      case ParticleStyle.CYBER: return 2;
      case ParticleStyle.MAGIC: return 3;
      default: return 0;
    }
  };

  // Initialization
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.05);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Geometry & Material
    const { trailIndices, scales } = generateAttributes(PARTICLE_COUNT);
    const geometry = new THREE.BufferGeometry();
    geometry.frustumCulled = false;

    // Initial dummy positions (will be updated by targetPos immediately)
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * TRAIL_LENGTH * 3), 3));
    geometry.setAttribute('trailIdx', new THREE.BufferAttribute(trailIndices, 1));
    geometry.setAttribute('pScale', new THREE.BufferAttribute(scales, 1));
    
    // Target Positions (The shape)
    const initialPos = generateGeometry(config.shape, PARTICLE_COUNT);
    geometry.setAttribute('targetPos', new THREE.BufferAttribute(initialPos, 3));
    
    geometryRef.current = geometry;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(config.color) },
        uTension: { value: 0.5 },
        uExplosion: { value: 0.0 },
        uStyle: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation Loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = time;
        
        // Decay explosion
        if (explosionRef.current > 0) {
          explosionRef.current *= 0.92; // Decay factor
          materialRef.current.uniforms.uExplosion.value = explosionRef.current;
        }

        // Apply smoothed tension to shader
        materialRef.current.uniforms.uTension.value = smoothedTensionRef.current;
      }

      // Gentle rotation of the whole system
      points.rotation.y = time * 0.05;
      points.rotation.z = time * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handle
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Handle Updates
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.set(config.color);
      materialRef.current.uniforms.uStyle.value = getStyleInt(config.style);
    }
    
    // Update Geometry when shape changes
    if (geometryRef.current) {
      const newPos = generateGeometry(config.shape, PARTICLE_COUNT);
      geometryRef.current.setAttribute('targetPos', new THREE.BufferAttribute(newPos, 3));
      geometryRef.current.attributes.targetPos.needsUpdate = true;
    }
  }, [config]);

  // Handle Hand Logic Frame-by-Frame (via Ref interaction)
  useEffect(() => {
    const tension = handData.tension; // 0.0 (Open) to 1.0 (Closed)
    
    // Logic: 
    // Open Hand (Tension 0) -> Visual High (Expand) -> Target 1.0
    // Fist (Tension 1) -> Visual Low (Contract) -> Target 0.0
    const targetVisualTension = 1.0 - tension; 

    // Smooth lerp
    smoothedTensionRef.current += (targetVisualTension - smoothedTensionRef.current) * 0.1;

    // Clap Detection / Rapid Spike
    // We check raw tension. If we went from Low (Open) to High (Closed) very fast? 
    if (prevTensionRef.current < 0.35 && tension > 0.8) {
      explosionRef.current = 1.0; // Trigger explosion
    }
    
    prevTensionRef.current = tension;

  }, [handData]);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default ParticleSystem;