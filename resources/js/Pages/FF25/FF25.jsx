import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";

import BG from "./BG.png";
import FFAttendance from "./FFAttendnce.png";
import FFBattleEmote from "./FFBattleEmote.png";
import FFFreedomWall from "./FFFreedomWall.png";
import FFLogo from "./FF2xMSL_logo.png";

export default function FF25() {
  return (
    <AuthenticatedLayout>
      <Head title="FF25 Attendance Registration" />
      <Helmet>
        <title>FF25</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div
        className="
          relative z-50 min-h-screen 
          flex flex-col items-center justify-start
          text-white p-4 pt-12 sm:pt-20
          font-['Montserrat']
          bg-cover bg-center bg-no-repeat
        "
        style={{
          backgroundImage: `url(${BG})`,
          backgroundAttachment: "fixed",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-2 sm:mb-16">
          <Link href="/FF25">
            <img
              src={FFLogo}
              alt="FF25 MSL Logo"
              className="w-56 sm:w-64 lg:w-72 mx-auto drop-shadow-lg cursor-pointer"
            />
          </Link>
        </div>

        {/* 3 Image Navigation */}
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-3 
            gap-1 sm:gap-10   
            place-items-center
            w-full max-w-6xl
          "
        >
          {/* Attendance */}
          <Link href="/FF25Attendance">
            <img
              src={FFAttendance}
              alt="Attendance"
              className="w-56 sm:w-64 lg:w-72 hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          </Link>

          {/* Battle Emote */}
          {/* <Link href="/FFBattleEmote"> */}
          <Link href="">
            <img
              src={FFBattleEmote}
              alt="Battle Emote"
              className="w-56 sm:w-64 lg:w-72 hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          </Link>

          {/* Freedom Wall */}
          <Link href="/FFFreedomWall">
            <img
              src={FFFreedomWall}
              alt="Freedom Wall"
              className="w-56 sm:w-64 lg:w-72 hover:scale-105 transition-transform duration-200 cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}