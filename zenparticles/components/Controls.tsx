import React from 'react';
import { ParticleConfig, ShapeType, ParticleStyle } from '../types';
import { Heart, Globe, Atom, Flower, Activity, Zap, Circle, Square, Disc, Star } from 'lucide-react';

interface ControlsProps {
  config: ParticleConfig;
  setConfig: React.Dispatch<React.SetStateAction<ParticleConfig>>;
  visualTension: number; // 0-1 for UI bar
}

const COLORS = [
  '#00ffff', // Cyan
  '#ff00ff', // Magenta
  '#ffff00', // Yellow
  '#ff3333', // Red
  '#33ff33', // Green
  '#ffffff', // White
];

const SHAPES = [
  { type: ShapeType.SPHERE, icon: Globe, label: 'Sphere' },
  { type: ShapeType.HEART, icon: Heart, label: 'Heart' },
  { type: ShapeType.FLOWER, icon: Flower, label: 'Flower' },
  { type: ShapeType.SATURN, icon: Atom, label: 'Saturn' },
  { type: ShapeType.BUDDHA, icon: Activity, label: 'Zen' }, 
  { type: ShapeType.FIREWORKS, icon: Zap, label: 'Burst' },
];

const STYLES = [
  { type: ParticleStyle.GLOW, icon: Circle, label: 'Glow' },
  { type: ParticleStyle.DIGITAL, icon: Square, label: 'Pixel' },
  { type: ParticleStyle.CYBER, icon: Disc, label: 'Ring' },
  { type: ParticleStyle.MAGIC, icon: Star, label: 'Star' },
];

const Controls: React.FC<ControlsProps> = ({ config, setConfig, visualTension }) => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl z-20">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        
        {/* Row 1: Shapes */}
        <div className="flex justify-between items-center overflow-x-auto pb-2 scrollbar-hide gap-2">
          {SHAPES.map((item) => {
            const Icon = item.icon;
            const isActive = config.shape === item.type;
            return (
              <button
                key={item.type}
                onClick={() => setConfig(prev => ({ ...prev, shape: item.type }))}
                className={`flex flex-col items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 min-w-[60px]
                  ${isActive ? 'bg-white/20 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                <span className="text-[10px] font-medium text-gray-300 uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="h-[1px] bg-white/10 w-full" />

        {/* Row 2: Styles & Colors */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Styles */}
          <div className="flex gap-2 items-center border-r border-white/10 pr-6 mr-2">
            <span className="text-[10px] text-gray-500 font-mono uppercase -rotate-90 hidden md:block">Style</span>
            {STYLES.map((item) => {
              const Icon = item.icon;
              const isActive = config.style === item.type;
              return (
                 <button
                  key={item.type}
                  onClick={() => setConfig(prev => ({ ...prev, style: item.type }))}
                  className={`p-2 rounded-lg transition-all duration-300
                    ${isActive ? 'bg-white/20 text-white scale-110' : 'text-gray-500 hover:text-white hover:bg-white/5'}
                  `}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Color Picker */}
          <div className="flex gap-3 flex-1 justify-center md:justify-start items-center">
             {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setConfig(prev => ({ ...prev, color: c }))}
                className={`w-6 h-6 rounded-full border border-white/20 transition-all duration-300
                  ${config.color === c ? 'scale-125 shadow-[0_0_10px_currentColor] border-white' : 'hover:scale-110'}
                `}
                style={{ backgroundColor: c }} 
              />
            ))}
          </div>

           {/* Tension Indicator */}
           <div className="flex items-center gap-3 w-full md:w-auto min-w-[120px]">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(100,200,255,0.5)]"
                style={{ width: `${visualTension * 100}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Controls;