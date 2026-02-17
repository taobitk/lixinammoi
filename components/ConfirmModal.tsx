import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1a1a1a] border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in relative">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-500">
                        <AlertTriangle size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-gray-300">{message}</p>

                    <div className="flex gap-3 w-full mt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                        >
                            Đồng ý
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
