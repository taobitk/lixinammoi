import React, { useState } from 'react';
import { SetupPanel } from './SetupPanel';
import { RedEnvelope } from './RedEnvelope';
import { ResultModal } from './ResultModal';
import { ConfirmModal } from './ConfirmModal';
import { PrizeTier, AppState, OpeningState, PrizeResult } from '../types';
import { getRandomWish } from '../services/geminiService';
import { ArrowLeft, History, Trophy } from 'lucide-react';

const INITIAL_TIERS: PrizeTier[] = [];

const XIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

interface ProbabilityGameProps {
    onBack: () => void;
}

export const ProbabilityGame: React.FC<ProbabilityGameProps> = ({ onBack }) => {
    const [appState, setAppState] = useState<AppState>(AppState.SETUP);
    const [tiers, setTiers] = useState<PrizeTier[]>(INITIAL_TIERS);

    // Game Logic State
    const [history, setHistory] = useState<PrizeResult[]>([]);

    // Animation/Interaction State
    const [openingState, setOpeningState] = useState<OpeningState>(OpeningState.IDLE);
    const [currentResult, setCurrentResult] = useState<PrizeResult | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const handleStartGame = () => {
        setHistory([]);
        setAppState(AppState.PLAYING);
    };

    const handleReturnToSetup = () => {
        if (history.length > 0) {
            setShowConfirmReset(true);
            return;
        }
        setAppState(AppState.SETUP);
        setHistory([]);
    };

    const handleConfirmReset = () => {
        setShowConfirmReset(false);
        setAppState(AppState.SETUP);
        setHistory([]);
    };

    const handleOpenEnvelope = async () => {
        if (openingState !== OpeningState.IDLE) return;

        // 1. Start Suspense
        setOpeningState(OpeningState.SHAKING);

        // 2. Determine Result based on probability
        const random = Math.random() * 100; // 0 to 100
        let cumulative = 0;
        let selectedAmount = 0;

        for (const tier of tiers) {
            cumulative += tier.probability;
            if (random < cumulative) {
                selectedAmount = tier.amount;
                break;
            }
        }

        // Fallback safety
        if (selectedAmount === 0 && tiers.length > 0) {
            selectedAmount = tiers[tiers.length - 1].amount;
        }

        // 3. Wait for animation and get random wish
        await new Promise(resolve => setTimeout(resolve, 2500));
        const wish = getRandomWish();

        const result: PrizeResult = {
            amount: selectedAmount,
            timestamp: Date.now(),
            wish,
        };

        // 4. Reveal
        setOpeningState(OpeningState.REVEALED);
        setCurrentResult(result);
        setHistory(prev => [result, ...prev]);
        setShowResultModal(true);
    };

    const handleCloseModal = () => {
        setShowResultModal(false);
        setOpeningState(OpeningState.IDLE);
        setCurrentResult(null);
    };

    const totalWon = history.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="w-full h-full">
            {/* Header */}
            <header className="z-10 text-center mb-4 md:mb-8 relative mt-2 md:mt-2">
                <button onClick={onBack} className="absolute left-4 top-0 md:left-0 md:top-2 z-50 text-white/50 hover:text-white flex items-center gap-1 bg-black/20 md:bg-transparent rounded-full px-3 py-1 md:p-0">
                    <ArrowLeft size={16} className="md:w-5 md:h-5" /> <span className="text-sm md:text-base">Menu</span>
                </button>
                <h1 className="font-tet text-2xl md:text-6xl text-tet-gold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-4 md:px-0 leading-tight pt-10 md:pt-0">
                    Thử Vận May - Nhận Quà Liền Tay
                </h1>
                {appState === AppState.PLAYING && (
                    <p className="text-yellow-200 mt-2 font-medium italic opacity-80">
                        Thử vận may đầu năm nào!
                    </p>
                )}
            </header>

            {appState === AppState.SETUP ? (
                <SetupPanel tiers={tiers} setTiers={setTiers} onStart={handleStartGame} />
            ) : (
                <div className="w-full max-w-lg mx-auto flex flex-col items-center z-10">

                    {/* Game Controls */}
                    <div className="w-full flex justify-between items-center mb-4 px-4">
                        <button onClick={handleReturnToSetup} className="text-white/70 hover:text-white flex items-center gap-1 text-sm bg-black/20 px-3 py-1 rounded-full">
                            <ArrowLeft size={16} /> Cấu hình
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => setShowHistory(!showHistory)} className="bg-white/10 hover:bg-white/20 text-yellow-300 px-4 py-1 rounded-full flex items-center gap-2 transition-colors border border-white/10">
                                <Trophy size={16} />
                                <span className="font-bold">{totalWon.toLocaleString('vi-VN')} đ</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Interactive Area */}
                    <div className="w-full min-h-[400px] flex justify-center items-center">
                        <RedEnvelope
                            state={openingState}
                            onClick={handleOpenEnvelope}
                            disabled={false}
                        />
                    </div>

                    {/* History Drawer/List */}
                    {showHistory && (
                        <div className="w-full max-w-md mx-auto mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 animate-pop-in">
                            <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                                <h3 className="font-bold text-white flex items-center gap-2"><History size={16} /> Lịch Sử Mở ({history.length})</h3>
                                <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white"><XIcon size={16} /></button>
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                                {history.length === 0 ? (
                                    <p className="text-center text-gray-400 text-sm py-2">Chưa có ai mở bao.</p>
                                ) : (
                                    history.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-black/20 p-2 rounded px-3">
                                            <span className="text-yellow-300 font-bold">{item.amount.toLocaleString('vi-VN')} đ</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(item.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Result Modal */}
            <ResultModal
                result={currentResult}
                isOpen={showResultModal}
                onClose={handleCloseModal}
            />

            <ConfirmModal
                isOpen={showConfirmReset}
                onClose={() => setShowConfirmReset(false)}
                onConfirm={handleConfirmReset}
                title="Cấu hình lại?"
                message="Mọi lịch sử lì xì sẽ bị xóa nếu bạn quay lại màn hình cấu hình. Bạn có chắc không?"
            />
        </div>
    );
}
