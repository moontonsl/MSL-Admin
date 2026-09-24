import React from "react";

export default function MechanicsFFFreedomWall({ onClose, onAgree }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-lg max-w-xl w-full border border-pink-200/40 text-[#1a1f7a]">

        <h2 className="text-xl font-extrabold text-pink-600 mb-4 text-center drop-shadow-sm whitespace-nowrap">
          🌟 Friendship Flex: Share Your MLBB Story 🌟
        </h2>

        <div className="text-[15px] space-y-3 max-h-[60vh] overflow-y-auto leading-relaxed pr-1">

          <p>
            • <strong>Recall your friends</strong> and your most memorable friendship moments, especially those built through <strong>Mobile Legends: Bang Bang (MLBB)</strong>.
          </p>
          
          <p>
            • Submit your story (not more than <strong>**100 words**</strong>) along with a photo with the friends you want to flex.
          </p>

          <p className="text-pink-600">
            • All chosen and posted entries will automatically win <strong>💎 diamonds 💎</strong>!
          </p>
          
        </div>

        <button
          // Keeping onClick={onClose} as it seems to be the intended behavior for closing the modal
          onClick={onClose} 
          className="w-full mt-5 bg-pink-600 hover:bg-pink-700 transition-all text-white py-3 font-semibold rounded-xl shadow-md active:scale-[0.97]"
        >
          I AGREE
        </button>
      </div>
    </div>
  );
}