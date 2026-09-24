import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";

import BG from "../Assets/Images/BGGM26.png";

import GMComm from "../Assets/Images/COMM.png";
import GMNet from "../Assets/Images/NET.png";
import GMLogo from "../Assets/Images/GM26.png";

export default function GM26() {
    return (
        <AuthenticatedLayout>
            <Head title="GM26 Page" />
            <Helmet>
                <title>GM26</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <div className=" relative z-50 min-h-screen flex flex-col items-center justify-start text-white p-4 pt-12 sm:pt-20 font-['Montserrat'] bg-cover bg-center bg-no-repeat " style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed", }} >
                {/* Logo */}
                <div className="text-center mb-2 sm:mb-16">
                    <Link href="/GM26">
                        <img
                            src={GMLogo}
                            alt="GM26 Logo"
                            className="w-72 sm:w-96 lg:w-[28rem] mx-auto drop-shadow-xl cursor-pointer"
                        />
                    </Link>
                </div>

                {/* 2 Image Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 place-items-center w-full max-w-3xl">
                    <Link href="/GM26/Comm">
                        <img
                            src={GMComm}
                            alt="Battle Emote"
                            className="w-52 sm:w-60 lg:w-64 hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                    </Link>

                    <Link href="/GM26/Network">
                        <img
                            src={GMNet}
                            alt="Freedom Wall"
                            className="w-52 sm:w-60 lg:w-64 hover:scale-105 transition-transform duration-200 cursor-pointer"
                        />
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
