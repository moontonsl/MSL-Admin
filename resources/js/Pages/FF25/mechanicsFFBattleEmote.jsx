import React from "react";

export default function MechanicsFFBattleEmote({ onClose, onAgree }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-lg max-w-xl w-full border border-pink-200/40 text-[#1a1f7a]">

        <h2 className="text-2xl font-extrabold text-pink-600 mb-4 text-center drop-shadow-sm">
          😆 FF Battle Emote Mechanics 🤩
        </h2>

        <div className="text-[15px] space-y-3 max-h-[60vh] overflow-y-auto leading-relaxed pr-1">

          <p>• Claim the official emotes of <strong>Ashtine</strong>, <strong>Rabin</strong>, and <strong>Ashtine</strong> in-game.</p>

          <p>• Take a <strong>screenshot or screen recording</strong> while obtaining the emote and while using it in your matches.</p>

          <p>• Create a <strong>Facebook or TikTok post</strong>. Creative content is highly encouraged!</p>

         <p className="ml-5 text-gray-700 italic">
            Examples: A screenshot of claiming the emote, or a video showcasing the emote in-game.
          </p>

          <p>• Tag <strong>3 friends</strong> and encourage them to get the emote too.</p>

          <p>
            • Tag the official pages:  
            <br /> <span className="ml-4">– <strong>Mobile Legends: Bang Bang</strong></span>  
            <br /> <span className="ml-4">– <strong>MSL Philippines</strong></span>
          </p>

          <p>• Add your <strong>own watermark</strong> on every picture.</p>

          <p>• Submit your post link along with your in-game information on the registration form.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-pink-600 hover:bg-pink-700 transition-all text-white py-3 font-semibold rounded-xl shadow-md active:scale-[0.97]"
        >
          I AGREE
        </button>
      </div>
    </div>
  );
}