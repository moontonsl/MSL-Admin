import React from 'react';

export default function SubmissionSuccessModal({ isOpen, onYes, onNo }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#151515] rounded-[12px] border-[3px] border-white/5 px-6 py-12 md:px-8 md:py-12 w-[95%] max-w-[650px] md:max-w-[500px] shadow-[0_4px_80px_0_rgba(251,191,36,0.25)] flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-[28px] font-bold text-white mb-7 tracking-wide">
          Successfully Submitted!
        </h2>

        <div className="flex flex-col items-center justify-center gap-1 mb-9 text-[#E5E5E5] text-sm md:text-[15px]">
          <p>Wait for the verification email of MSL Network Awards committee.</p>
          <p>Thank you!</p>
          <p className="mt-8">Do you want to nominate again in other awards?</p>
        </div>

        <div className="flex flex-row gap-4 md:gap-6 w-full">
          <button
            type="button"
            onClick={onYes}
            className="flex-1 bg-[#FBBF24] text-black font-bold font-sans py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-lg"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={onNo}
            className="flex-1 bg-[#28282B] text-white font-bold font-sans py-4 rounded-xl hover:bg-[#333333] active:scale-[0.98] transition-all text-lg border border-white/10"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

