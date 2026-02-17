import React, { useState, useEffect } from 'react';
import { PrizeTier } from '../types';
import { Plus, Play, ArrowRight, ArrowLeft, TrendingDown, TrendingUp, Equal, X, Grid, Check } from 'lucide-react';

const SUGGESTED_AMOUNTS = [
  10000, 20000, 30000, 50000, 80000,
  100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000
];

interface SetupPanelProps {
  tiers: PrizeTier[];
  setTiers: React.Dispatch<React.SetStateAction<PrizeTier[]>>;
  onStart: () => void;
}

// Helper to generate colors
const getRandomColor = (index: number) => {
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-orange-500', 'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500'];
  return colors[index % colors.length];
};

export const SetupPanel: React.FC<SetupPanelProps> = ({ tiers, setTiers, onStart }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [newAmount, setNewAmount] = useState<string>('');

  // Temporary state for managing amounts before they become full tiers
  const [amountList, setAmountList] = useState<number[]>([]);

  // Quick Select State
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [tempSelected, setTempSelected] = useState<number[]>([]);

  // Initialize amountList from existing tiers if returning to setup
  useEffect(() => {
    if (tiers.length > 0 && amountList.length === 0) {
      setAmountList(tiers.map(t => t.amount));
    }
  }, []);

  // --- STEP 1 LOGIC: INPUT AMOUNTS ---
  const addAmount = () => {
    const val = parseInt(newAmount.replace(/\D/g, ''));
    if (!isNaN(val) && val > 0) {
      if (!amountList.includes(val)) {
        setAmountList([...amountList, val]);
      }
      setNewAmount('');
    }
  };

  const removeAmount = (index: number) => {
    const newList = [...amountList];
    newList.splice(index, 1);
    setAmountList(newList);
  };

  const proceedToStep2 = () => {
    if (amountList.length === 0) return;

    // Create tiers with 0 probability initially
    const initialTiers: PrizeTier[] = amountList.map((amt, idx) => ({
      id: `tier-${Date.now()}-${idx}`,
      amount: amt,
      probability: 0,
      color: getRandomColor(idx)
    }));

    setTiers(initialTiers);
    setStep(2);
  };

  // --- STEP 2 LOGIC: PROBABILITIES ---

  const updateProbability = (id: string, newProb: number) => {
    // Limit to 2 decimal places
    const validProb = Math.min(100, Math.max(0, parseFloat(newProb.toFixed(2))));
    setTiers(tiers.map(t => t.id === id ? { ...t, probability: validProb } : t));
  };

  const currentTotal = parseFloat(tiers.reduce((sum, t) => sum + (t.probability || 0), 0).toFixed(2));


  // AUTO CALCULATION ALGORITHMS

  const distributeEqual = () => {
    const count = tiers.length;
    if (count === 0) return;

    const baseRaw = 100 / count;
    // Round to 2 decimals
    const base = Math.floor(baseRaw * 100) / 100;

    let allocated = 0;
    const newTiers = tiers.map((t, i) => {
      // Last item takes the remainder to ensure 100%
      if (i === count - 1) {
        const remainder = parseFloat((100 - allocated).toFixed(2));
        return { ...t, probability: remainder };
      }
      allocated += base;
      return { ...t, probability: base };
    });
    setTiers(newTiers);
  };

  // Helper for weighted distribution with minimum floor
  const distributeWithWeights = (type: 'desc' | 'asc') => {
    if (tiers.length === 0) return;

    // Always sort by amount first for consistent logic
    const sorted = [...tiers].sort((a, b) => a.amount - b.amount);
    const n = sorted.length;

    // Ensure at least 4% per item if possible
    let minRate = 4;
    if (n * minRate > 100) {
      minRate = Math.floor((100 / n) * 100) / 100; // Fallback if too many items
    }

    const pool = 100 - (n * minRate);
    const totalWeight = (n * (n + 1)) / 2;

    let allocated = 0;
    const newTiers = sorted.map((t, i) => {
      // desc: Small amount (index 0) gets highest weight (n)
      // asc: Small amount (index 0) gets lowest weight (1)
      const weight = type === 'desc' ? (n - i) : (i + 1);

      // Calculate share from the pool
      const rawShare = (weight / totalWeight) * pool;
      const share = Math.floor(rawShare * 100) / 100;

      let prob = parseFloat((minRate + share).toFixed(2));

      // Accumulate logic will be handled by remainder check for last item to be safe, but here we do it iteratively
      // Actually standard way:
      allocated += prob;
      return { ...t, probability: prob };
    });

    // Fix rounding errors by adjusting the last item (or first depending on logic, but last is simpler)
    // Wait, the previous logic adjusted the highest probability item. Let's stick to adjusting the "remainder" to ensure sum is 100.
    // Re-calculating allocated to match map
    allocated = parseFloat(newTiers.reduce((acc, t) => acc + t.probability, 0).toFixed(2));
    const remainder = parseFloat((100 - allocated).toFixed(2));

    if (remainder !== 0) {
      // Add remainder to the item with highest weight/probability to minimalize impact
      if (type === 'desc') {
        newTiers[0].probability = parseFloat((newTiers[0].probability + remainder).toFixed(2));
      } else {
        newTiers[n - 1].probability = parseFloat((newTiers[n - 1].probability + remainder).toFixed(2));
      }
    }

    setTiers(newTiers);
  };

  // Small money gets HIGH probability (Safest for owner)
  const distributeDescending = () => distributeWithWeights('desc');

  // Small money gets LOW probability (Jackpot style)
  const distributeAscending = () => distributeWithWeights('asc');

  // --- RENDER ---

  if (step === 1) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl animate-pop-in">
        <h2 className="text-3xl font-tet text-tet-gold text-center mb-2 drop-shadow-md">Bước 1: Nhập Số Tiền</h2>
        <p className="text-center text-gray-300 text-sm mb-6">Nhập tất cả các mệnh giá lì xì bạn muốn có.</p>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newAmount}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, '');
              if (!rawValue) {
                setNewAmount('');
                return;
              }
              const formattedValue = parseInt(rawValue).toLocaleString('vi-VN');
              setNewAmount(formattedValue);
            }}
            onKeyDown={(e) => e.key === 'Enter' && addAmount()}
            placeholder="Mời bạn nhập số tiền"
            className="flex-1 bg-black/30 border border-yellow-500/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
          />
          <button
            onClick={addAmount}
            className="bg-tet-gold hover:bg-yellow-400 text-red-900 p-3 rounded-lg font-bold"
          >
            <Plus size={24} />
          </button>
        </div>

        <button
          onClick={() => {
            setTempSelected([]);
            setShowQuickSelect(true);
          }}
          className="w-full mb-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-yellow-200 flex items-center justify-center gap-2 transition-colors"
        >
          <Grid size={16} /> Chọn nhanh các mệnh giá phổ biến
        </button>

        {/* Quick Select Modal */}
        {showQuickSelect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1a1a1a] border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Chọn Mệnh Giá</h3>
                <button onClick={() => setShowQuickSelect(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {SUGGESTED_AMOUNTS.map((amt) => {
                  const isSelected = tempSelected.includes(amt) || amountList.includes(amt);
                  const isAlreadyAdded = amountList.includes(amt);

                  return (
                    <button
                      key={amt}
                      disabled={isAlreadyAdded}
                      onClick={() => {
                        if (tempSelected.includes(amt)) {
                          setTempSelected(tempSelected.filter(t => t !== amt));
                        } else {
                          setTempSelected([...tempSelected, amt]);
                        }
                      }}
                      className={`
                            py-2 rounded-lg text-sm font-bold border transition-all relative
                            ${isAlreadyAdded
                          ? 'bg-green-900/40 border-green-800 text-green-500 cursor-not-allowed'
                          : tempSelected.includes(amt)
                            ? 'bg-yellow-500 text-red-900 border-yellow-400'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                        }
                          `}
                    >
                      {amt.toLocaleString('vi-VN')}
                      {isAlreadyAdded && <Check size={12} className="absolute top-1 right-1" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowQuickSelect(false)}
                  className="flex-1 py-2 text-gray-300 hover:text-white font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    const validNew = tempSelected.filter(t => !amountList.includes(t));
                    setAmountList([...amountList, ...validNew]);
                    setShowQuickSelect(false);
                  }}
                  disabled={tempSelected.length === 0}
                  className={`flex-1 py-2 rounded-xl font-bold text-red-900 transition-colors ${tempSelected.length === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-tet-gold hover:bg-yellow-400'}`}
                >
                  Thêm ({tempSelected.length})
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar mb-6">
          {amountList.length === 0 && (
            <div className="text-center text-gray-500 py-8 border-2 border-dashed border-white/10 rounded-lg">
              Chưa có mệnh giá nào
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {amountList.map((amt, idx) => (
              <div key={idx} className="bg-black/40 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-yellow-300 font-bold">{amt.toLocaleString('vi-VN')}</span>
                <button onClick={() => removeAmount(idx)} className="text-red-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={proceedToStep2}
          disabled={amountList.length === 0}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
            ${amountList.length === 0 ? 'bg-gray-700 text-gray-500' : 'bg-tet-red hover:bg-red-600 text-white shadow-lg'}`}
        >
          Tiếp tục <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl animate-pop-in">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setStep(1)} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Quay lại
        </button>
        <span className="text-yellow-200 font-bold">Bước 2: Chỉnh Tỉ Lệ</span>
      </div>

      {/* Auto Tools */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button onClick={distributeEqual} className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 rounded-lg p-2 flex flex-col items-center gap-1 text-xs text-blue-100 transition-colors">
          <Equal size={20} /> Cân bằng
        </button>
        <button onClick={distributeDescending} className="bg-green-600/30 hover:bg-green-600/50 border border-green-400/30 rounded-lg p-2 flex flex-col items-center gap-1 text-xs text-green-100 transition-colors">
          <TrendingDown size={20} />
          <span>Tiền to khó</span>
        </button>
        <button onClick={distributeAscending} className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 rounded-lg p-2 flex flex-col items-center gap-1 text-xs text-purple-100 transition-colors">
          <TrendingUp size={20} />
          <span>Tiền to dễ</span>
        </button>
      </div>

      {/* List inputs */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar mb-6 pr-2">
        {tiers.map((tier) => (
          <div key={tier.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-8 rounded-full ${tier.color}`}></div>
              <span className="font-bold text-white text-lg">{tier.amount.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tier.probability === 0 ? '' : tier.probability}
                onChange={(e) => updateProbability(tier.id, parseFloat(e.target.value) || 0)}
                step="0.01"
                className={`w-20 bg-black/40 border rounded px-2 py-1 text-right text-white focus:outline-none ${tier.probability > 0 ? 'border-green-500' : 'border-red-500'}`}
                placeholder="0.00"
              />
              <span className="text-gray-400 text-sm">%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-white/10 pt-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300">Tổng tỉ lệ:</span>
          <span className={`font-bold ${currentTotal === 100 ? 'text-green-400' : 'text-red-400'}`}>
            {currentTotal}% / 100%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden flex">
          {tiers.map((t) => t.probability > 0 && (
            <div
              key={t.id}
              style={{ width: `${(t.probability / 100) * 100}%` }}
              className={`${t.color} h-full`}
            ></div>
          ))}
        </div>
        {currentTotal !== 100 && (
          <p className="text-xs text-red-400 mt-2 text-center animate-pulse">Tổng tỉ lệ phải bằng đúng 100%.</p>
        )}
      </div>

      <button
        onClick={onStart}
        disabled={currentTotal !== 100}
        className={`w-full py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 shadow-lg transition-all
          ${currentTotal !== 100
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-tet-gold to-yellow-500 text-red-900 hover:scale-105 active:scale-95'
          }`}
      >
        <Play fill="currentColor" />
        Bắt Đầu Lì Xì
      </button>
    </div>
  );
};
