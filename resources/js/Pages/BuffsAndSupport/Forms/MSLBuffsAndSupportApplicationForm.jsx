import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Helmet } from "react-helmet";
import { Mail, User, Facebook, Phone, School, MapPin, Building2, FileText, GraduationCap, Globe, Calendar, CheckCircle, LinkIcon } from "lucide-react";


export default function MSLBuffsAndSupportApplicationForm({ auth }) {
    const [step, setStep] = useState(1);

    const initialFormState = {
        email: "",
        applicantName: "",
        fbProfile: "",
        contactNumber: "",
        crossCampus: "",
        partneredSchoolFullName: "",
        partneredSchoolEsportsName: "",
        partneredSchoolPointPerson: "",
        fullSchoolName: "",
        schoolAddress: "",
        organizationName: "",
        eventDetails: "",
        schoolMSLCategory: "",
        eventScope: "",
        eventScopeOther: "",
        mslHandler: "",
        eventDate: "",
        eventApproved: "",
        universityApproval: "",
        eventProposal: "",
        pitchDeck: "",
        agreeTerms: "",
    };

    const [form, setForm] = useState(initialFormState);

  const [errorMsg, setErrorMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
    const [showDebug, setShowDebug] = useState(false);


  const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle radio/checkbox if needed in future
        const newValue = type === "checkbox" ? checked : value;

        // If eventScope changed and it's not 'Other', clear eventScopeOther to avoid stale values
        if (name === "eventScope") {
            if (value !== "Other") {
                setForm((prev) => ({ ...prev, eventScope: value, eventScopeOther: "" }));
                return;
            }
        }

        setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 7) setStep(step + 1);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        // Only allow submission from step 7
        if (step !== 7) {
            setErrorMsg("You can only submit the form on the final step.");
            return;
        }

        // Basic validation: ensure required fields are filled
        const requiredFields = [
            "email",
            "applicantName",
            "fbProfile",
            "contactNumber",
            "crossCampus",
            "fullSchoolName",
            "schoolAddress",
            "organizationName",
            "eventDetails",
            "schoolMSLCategory",
            "eventScope",
            "eventDate",
            "eventApproved",
            "universityApproval",
            "eventProposal",
            "pitchDeck",
            "agreeTerms",
        ];

        for (const key of requiredFields) {
            // eventScopeOther is handled below
            if (!form[key] || (typeof form[key] === "string" && form[key].trim() === "")) {
                setErrorMsg("Please complete all required fields before submitting.");
                return;
            }
        }

        if (form.eventScope === "Other" && (!form.eventScopeOther || form.eventScopeOther.trim() === "")) {
            setErrorMsg("Please specify the event scope when 'Other' is selected.");
            return;
        }

    // clear previous error
    setErrorMsg("");

    // Debug: log form state so we can verify data collected across steps
    console.log("Submitting form to Google Forms with data:", form);

        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScleiERJDia0eb3hhfkYQZMnE_UU83_L2OpGpixoOOgqgKvmg/formResponse";
    const formData = new FormData();
    
    formData.append("entry.889050311", form.email);
    formData.append("entry.1986261297", form.applicantName);
    formData.append("entry.480597956", form.fbProfile);
    formData.append("entry.476135696", form.contactNumber);
    formData.append("entry.677148438", form.crossCampus);
    formData.append("entry.1143371973", form.partneredSchoolFullName);
    formData.append("entry.1268100293", form.partneredSchoolEsportsName);
    formData.append("entry.1206672456", form.partneredSchoolPointPerson);
    formData.append("entry.1676720440", form.eventDetails);
    formData.append("entry.1841216287", form.fullSchoolName);
    formData.append("entry.2098316463", form.schoolAddress);
    formData.append("entry.612283718", form.organizationName);
    formData.append("entry.873514728", form.schoolMSLCategory);
    formData.append("entry.1393395565", form.eventScope === "Other" ? form.eventScopeOther : form.eventScope);
    formData.append("entry.1428099277", form.mslHandler);
    formData.append("entry.1989544072", form.eventDate);
    formData.append("entry.555179969", form.eventApproved);
    formData.append("entry.441650271", form.universityApproval);
    formData.append("entry.1901063154", form.eventProposal);
    formData.append("entry.1996892998", form.pitchDeck);
    formData.append("entry.845878467", form.agreeTerms);   

  try {
    await fetch(formURL, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    });
    setShowModal(true); // ✅ show confirmation modal

    // ✅ Reset form and return to step 1
    setForm(initialFormState);
    setStep(1);

    } catch (error) {
        console.error("Submission failed:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="MSL Buffs and Support Application Form" />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4">
        <div className="bg-black/80 text-white rounded-2xl p-4 sm:p-8 w-full max-w-md sm:max-w-3xl shadow-lg mx-auto">
          <h2 className="font-bold mb-2 text-[20px] sm:text-[24px] lg:text-[30px] text-center">
            MSL Buffs and Support Application
          </h2>

          <div className="text-center mb-2">
            {/* Always visible description */}
            <h3 className="text-gray-300 text-sm sm:text-base mb-3 leading-relaxed">
                The MSL Buffs and Support program is an initiative that allows
                MSL Philippines to sponsor the events of partner organizations
                exclusive in the MSL Network. This program ensures to give a
                competitive edge for our partners by giving them opportunities
                to hold big and generous events.
            </h3>

            <h3 className="text-yellow-400 text-xs sm:text-sm mb-4">
                Note: This program is open only to active and signed Esports
                organizations in the MSL Network.
            </h3>

            {/* Step indicator */}
            {step === 1 && (
                <h3 className="text-gray-400 text-sm sm:text-base">
                Step 1 of 7 — Personal Information
                </h3>
            )}
            {step === 2 && (
                <h3 className="text-gray-400 text-sm sm:text-base">
                Step 2 of 7 — Cross-Campus Sponsorship
                </h3>
            )}

            {step === 3 && (
                <h3 className="text-gray-400 text-sm sm:text-base">
                Step 3 of 7 — School Details
                </h3>
            )}

            {step === 4 && (
                <h3 className="text-gray-400 text-sm sm:text-base">
                Step 4 of 7 — Event Details
                </h3>
            )}

            {step === 5 && (
                <h3 className="text-gray-400 text-sm sm:text-base">
                Step 5 of 7 — Event Details Verification
                </h3>
            )}

            {step === 6 && (
                <h3 className="text-gray-400 text-sm sm:text-base">
                Step 6 of 7 — Event Proposal Template
                </h3>
            )}

            {step === 7 && (
                <h3 className="text-gray-400 text-sm sm:text-base">
                Step 7 of 7 — Releasing Funds
                </h3>
            )}

            </div>
      
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-2 rounded-full mb-6">
            <div
              className="bg-[#F2C21A] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            ></div>
          </div>

            {/*Step 1 Form */}
            {step === 1 && (
                <form onSubmit={handleNext} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block font-medium mb-1">Email Address</label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <Mail className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                {/* Applicant's Name */}
                <div>
                    <label className="block font-medium mb-1">
                    Applicant's Name
                    </label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <User className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="text"
                        name="applicantName"
                        value={form.applicantName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                {/* Facebook Profile */}
                <div>
                    <label className="block font-medium mb-1">
                    Facebook Profile Link
                    </label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <Facebook className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="url"
                        name="fbProfile"
                        value={form.fbProfile}
                        onChange={handleChange}
                        required
                        placeholder="https://facebook.com/yourprofile"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                {/* Contact Number */}
                <div>
                    <label className="block font-medium mb-1">
                    Contact Number
                    </label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <Phone className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="text"
                        name="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        required
                        placeholder="09XXXXXXXXX"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                {/* Cross-Campus Sponsorship */}
                <div>
                    <label className="block font-medium mb-1">
                    Are you applying for a Cross-Campus Sponsorship?
                    </label>
                    <select
                    name="crossCampus"
                    value={form.crossCampus}
                    onChange={handleChange}
                    required
                    className="bg-white/5 rounded-xl p-3 w-full outline-none text-white appearance-none"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        color: "white",
                    }}
                    >
                    <option
                        value=""
                        disabled
                        style={{ color: "#9ca3af", backgroundColor: "white" }}
                    >
                        Select an option
                    </option>
                    <option
                        value="Yes"
                        style={{ color: "black", backgroundColor: "white" }}
                    >
                        Yes
                    </option>
                    <option
                        value="No"
                        style={{ color: "black", backgroundColor: "white" }}
                    >
                        No
                    </option>
                    </select>
                </div>

                {/* Next */}
                <button
                    type="submit"
                    className="w-full mt-4 bg-[#F2C21A] hover:bg-[#ddb518] text-black font-bold py-3 rounded-xl transition-colors"
                >
                    Next
                </button>
                </form>
            )}

            {/* Step 2 Form */}
            {step === 2 && (
                <form onSubmit={handleNext} className="space-y-4">
                {/* Full School Name of Partnered School */}
                <div>
                    <label className="block font-medium mb-1">
                    Full School Name of your Partnered School
                    </label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <School className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="text"
                        name="partneredSchoolFullName"
                        value={form.partneredSchoolFullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter full school name"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                {/* Esports Name */}
                <div>
                    <label className="block font-medium mb-1">
                    Esports Name of your Partnered School
                    </label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <School className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="text"
                        name="partneredSchoolEsportsName"
                        value={form.partneredSchoolEsportsName}
                        onChange={handleChange}
                        required
                        placeholder="Enter esports name"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                {/* Point Person */}
                <div>
                    <label className="block font-medium mb-1">
                    Point Person from your Partnered School
                    </label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <User className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="text"
                        name="partneredSchoolPointPerson"
                        value={form.partneredSchoolPointPerson}
                        onChange={handleChange}
                        required
                        placeholder="Enter point person name"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                            onClick={handlePrev}
                            className="w-full sm:w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Prev
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-1/2 bg-[#F2C21A] hover:bg-[#ddb518] text-black font-bold py-3 rounded-xl transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </form>
            )}

            {/* STEP 3 Form */}
            {step === 3 && (
                <form onSubmit={handleNext} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Full School Name</label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <School className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="text"
                        name="fullSchoolName"
                        value={form.fullSchoolName}
                        onChange={handleChange}
                        required
                        placeholder="Enter full school name"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">
                    Complete Address of School
                    </label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <MapPin className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="text"
                        name="schoolAddress"
                        value={form.schoolAddress}
                        onChange={handleChange}
                        required
                        placeholder="Enter school address"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">Name of Organization</label>
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <Building2 className="text-[#F2C21A] w-5 h-5" />
                    <input
                        type="text"
                        name="organizationName"
                        value={form.organizationName}
                        onChange={handleChange}
                        required
                        placeholder="Enter organization name"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                    onClick={handlePrev}
                    className="w-full sm:w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                    Prev
                    </button>
                    <button
                    type="submit"
                    className="w-full sm:w-1/2 bg-[#F2C21A] hover:bg-[#ddb518] text-black font-bold py-3 rounded-xl transition-colors"
                    >
                    Next
                    </button>
                </div>
                </form>
            )}

            {/* STEP 4 Form */}
            {step === 4 && (
            <form onSubmit={handleNext} className="space-y-6">
                {/* Event Details */}
                <div>
                <label className="block font-medium mb-1">Event Details</label>
                <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <FileText className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <select
                    name="eventDetails"
                    value={form.eventDetails}
                    onChange={handleChange}
                    required
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    >
                    <option style={{ color: "#9ca3af", backgroundColor: "white" }} disabled value="">
                        Select event type
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="MLBB Tournaments & Contests">
                        MLBB Tournaments & Contests
                    </option>
                    <option
                        style={{ color: "black", backgroundColor: "white" }}
                        value="Non-MLBB-related Contests & Events (Art Contests, TikTok Contests, Essay Contests, Pageants, etc.)"
                    >
                        Non-MLBB-related Contests & Events (Art Contests, TikTok Contests, Essay Contests, Pageants, etc.)
                    </option>
                    </select>
                </div>
                </div>

                {/* School MSL Category */}
                <div>
                <label className="block font-medium mb-1">School MSL Category of the Requestor</label>
                <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <GraduationCap className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <select
                    name="schoolMSLCategory"
                    value={form.schoolMSLCategory}
                    onChange={handleChange}
                    required
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    >
                    <option style={{ color: "#9ca3af", backgroundColor: "white" }} disabled value="">
                        Select category
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="Level 1 MSL School">
                        Level 1 MSL School
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="Level 2 MSL School">
                        Level 2 MSL School
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="Level 3 MSL School">
                        Level 3 MSL School
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="Super School">
                        Super School
                    </option>
                    </select>
                </div>
                </div>

                {/* Event Scope */}
                <div>
                <label className="block font-medium mb-1">Event Scope</label>
                <h3 className="text-gray-400 text-sm mb-2">
                    The budget allocation to be approved by the MSL team will be contingent on the scope of the proposed event.
                </h3>
                <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <Globe className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <select
                    name="eventScope"
                    value={form.eventScope}
                    onChange={handleChange}
                    required
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    >
                    <option style={{ color: "#9ca3af", backgroundColor: "white" }} disabled value="">
                        Select event scope
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="Department-wide (e.g., Department of Biology)">
                        Department-wide (e.g., Department of Biology)
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="College-wide (e.g., College of Arts and Sciences)">
                        College-wide (e.g., College of Arts and Sciences)
                    </option>
                    <option
                        style={{ color: "black", backgroundColor: "white" }}
                        value="University-wide (e.g., Laguna State Polytechnic University - Main Campus)"
                    >
                        University-wide (e.g., Laguna State Polytechnic University - Main Campus)
                    </option>
                    <option
                        style={{ color: "black", backgroundColor: "white" }}
                        value="System-wide (e.g., Laguna State Polytechnic University System)"
                    >
                        System-wide (e.g., Laguna State Polytechnic University System)
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="Region-wide (e.g., various universities in CALABARZON)">
                        Region-wide (e.g., various universities in CALABARZON)
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="Nationwide">
                        Nationwide
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="SHS-wide, Intra-strand (e.g., STEM Strand)">
                        SHS-wide, Intra-strand (e.g., STEM Strand)
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="SHS-wide, Inter-strand (e.g., STEM, ABM, HUMSS, TVL)">
                        SHS-wide, Inter-strand (e.g., STEM, ABM, HUMSS, TVL)
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="Other">
                        Other
                    </option>
                    </select>
                </div>

                {/* If Other is selected */}
                {form.eventScope === "Other" && (
                    <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3 mt-2">
                    <Globe className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <input
                        type="text"
                        name="eventScopeOther"
                        value={form.eventScopeOther || ""}
                        onChange={handleChange}
                        required
                        placeholder="Please specify"
                        className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    />
                    </div>
                )}
                </div>

                {/* MSL Handler */}
                <div>
                <label className="block font-medium mb-1">
                    If you are from a MSL School: who is your MSL Handler?
                </label>
                <label className="text-gray-400 text-sm mb-2 leading-relaxed">
                    If your school has more than 1 MSL, who did you coordinate with for this event? Type in their{" "}
                    <span className="font-semibold text-white">School Code</span> and{" "}
                    <span className="font-semibold text-white">MSL Nickname</span> (ask them directly for these information).<br /><br />
                    Type <span className="font-semibold text-white">N/A</span> if your school has no established MSL Community yet.
                </label>
                <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <User className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <input
                    type="text"
                    name="mslHandler"
                    value={form.mslHandler}
                    onChange={handleChange}
                    required
                    placeholder="Enter MSL handler’s name or N/A"
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    />
                </div>
                </div>

                {/* Event Date */}
                <div>
                <label className="block font-medium mb-1">Date of the Event</label>
                <h3 className="text-gray-400 text-sm mb-2">
                    Exact or tentative date of the event. State if the event will run for more than a day{" "}
                    <span className="font-semibold text-white">(e.g., September 7–8, 2024).</span>
                </h3>
                <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <Calendar className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <input
                    type="text"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={handleChange}
                    required
                    placeholder="Enter date or date range"
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    />
                </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                    onClick={handlePrev}
                    className="w-full sm:w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Prev
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-1/2 bg-[#F2C21A] hover:bg-[#ddb518] text-black font-bold py-3 rounded-xl transition-colors"
                >
                    Next
                </button>
                </div>
            </form>
            )}

            {/* STEP 5 Form */}
            {step === 5 && (
            <form onSubmit={handleNext} className="space-y-4">
                <div>
                <label className="block font-medium mb-1">
                    Is this event already approved by the school admin?
                </label>
                <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <CheckCircle className="text-[#F2C21A] w-5 h-5" />
                    <select
                    name="eventApproved"
                    value={form.eventApproved}
                    onChange={handleChange}
                    required
                    className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    >
                    <option style={{ color: "#9ca3af", backgroundColor: "white" }} value="" disabled className="text-black">
                        Select an option
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="Yes" className="text-black">
                        Yes
                    </option>
                    <option style={{ color: "black", backgroundColor: "white" }} value="No" className="text-black">
                        No
                    </option>
                    </select>
                </div>
                </div>

                <div>
                <label className="block font-medium mb-1">
                    Submit your signed event proposal (University Approval)
                </label>
                <label className="w-full text-gray-400 text-sm mb-5">
                    Kindly share your Google Drive link with either <span className="font-semibold text-white">view</span> or <span className="font-semibold text-white">edit</span> access so we can review your file without permission issues.
                </label>
                <div className="flex items-center bg-white/5 mt-2rounded-xl p-3 gap-3">
                    <LinkIcon className="text-[#F2C21A] w-5 h-5" />
                    <input
                    type="url"
                    name="universityApproval"
                    value={form.universityApproval}
                    onChange={handleChange}
                    required
                    placeholder="Paste your Google Drive link here"
                    className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                    onClick={handlePrev}
                    className="w-full sm:w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Prev
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-1/2 bg-[#F2C21A] hover:bg-[#ddb518] text-black font-bold py-3 rounded-xl transition-colors"
                >
                    Next
                </button>
                </div>
            </form>
            )}
        
            {/* STEP 6 Form */}
            {step === 6 && (
            <form onSubmit={handleNext} className="space-y-4">
                {/* Proposal Section */}
                <div>
                <label className="w-full text-gray-400 text-sm mb-2">
                    Prepare a proposal using the proposal template provided. The SL team will determine if the event is within the scope of the program and approve the amount of diamonds that will be given to the requesting organization. This process usually takes <span className="font-semibold text-white">7 to 10 days</span> upon submission of the Event Application Form.
                </label> 
                <br></br><br></br>
                <label className="block font-medium mb-1">
                    Create a proposal of the event in accordance with the format:{" "}
                    <a
                        href="https://docs.google.com/document/d/1Rzr9lndZZTzu2Qc1eF0CgydL-rsqe4K6/edit?usp=sharing&ouid=115676537150302996064&rtpof=true&sd=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F2C21A] underline hover:text-[#ddb518]"
                    >
                        View Template
                    </a>
                </label>
                <label className="w-full text-gray-400 text-sm mb-5">
                    Kindly share your Google Drive link with either <span className="font-semibold text-white">view</span> or <span className="font-semibold text-white">edit</span> access so we can review your file without permission issues.
                </label>
                <div className="flex items-center bg-white/5 mt-2 rounded-xl p-3 gap-3">
                    <LinkIcon className="text-[#F2C21A] w-5 h-5" />
                    <input
                    type="url"
                    name="eventProposal"
                    value={form.eventProposal}
                    onChange={handleChange}
                    required
                    placeholder="Paste your Google Drive link here"
                    className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                </div>
                </div>

                {/* Pitch Deck Section */}
                <div>
                <label className="block font-medium mb-1">
                    Create a pitch deck of the event in accordance with the format:{" "}
                    <a
                        href="https://www.canva.com/design/DAGc_vI3AbI/rCZUdGm0IqL1jSyIWWZNig/view?utm_content=DAGc_vI3AbI&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F2C21A] underline hover:text-[#ddb518]"
                    >
                        View Template
                    </a>
                </label>
                <label className="w-full text-gray-400 text-sm mb-5">
                    Kindly share your Google Drive link with either <span className="font-semibold text-white">view</span> or <span className="font-semibold text-white">edit</span> access so we can review your file without permission issues.
                </label>
                <div className="flex items-center bg-white/5 mt-2 rounded-xl p-3 gap-3">
                    <LinkIcon className="text-[#F2C21A] w-5 h-5" />
                    <input
                    type="url"
                    name="pitchDeck"
                    value={form.pitchDeck}
                    onChange={handleChange}
                    required
                    placeholder="Paste your Google Drive link here"
                    className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                    onClick={handlePrev}
                    className="w-full sm:w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Prev
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-1/2 bg-[#F2C21A] hover:bg-[#ddb518] text-black font-bold py-3 rounded-xl transition-colors"
                >
                    Next
                </button>
                </div>
            </form>
            )}

            {/* STEP 7 Form */}
            {step === 7 && (
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                <label className="text-gray-400 text-sm mb-3 leading-relaxed">
                    <span className="font-semibold text-white">For Diamond rewards</span> – will be released 3–4 weeks
                    after the submission of the winners' sheet and the requirements mentioned in the agreement form.
                    <br /><br />
                    <span className="font-semibold text-white">For Monetary Requests</span> – after the requests are made,
                    the requestor will wait for up to 10 days for our 3rd-party distributor to process the fund requests.
                </label>
                </div>

                <div>
                <label className="block font-medium mb-1">
                    I hereby accept the terms and conditions imposed on the MSL Philippines by the Diamonds and Monetary Funds.
                </label>
                <div className="flex items-center bg-white/5 mt-2 rounded-xl p-3 gap-3">
                    <input
                    type="radio"
                    id="agreeTerms"
                    name="agreeTerms"
                    value="I Agree"
                    checked={form.agreeTerms === "I Agree"}
                    onChange={handleChange}
                    required
                    className="w-5 h-5 accent-[#F2C21A] cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className="cursor-pointer text-white">
                    I Agree / Accept
                    </label>
                </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                    onClick={handlePrev}
                    type="button"
                    className="w-full sm:w-1/2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Prev
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-1/2 bg-[#F2C21A] hover:bg-[#ddb518] text-black font-bold py-3 rounded-xl transition-colors"
                >
                    Submit
                </button>
                </div>
            </form>
            )}

            {/* Confirmation Modal */}
            {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div
                className="bg-white text-gray-800 rounded-2xl p-6 text-center max-w-sm w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
                >
                <CheckCircle className="text-green-500 mx-auto mb-3" size={40} />
                <h2 className="text-lg font-semibold mb-2">
                    Application Submitted!
                </h2>
                <p className="text-sm mb-4">
                    Your MSL Buffs and Support Application has been successfully sent.
                </p>
                <button
                    onClick={() => {
                    setShowModal(false);
                    setStep(1); // ✅ return to first step after closing modal
                    }}
                    className="bg-[#F2C21A] hover:bg-[#ddb518] px-5 py-2 rounded-lg text-gray-900 font-semibold transition duration-200"
                >
                    Close
                </button>
                </div>
            </div>
            )}

        </div>
      </div>
    </AuthenticatedLayout>
  );
}
