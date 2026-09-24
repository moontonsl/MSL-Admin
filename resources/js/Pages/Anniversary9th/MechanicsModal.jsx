import React from "react";

export default function MechanicsModal({ onClose, onDone }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="
          bg-white text-black
          p-6 sm:p-10
          rounded-2xl shadow-xl text-left
          w-full
          max-w-full sm:max-w-3xl
          border border-gray-300
          overflow-y-scroll max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          MECHANICS
        </h2>

        <div className="text-center">
          <ol className="list-decimal list-outside pl-5 sm:pl-8 w-full space-y-4 sm:space-y-5 text-sm sm:text-lg leading-relaxed inline-block text-left">
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              This challenge is open to <strong>individuals, duos, or groups of all ages!</strong>
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Create a <strong>poster to celebrate MLBB’s 9th Birthday</strong> (digital or hand-drawn).
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Upload your poster on <strong>TikTok, Facebook, or Instagram</strong> with hashtags:{" "}
              <span className="font-semibold text-yellow-600">
                #MLBB9thPoster #Happy9thMLBB #MoontonStudentLeaders #MLBBCommunityHeroes
              </span>
            </li>
            <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
              Submit your entry at <strong>at this form</strong>. Fill out your information:{" "}
              <strong>Name, UID, Server, IGN, Facebook profile link, School Name/Community, Posting link.</strong>
            </li>
          </ol>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              onDone();
              onClose();
            }}
            className="px-8 sm:px-10 py-3 rounded-lg border-none bg-yellow-400 text-black font-bold cursor-pointer text-lg sm:text-xl w-72 sm:w-80"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}