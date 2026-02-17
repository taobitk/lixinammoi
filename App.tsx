import React, { useState } from 'react';
import { ProbabilityGame } from './components/ProbabilityGame';
import { ShuffleGame } from './components/ShuffleGame';
import { Gift, Shuffle } from 'lucide-react';

// Enum to switch between screens
enum Screen {
  MENU,
  PROBABILITY_GAME,
  SHUFFLE_GAME
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.MENU);

  const renderContent = () => {
    switch (screen) {
      case Screen.PROBABILITY_GAME:
        return <ProbabilityGame onBack={() => setScreen(Screen.MENU)} />;
      case Screen.SHUFFLE_GAME:
        return <ShuffleGame onBack={() => setScreen(Screen.MENU)} />;
      default:
        return (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in px-4">
            {/* Hero Section */}
            <div className="text-center mb-8 md:mb-16 relative mt-8 md:mt-0">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 md:w-96 md:h-96 bg-yellow-500/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
              <h1 className="font-tet text-4xl md:text-8xl text-tet-gold drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-2 md:mb-4">
                Lì Xì Thần Tài
              </h1>
              <p className="text-xl md:text-2xl text-yellow-100/80 font-medium italic">
                Hái lộc đầu năm - Vạn sự như ý
              </p>
            </div>

            {/* Game Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Card 1: Probability Game */}
              <button
                onClick={() => setScreen(Screen.PROBABILITY_GAME)}
                className="group relative overflow-hidden bg-white/10 hover:bg-white/15 backdrop-blur-md border border-yellow-500/30 rounded-3xl p-8 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] text-left"
              >
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gradient-to-br from-red-500 to-yellow-500 w-16 h-16 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
                    <Gift size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2 group-hover:text-yellow-200">Thử Vận May - Nhận Quà Liền Tay</h3>
                <p className="text-gray-300 mb-6 group-hover:text-white transition-colors">
                  Thiết lập tỉ lệ trúng thưởng cho từng mệnh giá. Phù hợp để phát lộc cho đám đông vui vẻ.
                </p>
                <span className="inline-flex items-center gap-2 text-yellow-400 font-bold group-hover:gap-3 transition-all">
                  Chơi ngay <ArrowRightIcon size={20} />
                </span>
              </button>

              {/* Card 2: Shuffle Game */}
              <button
                onClick={() => setScreen(Screen.SHUFFLE_GAME)}
                className="group relative overflow-hidden bg-white/10 hover:bg-white/15 backdrop-blur-md border border-yellow-500/30 rounded-3xl p-8 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] text-left"
              >
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-2xl -rotate-6 flex items-center justify-center shadow-lg">
                    <Shuffle size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2 group-hover:text-yellow-200">Hái Lộc Đầu Năm</h3>
                <p className="text-gray-300 mb-6 group-hover:text-white transition-colors">
                  Chọn các bao lì xì tùy ý, đảo lộn vị trí và thử vận may. Hồi hộp, gay cấn từng giây!
                </p>
                <span className="inline-flex items-center gap-2 text-yellow-400 font-bold group-hover:gap-3 transition-all">
                  Chơi ngay <ArrowRightIcon size={20} />
                </span>
              </button>
            </div>

            <footer className="mt-20 text-white/30 text-xs text-center">
              Design for Vietnamese Tet 2025
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative overflow-x-hidden w-full">
      {/* Background decorations - visible on all screens */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Dynamic Content */}
      <div className="w-full h-full z-10 flex flex-col items-center justify-center flex-1">
        {renderContent()}
      </div>
    </div>
  );
}

const ArrowRightIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
