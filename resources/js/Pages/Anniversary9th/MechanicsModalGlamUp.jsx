import React from "react";

export default function MechanicsModal({ onClose, onDone }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="
          bg-white text-gray-800
          p-8 sm:p-12
          rounded-3xl shadow-2xl text-left
          w-full
          max-w-full sm:max-w-4xl
          border border-gray-200
          overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        "
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900">
          Mechanics
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
            <p className="text-gray-700 font-medium">Open to all ages, individual or squad (maximum of 3 members).</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-400">
            <p className="text-gray-700 font-medium">Watch the tutorial video for the B.A.N.G. dance steps on the official Facebook and TikTok accounts of MSL Philippines and MLBB Community Heroes.</p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400">
            <p className="text-gray-700 font-medium">Do a MLBB Hero skin or Girl Group-inspired glam (make-up, hair, or outfit).</p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-400">
            <div className="text-gray-700 font-medium">
              <p className="mb-2">Create your own dance version (15 seconds to 1 minute).</p>
              <p className="text-sm text-gray-600">• For MSL Community Entries: Showcase your school by shooting your entry at any landmark or famous place on your campus.</p>
              <p className="text-sm text-gray-600">• For Community Heroes Entries: Showcase your barangay by shooting your entry in any part of your community.</p>
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-xl border-l-4 border-red-400">
            <p className="text-gray-700 font-medium">Participants must use only the song 'B.A.N.G.' — the official 9th Anniversary music of MLBB. Music edits or remixes are not allowed.</p>
          </div>
          
          <div className="p-4 bg-teal-50 rounded-xl border-l-4 border-teal-400">
            <p className="text-gray-700 font-medium">Video editing and the application of visual effects are allowed.</p>
          </div>
          
          <div className="p-4 bg-pink-50 rounded-xl border-l-4 border-pink-400">
            <p className="text-gray-700 font-medium">Videos must not include any offensive gestures or visuals.</p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-400">
            <div className="text-gray-700 font-medium">
              <p className="mb-2">Post your video publicly on Facebook or TikTok using the hashtags:</p>
              <div className="bg-yellow-100 p-3 rounded-lg mt-2">
                <span className="font-semibold text-gray-800 text-sm">
                  #MLBBGoGirlGlamUp #MLBB9thToMeetYou #MLBB9TH #HIBIBI #MSLPhilippines #CommunityHeroes #MobileLegendsBangBang
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-400">
            <p className="text-gray-700 font-medium">Tag the official pages of Mobile Legends: Bang Bang in every posting.</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border-l-4 border-gray-400">
            <p className="text-gray-700 font-medium">Submit your entry at <span className="font-semibold text-blue-600">www.moontonslph.org/9thGlamUp</span>. Fill in your information required (Name, UID, Server, IGN, School Name/Community, Entry link)</p>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              onDone();
              onClose();
            }}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold text-lg w-80 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}