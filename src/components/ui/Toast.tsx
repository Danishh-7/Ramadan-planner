import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'loading';
    isVisible: boolean;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible && type !== 'loading') {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, type]);

    if (!isVisible) return null;

    const bgColors = {
        success: 'bg-[#4a342e] text-white',
        error: 'bg-red-600 text-white',
        loading: 'bg-secondary text-[#4a342e]',
    };

    const icons = {
        success: <CheckCircle2 className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        loading: <Loader2 className="w-5 h-5 animate-spin" />,
    };

    return (
        <div className={`fixed bottom-6 right-6 z-[100] ${bgColors[type]} px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm tracking-wide animate-slide-in`}>
            {icons[type]}
            {message}
        </div>
    );
};
