import React, { useState, useEffect } from "react";
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsWatchFest.jsx";
import styles from './MCCWatchFestReg.module.scss';

const REGIONS = ["Luzon", "Visayas", "Mindanao"];

const REGION_VENUE_MAP = {
    Luzon: ["Pampanga - North and Central Luzon Esports Council", "Laguna State Polytechnic University", "First Asia Institute of Technology and Humanities", "Batangas State University - Alangilan" ],
    Visayas: ["PHINMA – University of Iloilo", "University of St. La Salle - Bacolod City"],
    Mindanao: ["Ateneo de Davao University", "University of Southeastern Philippines - Obrero Campus"],
};

const AVAILABLE_DATES = [
    { value: "2025-07-11", label: "July 11, 2025" },
    { value: "2025-07-12", label: "July 12, 2025" },
    { value: "2025-07-13", label: "July 13, 2025" },
];

const MCCWatchFestReg = () => {
    const [form, setForm] = useState({
        fullName: "",
        region: REGIONS[0],
        venue: "",
        eventDate: "",
        email: "",
        mlbbId: "",
        mlbbServer: "",
    });

    const [isMobile, setIsMobile] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            if (name === "region") {
                return { ...prev, region: value, venue: "" };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleNumericChange = (e, field) => {
        const val = e.target.value.replace(/\D/g, "");
        setForm((prev) => ({ ...prev, [field]: val }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("entry.1221870114", form.fullName);
        formData.append("entry.633497335", form.region);
        formData.append("entry.23075109", form.venue);
        formData.append("entry.9346476", form.eventDate);
        formData.append("entry.740517787", form.email);
        formData.append("entry.698807122", form.mlbbId);
        formData.append("entry.1253661770", form.mlbbServer);

        fetch("https://docs.google.com/forms/d/1_JQs7rfr-arFQtAb9X5vG_tpej9Em8pphqTVfUnMO8E/formResponse", {
            method: "POST",
            mode: "no-cors",
            body: formData,
        }).then(() => {
            setShowModal(true);
            setForm({
                fullName: "",
                region: REGIONS[0],
                venue: "",
                eventDate: "",
                email: "",
                mlbbId: "",
                mlbbServer: "",
            });
        });
    };

    return (
        <>
            <Head title="MCC Watch Fest Registration" />
            <AuthenticatedLayout>
                <div className="flex items-center justify-center min-h-[70vh] md:min-h-screen px-2 md:px-4 bg-gradient-to-b from-transparent via-black/20 to-black relative z-10">

                    <div className="w-full max-w-[365px] md:max-w-2xl text-center relative z-20 -mt-16 mb-10 px-4">
                        <img
                            src="/MCC_HLOGO.png"
                            alt="MCC Logo"
                            className="w-[250px] h-[200px] md:w-[400px] md:h-[320px] mt-6 md:mt-10 block mx-auto object-contain"
                        />
                        <div className="rounded-xl pt-4 px-4 pb-10 md:rounded-3xl md:p-10 shadow-lg md:shadow-2xl border border-white">
                            <div class="text-white font-bold text-3xl mb-6 md:text-3xl text-xl">
                                REGISTRATION DETAILS
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col ">
                                <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className={styles.inputField} />                          
                                <select name="region" value={form.region} onChange={handleChange} required className="mb-4 p-3 rounded-lg border border-white bg-black bg-opacity-30 text-white text-base outline-none text-center appearance-none bg-arrow bg-no-repeat bg-[center_right_1rem] bg-contain w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" >
                                    <option value="" disabled className="bg-gray-800 text-white" >
                                        Select Region
                                    </option>
                                    {REGIONS.map((region) => (
                                        <option
                                            key={region}
                                            value={region}
                                            className="bg-gray-800 text-white
                                                    hover:bg-yellow-700 hover:text-white
                                                    focus:bg-yellow-700 focus:text-white
                                                    active:bg-yellow-600"
                                        >
                                            {region}
                                        </option>
                                    ))}
                                </select>
                                <select name="venue" value={form.venue} onChange={handleChange} required className="mb-4 p-3 rounded-lg border border-white bg-black bg-opacity-30 text-white text-base outline-none text-center appearance-none bg-arrow bg-no-repeat bg-[center_right_1rem] bg-contain focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                                    <option value="" disabled className="bg-gray-800 text-white" >
                                        Select Venue
                                    </option>
                                    {REGION_VENUE_MAP[form.region].map((venue) => (
                                    <option key={venue} value={venue} className="bg-gray-800 text-white" >
                                        {venue}
                                    </option>
                                    ))}
                                </select>
                                <div className="relative w-full">
                                    <select id="eventDate" name="eventDate" value={form.eventDate} onChange={handleChange} required className={`mb-4 p-3 rounded-lg border border-white bg-black bg-opacity-30 text-base outline-none text-center appearance-none bg-arrow bg-no-repeat bg-[center_right_1rem] bg-contain w-full ${form.eventDate ? 'text-white' : 'text-white'} focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`} >
                                        <option value="" disabled className="bg-gray-800 text-white" selected={!form.eventDate}>
                                            Select Event Date
                                        </option>
                                        {AVAILABLE_DATES.map((date) => (
                                        <option key={date.value} value={date.value} className="bg-gray-800 text-white hover:bg-yellow-700 hover:text-white focus:bg-yellow-700 focus:text-white active:bg-yellow-600" > {date.label}
                                        </option>
                                        ))}
                                    </select>
                                </div>

                                <input type="email" name="email" placeholder="Valid Email Address" value={form.email} onChange={handleChange} required className={styles.inputField} />

                                <input type="text" inputMode="numeric" pattern="[0-9]*" name="mlbbId" placeholder="MLBB ID (ie. 9923103)" 
                                value={form.mlbbId} onChange={(e) => handleNumericChange(e, 'mlbbId')} required 
                                className={styles.inputField} />

                                <input type="text" inputMode="numeric" pattern="[0-9]*" name="mlbbServer" placeholder="MLBB Server (ie. 5932)" value={form.mlbbServer} 
                                onChange={(e) => handleNumericChange(e, 'mlbbServer')} required 
                                className={styles.inputField} />

                                <button type="submit" class="w-3/5 mx-auto mt-4 py-3 rounded-lg bg-black bg-opacity-30 text-white font-bold border border-white text-sm md:text-base cursor-pointer transition-all duration-200 hover:bg-white hover:bg-opacity-10 hover:text-yellow-300">
                                    Submit Registration
                                </button>
                            </form>
                        </div>
                    </div>

                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-black text-white p-8 rounded-2xl shadow-xl text-center min-w-64 border border-white">
                                <h2 className="text-xl font-semibold mb-4">Registration Submitted Successfully!</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="mt-4 px-6 py-2 rounded-lg border-none bg-yellow-300 text-gray-800 font-bold cursor-pointer text-base"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </AuthenticatedLayout>
        </>
    );
};

export default MCCWatchFestReg;