import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Shuffle, Eye, History, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from './ConfirmModal';

interface ShuffleGameProps {
    onBack: () => void;
}

type CardState = 'idle' | 'shuffling' | 'revealed';

const INITIAL_SUGGESTED_AMOUNTS = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000];

export const ShuffleGame: React.FC<ShuffleGameProps> = ({ onBack }) => {
    // Setup State
    const [amounts, setAmounts] = useState<number[]>([]);
    const [inputAmount, setInputAmount] = useState('');
    const [gameState, setGameState] = useState<'setup' | 'playing'>('setup');

    // Game State
    const [shuffledCards, setShuffledCards] = useState<{ id: number, amount: number, isRevealed: boolean }[]>([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [history, setHistory] = useState<{ amount: number, timestamp: number }[]>([]);
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // --- SETUP LOGIC ---
    const addAmount = (value?: number) => {
        const val = value || parseInt(inputAmount.replace(/\D/g, ''));
        if (!isNaN(val) && val > 0) {
            setAmounts([...amounts, val]);
            setInputAmount('');
        }
    };

    const removeAmount = (index: number) => {
        const newAmounts = [...amounts];
        newAmounts.splice(index, 1);
        setAmounts(newAmounts);
    };

    const handleStartGame = () => {
        if (amounts.length < 2) return;

        // Prepare cards
        const cards = amounts.map((amt, idx) => ({
            id: idx,
            amount: amt,
            isRevealed: false
        }));

        setShuffledCards(cards);
        setGameState('playing');

        // Auto shuffle on start
        setTimeout(() => shuffleCards(cards), 500);
    };

    // --- GAME LOGIC ---
    const shuffleCards = async (currentCards = shuffledCards) => {
        setIsShuffling(true);

        // Simple shuffle algorithm visible to user (just swap positions rapidly)
        // We will just animate CSS transforms, but logically we just randomize the array

        await new Promise(resolve => setTimeout(resolve, 2000)); // Fake shuffle delay

        const shuffled = [...currentCards].sort(() => Math.random() - 0.5);
        setShuffledCards(shuffled);
        setIsShuffling(false);
    };

    const handleCardClick = (index: number) => {
        if (isShuffling || shuffledCards[index].isRevealed) return;

        const newCards = [...shuffledCards];
        newCards[index].isRevealed = true;
        setShuffledCards(newCards);

        // Add to history
        setHistory(prev => [{ amount: newCards[index].amount, timestamp: Date.now() }, ...prev]);
    };

    const handleResetRound = () => {
        // Hide all cards
        const hiddenCards = shuffledCards.map(c => ({ ...c, isRevealed: false }));
        setShuffledCards(hiddenCards);

        // Shuffle again
        shuffleCards(hiddenCards);
    };

    const handleReturnToSetup = () => {
        if (history.length > 0) {
            setShowConfirmReset(true);
            return;
        }
        setGameState('setup');
        setHistory([]);
    };

    const handleConfirmReset = () => {
        setShowConfirmReset(false);
        setGameState('setup');
        setHistory([]);
    };

    if (gameState === 'setup') {
        return (
            <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in text-white/90">
                <header className="mb-4 md:mb-8 flex items-center justify-between md:justify-start gap-2 md:gap-4 mt-4 md:mt-0">
                    <button onClick={onBack} className="p-2 bg-black/20 hover:bg-white/10 rounded-full transition-colors order-first">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-tet text-tet-gold text-center flex-1 md:text-left leading-tight">
                        Thử Vận May - Đảo Lì Xì
                    </h1>
                </header>

                <div className="bg-white/5 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-yellow-200 mb-4">Bước 1: Chọn Các Bao Lì Xì</h2>
                    <p className="text-sm text-gray-400 mb-6">Thêm bao nhiêu bao tùy thích. Các bao sẽ được đảo lộn vị trí ngẫu nhiên.</p>

                    {/* Input Area */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={inputAmount}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setInputAmount(val ? parseInt(val).toLocaleString('vi-VN') : '');
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && addAmount()}
                            placeholder="Nhập mệnh giá..."
                            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 text-lg"
                        />
                        <button
                            onClick={() => addAmount()}
                            className="bg-tet-gold text-red-900 font-bold px-6 rounded-xl hover:bg-yellow-400 transition-colors"
                        >
                            <Plus />
                        </button>
                    </div>

                    {/* Quick Select */}
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-8">
                        {INITIAL_SUGGESTED_AMOUNTS.map(amt => (
                            <button
                                key={amt}
                                onClick={() => addAmount(amt)}
                                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-300 border border-white/5 transition-colors"
                            >
                                + {amt.toLocaleString('vi-VN')}
                            </button>
                        ))}
                    </div>

                    {/* Selected List */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-h-60 overflow-y-auto custom-scrollbar">
                        {amounts.map((amt, idx) => (
                            <div key={idx} className="bg-red-900/40 border border-red-500/30 p-3 rounded-xl flex justify-between items-center group relative overflow-hidden">
                                <span className="font-bold text-yellow-400">{amt.toLocaleString('vi-VN')}</span>
                                <button onClick={() => removeAmount(idx)} className="text-red-400 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                                <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        ))}
                        {amounts.length === 0 && (
                            <div className="col-span-full text-center py-8 text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                                Chưa có bao lì xì nào
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleStartGame}
                        disabled={amounts.length < 2}
                        className={`w-full py-4 rounded-xl font-bold text-xl transition-all shadow-lg
                            ${amounts.length < 2
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-red-900/50'
                            }`}
                    >
                        Bắt Đầu Chơi ({amounts.length} Bao)
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center">
            {/* Game Header */}
            <div className="w-full p-4 flex justify-between items-center z-20">
                <button onClick={handleReturnToSetup} className="bg-black/20 hover:bg-black/40 text-white/80 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 transition-colors">
                    <ArrowLeft size={18} /> Cấu hình lại
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-yellow-400 font-bold border border-yellow-500/20 flex items-center gap-2 transition-colors"
                    >
                        <History size={16} />
                        Lịch sử: {history.length}
                    </button>
                </div>
            </div>

            {/* History Drawer */}
            {showHistory && (
                <div className="fixed inset-x-0 bottom-0 md:inset-x-auto md:right-4 md:top-20 md:bottom-auto z-50 md:z-30 w-full md:w-80 h-[70vh] md:h-auto bg-[#1a1a1a]/95 backdrop-blur-md border-t md:border border-white/20 rounded-t-2xl md:rounded-2xl shadow-2xl p-4 animate-slide-up md:animate-slide-in-right">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                        <h3 className="font-bold text-white flex items-center gap-2"><History size={16} /> Lịch Sử ({history.length})</h3>
                        <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-2">
                        {history.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-4">Chưa có ai mở bao đâu.</p>
                        ) : (
                            history.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                    <span className="text-yellow-400 font-bold">{item.amount.toLocaleString('vi-VN')} đ</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(item.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Main Game Area */}
            <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-4 relative">

                {/* Cards Container */}
                <div className="flex flex-wrap justify-center gap-4 w-full perspective-1000">
                    <AnimatePresence>
                        {shuffledCards.map((card, index) => (
                            <motion.div
                                key={`${card.id}-${index}`} // Key ensures re-render on shuffle for animation
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    rotateY: card.isRevealed ? 180 : 0
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                    layout: { duration: 0.5 } // Shuffle animation duration
                                }}
                                onClick={() => handleCardClick(index)}
                                className={`
                                    relative w-32 h-44 md:w-40 md:h-56 cursor-pointer transition-transform duration-500
                                    ${isShuffling ? 'pointer-events-none' : ''}
                                `}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Front Face (The Red Envelope) */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-b from-red-600 to-red-800 rounded-xl border-2 border-yellow-400/50 shadow-xl flex items-center justify-center"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <div className="w-20 h-20 border-2 border-yellow-500/30 rounded-full flex items-center justify-center">
                                        <span className="font-tet text-4xl text-yellow-400">Lộc</span>
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                        <div className="w-8 h-8 mx-auto bg-yellow-400 rounded-full shadow-lg"></div>
                                    </div>
                                </div>

                                {/* Back Face (The Result) */}
                                <div
                                    className="absolute inset-0 bg-white rounded-xl border-4 border-yellow-400 shadow-xl flex flex-col items-center justify-center"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)'
                                    }}
                                >
                                    <span className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">Chúc Mừng</span>
                                    <span className="text-red-600 font-bold text-2xl md:text-3xl text-center px-2 break-all">
                                        {card.amount.toLocaleString('vi-VN')}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">VNĐ</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="mt-12 flex gap-4 z-20">
                    <button
                        onClick={handleResetRound}
                        disabled={isShuffling}
                        className="bg-white text-red-900 px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <RotateCcw /> Chơi Lại / Đảo Bài
                    </button>

                    {/* Reveal All (Optional Debug/Admin Feature) */}
                    <button
                        onClick={() => {
                            const revealed = shuffledCards.map(c => ({ ...c, isRevealed: true }));
                            setShuffledCards(revealed);
                        }}
                        disabled={isShuffling || !shuffledCards.some(c => c.isRevealed)}
                        className={`
                            px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2
                            ${isShuffling || !shuffledCards.some(c => c.isRevealed)
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-black/30 text-white hover:bg-black/50'}
                        `}
                    >
                        <Eye /> Mở Hết
                    </button>
                </div>

            </div>

            {/* Shuffling Loading Overlay */}
            {isShuffling && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/20 animate-pulse flex flex-col items-center">
                        <div className="animate-spin text-yellow-400 mb-2">
                            <Shuffle size={48} />
                        </div>
                        <span className="text-yellow-200 font-bold text-lg">Đang đảo bao...</span>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={showConfirmReset}
                onClose={() => setShowConfirmReset(false)}
                onConfirm={handleConfirmReset}
                title="Về màn hình chọn bao?"
                message="Lịch sử lượt chơi hiện tại sẽ bị mất. Bạn có chắc không?"
            />
        </div>
    );
};
