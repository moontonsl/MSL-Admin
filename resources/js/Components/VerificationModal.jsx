import React from 'react';

export default function VerificationModal({ isOpen, onContinue, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111111] border-2 border-[#FBBF24] rounded-2xl p-8 md:p-12 w-full max-w-[480px] shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl md:text-3xl font-black font-heading text-white text-center mb-6">
          Verify your MLBB Account
        </h2>

        <p className="text-gray-300 font-sans text-center text-sm md:text-base leading-relaxed mb-10">
          You will be redirected to log in and verify your Mobile Legends account. This step confirms your MLBB profile
          before submitting your entry.
        </p>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={onContinue}
            className="w-full bg-[#FBBF24] text-black font-bold font-sans py-3.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Continue
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-[#222222] text-white font-bold font-sans py-3.5 rounded-lg hover:bg-[#333333] active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

