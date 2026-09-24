import React from "react";
import { Link } from "@inertiajs/react";

export default function WinNavigation() {
    return (
        <div className="voting-navigation flex flex-wrap justify-center gap-3 my-4">
            <Link
                href="/mcc/voting/vote"
                className="vote-button bg-[#F3C718] text-black px-4 py-2 rounded-md font-bold hover:bg-opacity-80 transition"
            >
                VOTE
            </Link>
            <Link
                href="/mcc/voting/winners"
                className="winners-button border border-[#F3C718] text-[#F3C718] px-4 py-2 rounded-md font-bold hover:bg-[#F3C718] hover:bg-opacity-10 transition"
            >
                VIEW WINNERS
            </Link>
        </div>
    );
}
