import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";
import { User, Mail, MapPin, Calendar, Globe, Hash, ChevronDown } from "lucide-react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { Check, ChevronsUpDown } from "lucide-react";

const regionsDataDefault = {
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

const eventDatesDefault = [
  { value: "2026-01-23", label: "January 23, 2026", disabled: true },
  { value: "2026-01-24", label: "January 24, 2026", disabled: true },
  { value: "2026-01-25", label: "January 25, 2026", disabled: false },
];

const LOGO_SRC = "/images/All Star/logo-%E4%B8%BB%E9%A2%98%E8%89%B2.png";
const PRIMARY = "#0D9488";
const SECONDARY_LIGHT = "#CCFBF1";

const Tooltip = ({ text }) => (
  <div className="relative group ml-auto">
    <span className="text-cyan-200 cursor-pointer font-bold text-sm">?</span>
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white text-black text-xs px-3 py-2 rounded-lg border shadow-lg w-56 z-50"
      style={{ borderColor: PRIMARY }}
    >
      {text}
    </div>
  </div>
);

const fieldWrapClass =
  "relative bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 border";
const fieldIconClass = "w-5 h-5 shrink-0 text-cyan-100";
const fieldChevronClass = "text-cyan-100";
const fieldInputClass =
  "bg-transparent w-full outline-none text-white placeholder:text-white/60";

export default function AS26WPRegistration({ regionsData: regionsDataProp, eventDates: eventDatesProp }) {
  const regionsData = regionsDataProp || regionsDataDefault;
  const eventDatesData = eventDatesProp || eventDatesDefault;
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

    const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/13IJf4quFa2cItIJbYAA4FA79ARL7N3iOzTBpWdRhUng/formResponse";

    const formBody = new FormData();
    formBody.append("entry.94934484", form.fullName.trim());
    formBody.append("entry.109216951", form.region);
    formBody.append("entry.968488150", form.venue.trim());
    formBody.append("entry.1190514999", form.attendanceMode);
    formBody.append("entry.683873208", form.eventDate);
    formBody.append("entry.915902139", form.email.trim());
    formBody.append("entry.244636744", form.mlbbId.trim());
    formBody.append("entry.373582216", form.mlbbServer.trim());
    formBody.append("entry.152146406", agreed ? "I agree to the Terms and Conditions" : "No");

    try {
      setSubmitting(true);

      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        body: formBody,
        mode: "no-cors",
      });

      setShowModal(true);
      setForm({
        fullName: "",
        region: "",
        venue: "",
        eventDate: "",
        email: "",
        mlbbId: "",
        mlbbServer: "",
        attendanceMode: "",
      });
      setAgreed(false);
    } catch (error) {
      console.error("Error submitting to Google Form:", error);
      setSubmissionMessage("Submission failed. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Head title="All-Star 2026 Registration" />

      <div className="w-full min-h-screen text-white bg-gradient-to-b from-[#040B16] via-[#0A2635] to-[#0D6266] font-sans pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute top-[15%] -right-28 w-[560px] h-[560px] rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute bottom-[-160px] left-[20%] w-[640px] h-[640px] rounded-full bg-cyan-300/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-8 sm:pt-16">
          <img
            src={LOGO_SRC}
            alt="All Star Logo"
            className="w-[80%] sm:w-full max-w-xs sm:max-w-md mx-auto drop-shadow-[0_0_30px_rgba(13,148,136,0.5)] mb-4 sm:mb-8"
          />
        </div>

        <div className="relative z-10 px-4">
          <div
            className="w-[95%] sm:w-full max-w-3xl mx-auto bg-[#0D9488]/40 backdrop-blur-xl border border-[#0D9488] rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl"
          >
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wide">
                All-Star 2026 Registration
              </h2>
            </div>

            {/** FULL NAME **/}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-white">
                Full Name
              </label>
              <div className={fieldWrapClass} style={{ borderColor: SECONDARY_LIGHT }}>
                <User className={fieldIconClass} />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={fieldInputClass}
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* REGION */}
            <div>
              <label className="block font-medium mb-1 text-sm text-white">Region</label>
              <div className={fieldWrapClass} style={{ borderColor: SECONDARY_LIGHT }}>
                <MapPin className={fieldIconClass} />
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
                <ChevronDown className={`absolute right-5 pointer-events-none ${fieldChevronClass}`} />
              </div>
            </div>

            {/* VENUE */}
            <div>
              <label className="block font-medium mb-1 text-sm text-white">Venue / School</label>
              <div className="relative">
                <Combobox
                  value={form.venue}
                  onChange={handleVenueChange}
                  disabled={!form.region}
                  onClose={() => setVenueQuery("")}
                >
                  <div className={fieldWrapClass} style={{ borderColor: SECONDARY_LIGHT }}>
                    <MapPin className={`${fieldIconClass} z-10`} />
                    <ComboboxInput
                      className={`${fieldInputClass} pr-10`}
                      placeholder={form.region ? "Search your venue" : "Please select a region first"}
                      displayValue={(val) => val}
                      onChange={(event) => setVenueQuery(event.target.value)}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className={`w-5 h-5 ${fieldChevronClass}`} aria-hidden="true" />
                    </ComboboxButton>
                  </div>
                  <ComboboxOptions anchor="bottom" className="w-[var(--input-width)] bg-[#0A2635] border rounded-xl mt-1 max-h-60 overflow-auto z-[100] shadow-xl empty:invisible" style={{ borderColor: PRIMARY }}>
                    {getVenuesForRegion(form.region).filter(v => v.toLowerCase().includes(venueQuery.toLowerCase())).length === 0 && venueQuery !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-white/60">
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
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${focus ? 'bg-teal-400 text-black' : 'text-white'}`
                            }
                          >
                            {({ selected, focus }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {v}
                                </span>
                                {selected ? (
                                  <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${focus ? 'text-black' : 'text-teal-300'}`}>
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
              <label className="block font-medium mb-1 text-sm sm:text-base text-white">
                Attendance Mode
              </label>
              <div className="relative bg-white/5 rounded-xl p-3 flex items-center gap-3 border opacity-80" style={{ borderColor: `${SECONDARY_LIGHT}80` }}>
                <Globe className={fieldIconClass} />
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
              <p className="text-[10px] mt-1 opacity-60 italic" style={{ color: SECONDARY_LIGHT }}>
                *This field is automatically determined by your chosen venue.
              </p>
            </div>

            {/* EVENT DATE */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-white">
                Event Date
              </label>

              <div className={fieldWrapClass} style={{ borderColor: SECONDARY_LIGHT }}>
                <Calendar className={fieldIconClass} />

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
                      {date.label}{date.disabled ? " (Registration Closed)" : ""}
                    </option>
                  ))}
                </select>

                <ChevronDown className={`absolute right-5 pointer-events-none ${fieldChevronClass}`} />
              </div>

              {errors.eventDate && (
                <p className="text-red-400 text-sm mt-1">{errors.eventDate}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base text-white">
                Email Address
              </label>
              <div className={fieldWrapClass} style={{ borderColor: SECONDARY_LIGHT }}>
                <Mail className={fieldIconClass} />
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
              <label className="block font-medium mb-1 text-sm sm:text-base text-white">
                MLBB User ID
              </label>
              <div className={fieldWrapClass} style={{ borderColor: SECONDARY_LIGHT }}>
                <Hash className={fieldIconClass} />
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
              <label className="block font-medium mb-1 text-sm sm:text-base text-white">
                MLBB Server (Zone) ID
              </label>
              <div className={fieldWrapClass} style={{ borderColor: SECONDARY_LIGHT }}>
                <Globe className={fieldIconClass} />
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
            <div className="flex items-start gap-3 mt-4 text-sm text-white">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 cursor-pointer"
                style={{ accentColor: PRIMARY }}
              />

              <p className="leading-snug">
                I accept and agree with the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="underline hover:text-cyan-200 transition"
                  style={{ color: SECONDARY_LIGHT }}
                >
                  Terms and Conditions
                </button>.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !agreed}
              className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                submitting || !agreed
                  ? "bg-white/20 text-white/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:scale-[0.98]"
              }`}
            >
              {submitting ? "Submitting..." : "REGISTER"}
            </button>

            {showModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-4">
                <div className="bg-[#151515] text-white p-8 rounded-2xl shadow-xl text-center min-w-64 border-2 max-w-md" style={{ borderColor: PRIMARY }}>
                  <h2 className="text-xl font-semibold mb-4">
                    Registration Submitted Successfully!
                  </h2>

                  <p className="text-sm opacity-80">
                    Your registration has been recorded. Please check your email for confirmation.
                  </p>

                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-6 px-6 py-2 rounded-lg text-black font-bold cursor-pointer text-base hover:brightness-110 transition"
                    style={{ backgroundColor: SECONDARY_LIGHT }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {showTermsModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-4">
                <div className="bg-[#151515] text-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-lg w-full border-2" style={{ borderColor: PRIMARY }}>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: SECONDARY_LIGHT }}>
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
                    className="mt-6 px-6 py-2 rounded-lg text-black font-bold hover:brightness-110 transition"
                    style={{ backgroundColor: SECONDARY_LIGHT }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}