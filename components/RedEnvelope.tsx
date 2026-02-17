import React from 'react';
import { OpeningState } from '../types';

interface RedEnvelopeProps {
  state: OpeningState;
  onClick: () => void;
  disabled: boolean;
}

export const RedEnvelope: React.FC<RedEnvelopeProps> = ({ state, onClick, disabled }) => {
  const isShaking = state === OpeningState.SHAKING;
  
  return (
    <div className="relative flex justify-center items-center py-10">
      {/* Glow effect behind envelope during shake */}
      {isShaking && (
        <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full animate-pulse z-0 scale-150"></div>
      )}

      <button
        onClick={onClick}
        disabled={disabled || state !== OpeningState.IDLE}
        className={`
          relative z-10 w-64 h-80 transition-transform duration-200 cursor-pointer outline-none group
          ${isShaking ? 'animate-shake-hard' : 'hover:scale-105'}
          ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        `}
      >
        {/* Envelope Body */}
        <div className="absolute inset-0 bg-gradient-to-b from-tet-red to-tet-dark-red rounded-xl shadow-2xl border-2 border-yellow-600 overflow-hidden">
          
          {/* Decorative Pattern (Coins background) */}
          <div className="absolute inset-0 opacity-10" 
               style={{backgroundImage: "radial-gradient(#FFD700 2px, transparent 2px)", backgroundSize: "20px 20px"}}>
          </div>

          {/* Envelope Flap (Top) */}
          <div className="absolute top-0 left-0 w-full h-24 bg-[#B9121B] rounded-b-[50%] shadow-lg border-b-2 border-yellow-700/30 z-20 flex justify-center items-end pb-2">
             <div className="w-16 h-16 rounded-full bg-tet-gold border-4 border-yellow-300 shadow-inner flex items-center justify-center mb-[-2rem]">
                <span className="font-tet text-tet-red text-2xl font-bold">Lộc</span>
             </div>
          </div>

          {/* Main Character / Center Art */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 z-10">
             <div className="text-center space-y-2">
                <h1 className="font-tet text-5xl text-tet-gold drop-shadow-md">Tết</h1>
                <h2 className="font-tet text-4xl text-yellow-200">2025</h2>
             </div>
             
             {/* Center decorative circle */}
             <div className="mt-8 w-32 h-32 border-4 border-yellow-500/50 rounded-full flex items-center justify-center p-2 relative">
                <div className="absolute inset-0 border border-dashed border-yellow-300 rounded-full animate-spin-slow" style={{animationDuration: '10s'}}></div>
                <div className="text-center">
                   <p className="font-bold text-yellow-100 text-sm uppercase tracking-widest">Vạn Sự</p>
                   <p className="font-bold text-yellow-100 text-sm uppercase tracking-widest">Như Ý</p>
                </div>
             </div>
          </div>
          
          {/* Bottom decoration */}
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </button>

      {/* Instruction Text */}
      {!disabled && state === OpeningState.IDLE && (
        <div className="absolute -bottom-4 animate-bounce bg-white text-tet-red font-bold px-4 py-1 rounded-full shadow-lg z-20 pointer-events-none">
          Chạm để mở lì xì!
        </div>
      )}
      
      {/* Suspense Text */}
      {isShaking && (
         <div className="absolute -top-10 font-bold text-2xl text-yellow-400 animate-pulse z-20 tracking-widest drop-shadow-lg">
           ĐANG MỞ...
         </div>
      )}
    </div>
  );
};
