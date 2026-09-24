import React from "react";

export default function ModalMechanics({ onClose, onAgree }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
         className="bg-black text-white border border-[#F2C21A] rounded-2xl shadow-2xl max-w-3xl w-full h-[70vh] overflow-y-auto flex flex-col mt-10 sm:mt-0"
         onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#F2C21A]">
          <h2 className="text-lg sm:text-2xl font-bold text-[#F2C21A] text-center">
            Tournament Mechanics
          </h2>
        </div>

        {/* Scrollable content */}
        <div
            className="p-4 sm:p-6 overflow-y-auto text-gray-300 text-sm sm:text-base leading-relaxed space-y-4
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-black
            [&::-webkit-scrollbar-thumb]:bg-[#F2C21A]
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-[#ddb518]"
            >
          <section>
            <h3 className="font-bold text-[#F2C21A] mb-1">ELIGIBILITY OF THE PLAYERS</h3>
            <p>
                This is a campus-exclusive event for the{" "}
                <span className="text-[#F2C21A] font-semibold">high school</span> and{" "}
                <span className="text-[#F2C21A] font-semibold">college</span> students only.
                Students who have not enrolled in this school for the past 1 year cannot join the tournament.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#F2C21A] mb-1">TEAM COMPOSITION</h3>
            <p>
              A team should register five {" "}
                <span className="text-[#F2C21A] font-semibold">(5) members only</span>. Only registered players are allowed to play.
              No changing of players, teams are not allowed to play a 4vs5 if a player went missing.
              Players/Teams who are found to have duplicate entries will have their registration voided without notice.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#F2C21A] mb-1">BRACKETS AND MATCH-MAKING</h3>
            <p>
              All teams will be randomized by Challonge's system. The one randomly placed above in a match bracket
              (“upper seed”) will be the "first pick" and will be the one to create the game lobby (Tournament Draft).
              Games are BO1, teams will only play against each other once even in the finals.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#F2C21A] mb-1">INTERNET CONNECTIVITY</h3>
            <p>
              All games from start to finish will be considered as a Ranked Game (no pauses, no remakes, play even if
              your teammate got disconnected).
              The game room owner may start the game once both teams are ready and have agreed to start the game.
              Teams that are not ready within 10 min from the agreed time with their opponents or the Moonton Student
              Leaders can be considered as no show and will be disqualified from the tournament.
              The winner should screenshot the end game result and send it to the Student Leader/tournament group chat
              for confirmation of the match result. No post-result screenshot = invalid report and disqualification.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#F2C21A] mb-1">PROPER PLAYER CONDUCT</h3>
            <p>
              Our Moonton Student Leaders are taught to be considerate, fair and will handle the players with care.
              We ask that the players should also be considerate with our rulings and also show good behavior and
              sportsmanship to our Moonton Student Leaders and the other players.
              Please join and play all online events handled by your student leaders with good and proper conduct
              (no trash talking, no taunting, do not use or say any words that will hurt other students or the Student Leaders
              in game, in social media, or inside the campus). Let's all be part of a happy community.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#F2C21A] mb-1">DISQUALIFICATION</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Dishonest or fake information (e.g., wrong Facebook account, player info, or location).</li>
              <li>A team who shows bad behavior, toxicity, or attitude problems in game or chat.</li>
              <li>Dishonest and wrong information will disqualify the whole team.</li>
              <li>No show or failure to have a complete team within 10 minutes of the scheduled match.</li>
              <li>Any forms of cheating, such as use of 3rd party apps or piloting unregistered players.</li>
            </ul>
            <p className="mt-2">
              <strong>Note:</strong> Disputes upon a match result will only be entertained 5 minutes after sending the end game result.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#F2C21A] mb-1 w-full text-base sm:text-lg">
                MOONTON STUDENT LEADERS HAVE THE RIGHTS TO DECIDE AND HANDLE A SITUATION
            </h3>
            <p>
              MSLs can disqualify players/teams who are found to be problematic in being part of this community.
              Student Leaders can decide for the winning team or take extra steps to solve disputes as necessary.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#F2C21A] mb-1">WINNING DISPUTE</h3>
            <p>
              Diamond winnings will be sent to the players 1–2 weeks after the tournament date, unless there is an internal issue.
              Players should contact their MSLs within 2 weeks if they have not received their rewards.
              <strong> Note:</strong> Wrong UID or server input during registration is not a valid reason for dispute.
              Please double-check your entries.
            </p>
          </section>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 p-4 sm:p-6 border-t border-[#F2C21A]">
          <button
            onClick={onAgree}
            className="bg-[#F2C21A] hover:bg-[#ddb518] text-black font-bold py-2 px-5 rounded-lg transition-colors"
          >
            I Agree
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}