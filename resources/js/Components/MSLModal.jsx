import React from 'react';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const MSLModal = ({ 
    isOpen, 
    onClose, 
    title, 
    message, 
    type = 'info', // 'success', 'error', 'warning', 'info'
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showCancel = true 
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-8 h-8 text-green-500" />;
            case 'error':
                return <XCircle className="w-8 h-8 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
            default:
                return <AlertTriangle className="w-8 h-8 text-[#FACC15]" />;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 hover:bg-green-600';
            case 'error':
                return 'bg-red-500 hover:bg-red-600';
            case 'warning':
                return 'bg-yellow-500 hover:bg-yellow-600';
            default:
                return 'bg-[#FACC15] hover:bg-[#EAB308] text-black';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-[rgba(15,15,15,0.95)] to-[rgba(10,10,10,0.95)] rounded-lg p-6 max-w-md mx-4 border border-[#FACC15]/30 shadow-2xl backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-[rgba(10,10,10,0.8)] rounded-full flex items-center justify-center border border-[#FACC15]/30">
                            {getIcon()}
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Message */}
                <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 ${getButtonColor()} text-white rounded-lg transition-colors font-medium`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MSLModal;
