import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";
import BG from "./M7BG.png";
import M7WFlogo from "./M7WFlogo.png";
import { User, Mail, MapPin, Calendar, Globe, Hash, ChevronDown } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Info } from "lucide-react";
import axios from "axios";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { Check, ChevronsUpDown } from "lucide-react";

const regionsData = {
  Luzon: {
    Online: [
      "Philippine Normal University Manila",
      "Urdaneta City University",
    ],
    Onsite: [
      "Colegio de Muntinlupa",
      "PHINMA Saint Jude College - Manila",
      "Lyceum of Subic Bay",
      "Laguna State Polytechnic University - Los Baños Campus",
    ],
  },

  Visayas: {
    Online: [
      "Northwest Samar State University",
      "Eastern Visayas State University - Ormoc City Campus",
      "University of Cebu - Banilad"
    ],
    Onsite: [
      "Visayas State University Main",
      "University of Saint La Salle",
      "University of San Carlos",
      "Southwestern University PHINMA",
      "Cebu Institute of Technology - University",
      "Iloilo Science and Technology University - La Paz Campus",
      "West Visayas State University - Main Campus",
    ],
  },

  Mindanao: {
    Online: [
      "PHINMA Cagayan de Oro College",
      "University of Southern Mindanao Kabacan Main Campus",
      "ACLC College of Bukidnon",
      "Surigao Del Norte State University ",
      "Josefina Herrera Cerilles State College",
    ],
    Onsite: [
      "Mindanao State University - Iligan Institute of Technology",
      "Davao Del Norte State College",
      "Father Saturnino Urios University",
      "Caraga State University - Main Campus",
      "Ateneo De Davao University",
      "Holy Cross Davao College",
      "University of Immaculate Conception",
    ],
  },
};

const eventDatesData = [
  { value: "2026-01-23", label: "January 23, 2026 (Registration Closed)", disabled: true },
  { value: "2026-01-24", label: "January 24, 2026 (Registration Closed)", disabled: true },
  { value: "2026-01-25", label: "January 25, 2026" },
];

const attendanceModes = ["Online", "Onsite"];

const Tooltip = ({ text }) => (
  <div className="relative group ml-auto">
    <span className="text-[#fff4d0] cursor-pointer font-bold text-sm">
      ?
    </span>

    <div className="
      absolute right-0 top-1/2 -translate-y-1/2
      hidden group-hover:block
      bg-black text-[#FFF4D0]
      text-xs px-3 py-2 rounded-lg
      border border-[#FFF4D0]
      shadow-lg w-56 z-50
    ">
      {text}
    </div>
  </div>
);


export default function M7WFRegistration() {
  const [form, setForm] = useState({
    fullName: "",
    region: "",
    attendanceMode: "", // Will be auto-filled
    venue: "",
    eventDate: "",
    email: "",
    mlbbId: "",
    mlbbServer: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [venueQuery, setVenueQuery] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Update handleChange to reset venue when region changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // MLBB USER ID → numbers only, max 12 digits
    if (name === "mlbbId") {
      newValue = value.replace(/\D/g, "").slice(0, 12);
    }

    // MLBB SERVER → numbers only, max 6 digits
    if (name === "mlbbServer") {
      newValue = value.replace(/\D/g, "").slice(0, 6);
    }

    if (name === "region") {
      setForm((prev) => ({
        ...prev,
        region: value,
        venue: "",
        attendanceMode: ""
      }));
      return;
    }

    if (name === "venue") {
      // Find if the venue is Online or Onsite
      const isOnline = regionsData[form.region].Online.includes(value);
      const detectedMode = isOnline ? "Online" : "Onsite";

      setForm((prev) => ({
        ...prev,
        venue: value,
        attendanceMode: detectedMode
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVenueChange = (value) => {
    // Find if the venue is Online or Onsite
    const isOnline = regionsData[form.region]?.Online.includes(value);
    const detectedMode = isOnline ? "Online" : "Onsite";

    setForm((prev) => ({
      ...prev,
      venue: value,
      attendanceMode: detectedMode
    }));
    setErrors((prev) => ({ ...prev, venue: "" }));
  };

  // Helper to get alphabetical list of all venues for the selected region
  const getVenuesForRegion = (region) => {
    if (!region) return [];
    const online = regionsData[region].Online || [];
    const onsite = regionsData[region].Onsite || [];
    return [...online, ...onsite].sort((a, b) => a.localeCompare(b));
  };

  // Validation helpers
  const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const isValidMlbbId = (id) => {
    return /^\d{7,12}$/.test(id); // 7 to 12 digits
  };

  const isValidMlbbServer = (s) => {
    return /^\d{4,6}$/.test(s); // 4 to 6 digits
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.region) newErrors.region = "Region is required.";
    if (!form.venue.trim()) newErrors.venue = "Venue is required.";
    if (!form.eventDate) newErrors.eventDate = "Event date is required.";

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!isValidEmail(form.email.trim())) {
      newErrors.email = "Please input a valid email address.";
    }

    if (!form.mlbbId.trim()) newErrors.mlbbId = "MLBB User ID is required.";
    else if (!isValidMlbbId(form.mlbbId.trim())) newErrors.mlbbId = "MLBB User ID must be 7 to 12 digits.";

    if (!form.mlbbServer.trim()) newErrors.mlbbServer = "MLBB Server ID is required.";
    else if (!isValidMlbbServer(form.mlbbServer.trim())) newErrors.mlbbServer = "MLBB Server ID must be 4 to 6 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage("");
    if (!validate()) {
      return;
    }

    const payload = {
      event_name: "M7 WP", // Hardcoded lang muna
      fullName: form.fullName.trim(),
      region: form.region,
      venue: form.venue.trim(),
      eventDate: form.eventDate,
      email: form.email.trim(),
      mlbbId: form.mlbbId.trim(),
      mlbbServer: form.mlbbServer.trim(),
      attendanceMode: form.attendanceMode,
      consent: agreed,
    };

    try {
      setSubmitting(true);

      const response = await axios.post(route('event.registration.store'), payload);

      if (response.data.success) {
        setShowModal(true);
        setForm({
          fullName: "",
          region: "",
          venue: "",
          eventDate: "",
          email: "",
          mlbbId: "",
          mlbbServer: "",
        });
        setAgreed(false);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 422) {
        setSubmissionMessage(err.response.data.message || "You have already registered for this event on this date.");
      } else {
        setSubmissionMessage("Submission failed. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="M7WF Registration" />
      <Helmet>
        <title>M7WF Registration</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div
        className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 sm:pt-5 font-['Montserrat'] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}
      >
        <Link href="#">
          <img
            src={M7WFlogo}
            alt="M7WF Logo"
            className="w-64 sm:w-80 drop-shadow-lg mb-6 cursor-pointer"
          />
        </Link>

        <div
          className="p-5 sm:p-8 w-full max-w-sm sm:max-w-3xl shadow-lg mx-auto border-2 backdrop-blur-md bg-black/75"
          style={{
            borderColor: "#fff4d0",
            borderWidth: "2px",
          }}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="text-center">
              <h2 className="font-bold mb-1 text-[20px] sm:text-[26px] lg:text-[32px] text-[#fff4d0]">
                M7 Watch Party Registration
              </h2>
            </div>

            {/** FULL NAME **/}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-[#fff4d0]">
                Full Name
              </label>
              <div className="relative bg-black/75 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]">
                <User className="text-[#fff4d0] w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/60"
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* REGION */}
            <div>
              <label className="block font-medium mb-1 text-sm text-[#fff4d0]">Region</label>
              <div className="relative bg-black/75 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]">
                <MapPin className="text-[#fff4d0] w-5 h-5" />
                <select
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none text-white appearance-none"
                >
                  <option value="" disabled className="text-black">Select region</option>
                  {Object.keys(regionsData).map((r) => (
                    <option key={r} value={r} className="text-black">{r}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 text-[#fff4d0] pointer-events-none" />
              </div>
            </div>

            {/* VENUE */}
            <div>
              <label className="block font-medium mb-1 text-sm text-[#fff4d0]">Venue / School</label>
              <div className="relative">
                <Combobox
                  value={form.venue}
                  onChange={handleVenueChange}
                  disabled={!form.region}
                  onClose={() => setVenueQuery("")}
                >
                  <div className="relative bg-black/75 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]">
                    <MapPin className="text-[#fff4d0] w-5 h-5 z-10" />
                    <ComboboxInput
                      className="bg-transparent w-full outline-none text-white placeholder:text-white/60 pr-10"
                      placeholder={form.region ? "Search your venue" : "Please select a region first"}
                      displayValue={(val) => val}
                      onChange={(event) => setVenueQuery(event.target.value)}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className="w-5 h-5 text-[#fff4d0]" aria-hidden="true" />
                    </ComboboxButton>
                  </div>
                  <ComboboxOptions anchor="bottom" className="w-[var(--input-width)] bg-black border border-[#fff4d0] rounded-xl mt-1 max-h-60 overflow-auto z-[100] shadow-xl empty:invisible">
                    {getVenuesForRegion(form.region).filter(v => v.toLowerCase().includes(venueQuery.toLowerCase())).length === 0 && venueQuery !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-[#fff4d0]/60">
                        Nothing found.
                      </div>
                    ) : (
                      getVenuesForRegion(form.region)
                        .filter(v => v.toLowerCase().includes(venueQuery.toLowerCase()))
                        .slice(0, 15)
                        .map((v) => (
                          <ComboboxOption
                            key={v}
                            value={v}
                            className={({ focus }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${focus ? 'bg-[#fff4d0] text-black' : 'text-[#fff4d0]'}`
                            }
                          >
                            {({ selected, focus }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {v}
                                </span>
                                {selected ? (
                                  <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? 'text-black' : 'text-[#fff4d0]'}`}>
                                    <Check className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </ComboboxOption>
                        ))
                    )}
                  </ComboboxOptions>
                </Combobox>
              </div>
              {errors.venue && <p className="text-red-400 text-sm mt-1">{errors.venue}</p>}
            </div>

            {/* ATTENDANCE MODE (Display Only) */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-[#fff4d0]">
                Attendance Mode
              </label>
              <div className="relative bg-black/40 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]/50 opacity-80">
                <Globe className="text-[#fff4d0] w-5 h-5" />
                <input
                  type="text"
                  name="attendanceMode"
                  value={form.attendanceMode}
                  placeholder="Auto-selected based on venue"
                  readOnly // Prevents typing
                  disabled // Grays it out slightly for UX
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/40 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-[#fff4d0] mt-1 opacity-60 italic">
                *This field is automatically determined by your chosen venue.
              </p>
            </div>

            {/* EVENT DATE */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-[#fff4d0]">
                Event Date
              </label>

              <div className="relative bg-black/75 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]">
                <Calendar className="text-[#fff4d0] w-5 h-5" />

                <select
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none text-white appearance-none"
                >
                  <option value="" disabled className="text-black">
                    Select event date
                  </option>

                  {eventDatesData.map((date) => (
                    <option key={date.value} value={date.value} className="text-black" disabled={date.disabled}>
                      {date.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="absolute right-5 text-[#fff4d0] pointer-events-none" />
              </div>

              {errors.eventDate && (
                <p className="text-red-400 text-sm mt-1">{errors.eventDate}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-[#fff4d0]">
                Email Address
              </label>
              <div className="relative bg-black/75 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]">
                <Mail className="text-[#fff4d0] w-5 h-5" />
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/60"
                />
                <Tooltip text="Use an active email address where we can contact you." />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* MLBB ID */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-[#fff4d0]">
                MLBB User ID
              </label>
              <div className="relative bg-black/75 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]">
                <Hash className="text-[#fff4d0] w-5 h-5" />
                <input
                  type="text"
                  inputMode="numeric"
                  name="mlbbId"
                  value={form.mlbbId}
                  onChange={handleChange}
                  placeholder="7–12 digits"
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/60"
                />
                <Tooltip text="Found in your MLBB profile. Example: 123456789" />
              </div>
              {errors.mlbbId && <p className="text-red-400 text-sm mt-1">{errors.mlbbId}</p>}
            </div>

            {/* MLBB SERVER */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-[#fff4d0]">
                MLBB Server (Zone) ID
              </label>
              <div className="relative bg-black/75 rounded-xl p-3 flex items-center gap-3 border border-[#fff4d0]">
                <Globe className="text-[#fff4d0] w-5 h-5" />
                <input
                  type="text"
                  inputMode="numeric"
                  name="mlbbServer"
                  value={form.mlbbServer}
                  onChange={handleChange}
                  placeholder="4–6 digits"
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/60"
                />
                <Tooltip text="The number in parentheses next to your UID. Example: (3024)" />
              </div>
              {errors.mlbbServer && <p className="text-red-400 text-sm mt-1">{errors.mlbbServer}</p>}
            </div>

            {submissionMessage && (
              <p className="text-red-400 text-center text-sm font-medium animate-pulse">
                {submissionMessage}
              </p>
            )}

            {/* TERMS & CONDITIONS */}
            <div className="flex items-start gap-3 mt-4 text-sm text-[#fff4d0]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="
                  mt-1 w-4 h-4
                  accent-[#fff4d0]
                  cursor-pointer
                "
              />

              <p className="leading-snug">
                I accept and agree with the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="underline hover:text-yellow-300 transition"
                >
                  Terms and Conditions
                </button>.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !agreed}
              className="
                w-full mt-6 py-3 rounded-xl
                font-bold text-[#FFF4D0] text-base sm:text-lg
                bg-black/80
                border-2 border-[#FFF4D0]
                hover:bg-[#FFF4D0]
                hover:text-black
                shadow-lg shadow-black/40
                transition-all duration-200
                active:scale-[0.97]
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {submitting ? "Submitting..." : "REGISTER"}
            </button>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-black text-white p-8 rounded-2xl shadow-xl text-center min-w-64 border border-white">
                  <h2 className="text-xl font-semibold mb-4">
                    Registration Submitted Successfully!
                  </h2>

                  <p className="text-sm opacity-80">
                    Your registration has been recorded. Please check your email for confirmation.
                  </p>

                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-6 px-6 py-2 rounded-lg bg-yellow-300 text-gray-800 font-bold cursor-pointer text-base hover:bg-yellow-400 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {showTermsModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-black text-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-lg w-full border border-[#fff4d0]">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#fff4d0]">
                    Data Privacy Consent
                  </h2>

                  <p className="text-sm leading-relaxed opacity-90">
                    By checking this box, I authorize Moonton Student Leaders (MSL) Philippines to collect
                    and process the personal details provided above, specifically my identity, contact information,
                    and MLBB game credentials, solely for the purposes of verifying my registration, managing
                    event logistics, and distributing in-game rewards for the M7 Watch Party.
                    <br /><br />
                    I acknowledge that my data will be protected in accordance with the Data Privacy Act of 2012,
                    will not be shared with unauthorized third parties, and that I retain the right to access, correct,
                    or request the deletion of my information at any time.
                  </p>

                  <button
                    onClick={() => setShowTermsModal(false)}
                    className="
                      mt-6 px-6 py-2 rounded-lg
                      bg-[#FFF4D0] text-black font-bold
                      hover:bg-yellow-300 transition
                    "
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
/*FrontEnd by PD Dev - Jaijai*/