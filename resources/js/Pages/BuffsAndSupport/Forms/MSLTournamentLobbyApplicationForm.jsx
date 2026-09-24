import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Helmet } from "react-helmet";
import {
  Mail,
  User,
  Facebook,
  Calendar,
  CheckCircle,
  FileText,
  LinkIcon,
  Building2,
  School,
  Gamepad2,
  IdCard,
} from "lucide-react";

export default function MSLTournamentLobbyApplicationForm({ auth }) {
  const [step, setStep] = useState(1);

  const initialFormState = {
    email: "",
    understoodSOP: "",
    applicantName: "",
    fbLink: "",
    eventName: "",
    eventDate: "",
    teamsInvolved: "",
    pubmatsLink: "",
    universityApproval: "",
    schoolName: "",
    startDate: "",
    endDate: "",
    ign: "",
    mlbbUid: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step !== 3) {
      setErrorMsg("You can only submit the form on the final step.");
      return;
    }

    // Required field validation
    const requiredFields = [
      "email",
      "understoodSOP",
      "applicantName",
      "fbLink",
      "eventName",
      "eventDate",
      "teamsInvolved",
      "pubmatsLink",
      "universityApproval",
      "schoolName",
      "startDate",
      "endDate",
      "ign",
      "mlbbUid",
    ];

    for (const key of requiredFields) {
      if (!form[key] || form[key].toString().trim() === "") {
        setErrorMsg("Please complete all required fields before submitting.");
        return;
      }
    }

    setErrorMsg("");
    console.log("Submitting form with data:", form);

    const formURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSciPtMsoi5CgY370N71EFgFjSwWgDpnhNKYpCuuV-cH5jsnwQ/formResponse";
    const formData = new FormData();

    // Personal Information
    formData.append("entry.483740921", form.email);
    formData.append("entry.392686996", form.understoodSOP);
    formData.append("entry.1673102413", form.applicantName);
    formData.append("entry.577044926", form.fbLink);

    // Event Information
    formData.append("entry.679190920", form.eventName);
    formData.append("entry.1715789088", form.eventDate);
    formData.append("entry.979860765", form.teamsInvolved);
    formData.append("entry.838976168", form.pubmatsLink);
    formData.append("entry.1481587313", form.universityApproval);

    // Application Summary
    formData.append("entry.1006542035", form.schoolName);
    formData.append("entry.1189603986", form.startDate);
    formData.append("entry.2024984152", form.endDate);
    formData.append("entry.803951214", form.ign);
    formData.append("entry.759416726", form.mlbbUid);

    try {
      await fetch(formURL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });

      setShowModal(true);
      setForm(initialFormState);
      setStep(1);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="MSL Tournament Lobby Application Form" />
      <Helmet>
        <title>MSL Tournament Lobby Application Form</title>
      </Helmet>


    <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4">
        <div className="bg-black/80 text-white rounded-2xl p-4 sm:p-8 w-full max-w-md sm:max-w-3xl shadow-lg mx-auto">
            <h2 className="font-bold mb-2 text-[20px] sm:text-[24px] lg:text-[30px] text-center">
                MSL Tournament Lobby Application Form
            </h2>

            <div className="text-center mb-2">
               {/* Always visible description */}
               <h3 className="text-gray-300 text-sm sm:text-base mb-3 leading-relaxed">
                    <h3>
                        Please fill out all required details accurately to help us process your request efficiently.
                    </h3>
                    <h3>
                        Requests must be submitted <span className="font-semibold text-white">20 days before</span> the date the Tournament Lobby is needed.
                    </h3>
                    <h3>
                        Access will be automatically granted to the submitted account for a <span className="font-semibold text-white">maximum of 2 days per event.</span>
                    </h3>
                    <h3>
                        Applicants must ensure that their poster include the <span className="font-semibold text-white">E-Project logo</span> and the phrase <span className="font-semibold text-white">"Supported by E-Project"</span>, as this is a required element for every TL request.
                    </h3>
                </h3>

                <h3 className="text-yellow-400 text-xs sm:text-sm mb-4">
                    Note: Please keep in mind that this form is only open to active and signed Esports organizations in the MSL Network. Requests from individuals or unpartnered schools may not be accommodated.
                </h3>

                {/* Step indicator */}
                {step === 1 && (
                    <h3 className="text-gray-400 text-sm sm:text-base">
                    Step 1 of 3 — Personal Information
                    </h3>
                )}
                {step === 2 && (
                    <h3 className="text-gray-400 text-sm sm:text-base">
                    Step 2 of 3 — Event Information
                    </h3>
                )}

                {step === 3 && (
                    <h3 className="text-gray-400 text-sm sm:text-base">
                    Step 3 of 3 — Application Summary
                    </h3>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 h-2 rounded-full mb-6">
                <div
                className="bg-[#F2C21A] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
                ></div>
            </div>


            {/* STEP 1: Personal Information */}
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

                {/* Understood SOP */}
                <div>
                    <label className="block font-medium mb-1">
                        The Standard Operating Procedures (SOP) for Tournament Lobby requests can be accessed{" "}
                        <a
                            href="https://www.canva.com/design/DAGeU7o1Dik/NAB2DVYmx6t2ENnKlZhlGg/edit?utm_content=DAGeU7o1Dik&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F2C21A] underline hover:text-[#ddb518]"
                        >
                            here
                        </a>
                        :
                    </label>
                    <div className="flex items-center bg-white/5 mt-2 rounded-xl p-3 gap-3 h-[52px]">
                        <input
                            type="radio"
                            id="understoodSOP"
                            name="understoodSOP"
                            value="Yes"
                            checked={form.understoodSOP === "Yes"}
                            onChange={handleChange}
                            required
                            className="w-5 h-5 accent-[#F2C21A] cursor-pointer"
                        />
                        <label
                            htmlFor="understoodSOP"
                            className="cursor-pointer text-white text-xs sm:text-sm leading-snug"
                            >
                            Yes, I have read and understood the Standard Operating Procedures for Tournament Lobby.
                        </label>
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
                        name="fbLink"
                        value={form.fbLink}
                        onChange={handleChange}
                        required
                        placeholder="https://facebook.com/yourprofile"
                        className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                    </div>
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

            {/* STEP 2: Event Information */}
            {step === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
                {/* Event Name */}
                <div>
                <label className="block font-medium mb-1">
                    Name of Event
                </label>
                <label className="text-gray-400 text-sm mb-2 leading-relaxed">
                    Your event name:
                    <ul className="list-disc pl-12 mt-2 space-y-1">
                        <li>Must not contain the word <span className="font-semibold text-white">“League”</span>.</li>
                        <li>Must not be the same as, or similar to, any official first-party event name.</li>
                        <li>Must not contain <span className="font-semibold text-white">“MLBB”</span>.</li>
                        <li>Must not contain <span className="font-semibold text-white">“Moonton”</span>.</li>
                        <li>Must not contain any inappropriate words.</li>
                    </ul>
                    <br></br>
                </label>
                <label className="text-gray-400 text-sm mb-2 leading-relaxed">
                    Note: You are encouraged to add <span className="font-semibold text-white">“featuring MLBB”</span> after your event name to explain the content. 
                    We have redesigned the “featuring MLBB” logo specifically for all 3rd-party organizers. 
                    <span className="font-semibold text-white"> Please remember to use the official E-Project logo — It is a MUST.</span>
                </label>
                <div className="flex items-center mt-1 bg-white/5 rounded-xl p-3 gap-3">
                    <FileText className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <input
                    type="text"
                    name="eventName"
                    value={form.eventName}
                    onChange={handleChange}
                    required
                    placeholder="Enter event name"
                    className="bg-transparent flex-1 outline-none text-white placeholder-gray-400"
                    />
                </div>
                </div>

                {/* Date of Event */}
                <div>
                    <label className="block font-medium mb-1">Date of the Event</label>
                    <h3 className="text-gray-400 text-sm mb-2">
                        Exact or tentative date of the event. State if the event will run for more than a day{" "}
                        <span className="font-semibold text-white">(e.g.,  January 1-15, 2024).</span>
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
                <div>

                {/* Number of Teams Involved */}
                <label className="block font-medium mb-1">
                    How many teams are involved in the event?
                </label>
                <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <Building2 className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <input
                    type="number"
                    name="teamsInvolved"
                    value={form.teamsInvolved}
                    onChange={handleChange}
                    required
                    placeholder="Enter number of teams"
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    />
                </div>
                </div>

                {/* Drive Link for Pubmats */}
                <div>
                    <label className="block font-medium mb-1">
                        Drive Link for Pubmats (with E-Project Logo included)
                    </label>

                    <p className="mt-4 text-white mb-1 font-semibold">Branding & Asset Usage Guidelines</p>

                    <label className="block text-gray-400 text-sm mb-2 leading-relaxed pl-12 [text-indent:-1rem]">
                        1. You <span className="font-semibold text-white">MUST</span> always use the <span className="font-semibold text-white">E-Project logo</span> in all marketing assets, including social media and broadcast materials.
                    </label>
                    <label className="block text-gray-400 text-sm mb-2 leading-relaxed pl-12 [text-indent:-1rem]">
                        2. You <span className="font-semibold text-white">MUST</span> use the <span className="font-semibold text-white">“Featuring MLBB” logo</span> in all marketing assets, including social media and broadcast materials.
                    </label>
                    <label className="block text-gray-400 text-sm mb-2 leading-relaxed pl-12 [text-indent:-1rem]">
                        3. You <span className="font-semibold text-white">MUST</span> include the text 
                        <span className="font-semibold text-white"> “© Moonton. All rights reserved.” </span>
                        on all social media assets published.
                    </label>
                    
                    <p className="mt-4 text-white mb-1 font-semibold">Additional Requirement</p>

                    <label className="block text-gray-400 text-sm mb-2 leading-relaxed pl-12 [text-indent:-1rem]">
                        • You <span className="font-semibold text-white">MUST</span> use the <span className="font-semibold text-white">“Featuring MLBB” logo</span> in all marketing assets, including social media and broadcast materials.
                    </label>
                    <label className="block text-gray-400 text-sm mb-2 leading-relaxed pl-12 [text-indent:-1rem]">
                        • All publicity materials (pub mats) must include the E-Project logo and the text 
                        <span className="font-semibold text-white"> “Supported by E-Project.” </span>
                        This is a required element for all Tournament Lobby (TL) requests.
                        All necessary assets, including logos, can be accessed by clicking {" "}
                        <a 
                            href="https://drive.google.com/drive/folders/1hmmL5WVJIDy-rn3jOtL4cDslqGOO8u6Y"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F2C21A] underline hover:text-[#ddb518]"
                        >
                            here
                        </a>.
                    </label>
                <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                    <LinkIcon className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <input
                    type="url"
                    name="pubmatsLink"
                    value={form.pubmatsLink}
                    onChange={handleChange}
                    required
                    placeholder="Enter your Google Drive or file link"
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    />
                </div>
                </div>

                {/* Signed Event Proposal */}
                <div>
                <label className="block font-medium mb-1">
                    Submit your signed event Proposal (University Approval)
                </label>
                <label className="text-gray-400 text-sm mb-2 leading-relaxed">
                    Please provide an <span className="font-semibold text-white">approval letter</span> or <span className="font-semibold text-white">official proof of the school's approval</span> for the event.
                </label>
                <label className="text-gray-400 text-sm mb-2 leading-relaxed">
                    Kindly share your Google Drive link with either <span className="font-semibold text-white">view</span> or <span className="font-semibold text-white">edit</span> access so we can review your file without permission issues.
                </label>
                <div className="flex items-center mt-1 bg-white/5 rounded-xl p-3 gap-3">
                    <FileText className="text-[#F2C21A] w-5 h-5 shrink-0" />
                    <input
                    type="url"
                    name="universityApproval"
                    value={form.universityApproval}
                    onChange={handleChange}
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    placeholder="Google Drive or File Link"
                    required
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

        {/* STEP 3: Application Summary */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* School Name */}
            <div>
                <label className="block font-medium mb-1">
                    Full Name of School
                </label>
              <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                <School className="text-[#F2C21A] w-5 h-5" />
                <input
                    type="text"
                    name="schoolName"
                    value={form.schoolName}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name of school"
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    />
              </div>
            </div>

            {/* Event Start and End Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block font-medium mb-1">Start Date</label>
                <label className="text-gray-400 text-sm mb-2 leading-relaxed">
                    Make sure that the <span className="font-semibold text-white">start and end dates cover no more than 2 consecutive days. </span> Access will not be granted for requests exceeding this limit.  
                </label>
                    <div className="relative mt-2">
                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="bg-white/5 w-full rounded-xl p-3 outline-none"
                            required
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F2C21A] w-5 h-5 pointer-events-none" />
                    </div>
                </div>
                <div>
                <label className="block font-medium mb-1">End Date</label>
                <label className="text-gray-400 text-sm mb-2 leading-relaxed">
                    Make sure that the <span className="font-semibold text-white">start and end dates cover no more than 2 consecutive days. </span> Access will not be granted for requests exceeding this limit.  
                </label>
                    <div className="relative mt-2">
                        <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="bg-white/5 w-full rounded-xl p-3 outline-none"
                        required
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F2C21A] w-5 h-5 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* In-Game Name and MLBB UID */}
            <div>
              <label className="block font-medium mb-1">IGN</label>
              <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                <IdCard className="text-[#F2C21A] w-5 h-5 shrink-0" />
                <input
                    type="text"
                    name="ign"
                    value={form.ign}
                    onChange={handleChange}
                    required
                    placeholder="Eg: YourInGameName"
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">MLBB UID</label>
              <div className="flex items-center bg-white/5 rounded-xl p-3 gap-3">
                <Gamepad2 className="text-[#F2C21A] w-5 h-5 shrink-0" />
                <input
                    type="text"
                    name="mlbbUid"
                    value={form.mlbbUid}
                    onChange={handleChange}
                    required
                    placeholder="Eg: 12345678"
                    className="bg-transparent w-full outline-none text-white placeholder-gray-400"
                    />
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
            <div className="bg-white text-gray-800 rounded-2xl p-6 text-center max-w-sm">
              <CheckCircle className="text-green-500 mx-auto mb-3" size={40} />
              <h2 className="text-lg font-semibold mb-2">
                Application Submitted!
              </h2>
              <p className="text-sm mb-4">
                Your tournament application has been successfully sent.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold"
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