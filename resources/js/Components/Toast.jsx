import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-400" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-400" />;
            default:
                return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-900/90 border-green-500/50';
            case 'error':
                return 'bg-red-900/90 border-red-500/50';
            case 'warning':
                return 'bg-yellow-900/90 border-yellow-500/50';
            default:
                return 'bg-blue-900/90 border-blue-500/50';
        }
    };

    return createPortal(
        <div className={`fixed top-4 right-4 z-[9999] max-w-sm w-full ${getBackgroundColor()} border rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out transform translate-x-0`}>
            <div className="flex items-start p-4">
                <div className="flex-shrink-0 mr-3 mt-0.5">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                        {message}
                    </p>
                </div>
                <div className="flex-shrink-0 ml-3">
                    <button
                        onClick={onClose}
                        className="inline-flex text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Toast; 