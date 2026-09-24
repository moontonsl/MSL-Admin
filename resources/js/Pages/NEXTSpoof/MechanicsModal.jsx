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
            overflow-y-auto 
            max-h-[60vh] sm:max-h-[80vh]
        "
        onClick={(e) => e.stopPropagation()}
        >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          MECHANICS
        </h2>

        <ol className="list-decimal list-inside sm:list-outside w-full space-y-4 sm:space-y-5 text-sm sm:text-lg leading-relaxed">
        <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
            This challenge is open to <strong>individuals, duos, or groups</strong> aged{" "}
            <strong>18 years old and above</strong>.
        </li>
        <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
            Watch the <strong>Project NEXT Flicks Videos</strong> on the official platforms of{" "}
            <strong>Mobile Legends: Bang Bang, Moonton Student Leaders (MSL),</strong> or{" "}
            <strong>MLBB Community Heroes</strong>.
        </li>
        <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
            Recreate or make a parody (<strong>maximum of 30 seconds</strong>) of any scene from the NEXT
            Flicks videos. Be creative in making your video!
        </li>
        <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
            <strong>For MSL Community Entries:</strong> Showcase your school by shooting your entry at any
            landmark or famous place on your campus.
        </li>
        <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
            <strong>For Community Heroes Entries:</strong> Showcase your barangay by shooting your entry in
            any part of your community.
        </li>
        <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
            Videos should <strong>not contain offensive language, visuals, or music</strong> outside of MLBB
            Assets.
        </li>
        <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
            Post your video publicly on <strong>Facebook</strong> or <strong>TikTok</strong> using the
            hashtags:{" "}
            <span className="font-semibold text-yellow-600">
            #PVRemix #ProjectNEXT #MoontonStudentLeaders #MLBBCommunityHeroes #MSLxCHSpoofChallenge
            </span>
        </li>
        <li className="w-full p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm">
            Submit your entry at this form. Fill in your information required:{" "}
            <strong>Name, UID, Server, IGN, School Name/Community, Entry link</strong>.
        </li>
        </ol>


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