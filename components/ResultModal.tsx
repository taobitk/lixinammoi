import React from 'react';
import { PrizeResult } from '../types';
import { X, Share2, RefreshCw } from 'lucide-react';

interface ResultModalProps {
  result: PrizeResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, isOpen, onClose }) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-[#FFFBEB] w-full max-w-sm rounded-2xl p-1 shadow-2xl animate-pop-in transform overflow-hidden">
        {/* Decorative Borders */}
        <div className="absolute top-0 left-0 w-full h-4 bg-pattern-wave opacity-50"></div>
        
        <div className="bg-white rounded-xl p-6 text-center border-2 border-tet-red m-1 relative overflow-hidden">
            {/* Confetti/Rays Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 pointer-events-none"></div>
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-b from-transparent via-yellow-200/20 to-transparent rotate-45 animate-spin-slow pointer-events-none" style={{animationDuration: '20s'}}></div>

            <h3 className="font-tet text-4xl text-tet-red mb-2 drop-shadow-sm">Chúc Mừng!</h3>
            <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider">Bạn đã nhận được</p>
            
            <div className="my-8 transform transition-transform hover:scale-110 duration-300">
                <span className="font-extrabold text-5xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
                    {result.amount.toLocaleString('vi-VN')}
                </span>
                <span className="text-2xl text-red-500 font-bold ml-1">đ</span>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-100 relative">
                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2">
                    <span className="text-xs font-bold text-red-400 uppercase">Lời Chúc Thần Tài</span>
                 </div>
                 <p className="text-gray-700 italic font-medium leading-relaxed">
                     "{result.wish}"
                 </p>
            </div>

            <button 
                onClick={onClose}
                className="w-full bg-tet-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
                <RefreshCw size={20} />
                Mở Tiếp
            </button>
        </div>
      </div>
    </div>
  );
};
