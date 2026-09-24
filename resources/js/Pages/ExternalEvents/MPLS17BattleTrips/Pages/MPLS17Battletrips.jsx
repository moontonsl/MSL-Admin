import React, { useState, useRef, useEffect } from "react";
import MLLogin from "@/Pages/MLLoginApi/MLLogin";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBTS17.jsx";
import BG from "../Assets/Images/BTMPLS17-BG.png";
import Logo from "../Assets/Images/BTLogo.png";

import { User, Mail, School, Hash, Globe, Phone, Calendar, Check } from "lucide-react";

/* ================= TOOLTIP ================= */

const Tooltip = ({ text }) => (
    <div className="relative group ml-auto">
        <span className="text-[#e59639] cursor-pointer font-bold text-sm">?</span>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white text-black text-xs px-3 py-2 rounded-lg shadow-lg w-56 z-50 border border-[#e59639]">
        {text}
        </div>
    </div>
    );

/* ================= MAIN COMPONENT ================= */

export default function MPLS18Battletrips({ topics }) {
    const COMMUNITY_OPTIONS = [
        { value: "MSL", label: "MSL" },
        { value: "CH", label: "CH" },
    ];
    const REGION_OPTIONS = [
        { value: "NCR", label: "NCR – National Capital Region" },
        { value: "CAR", label: "CAR – Cordillera Administrative Region" },
        { value: "Region I", label: "Region I – Ilocos Region" },
        { value: "Region II", label: "Region II – Cagayan Valley" },
        { value: "Region III", label: "Region III – Central Luzon" },
        { value: "Region IV-A", label: "Region IV-A – CALABARZON" },
        { value: "Region IV-B", label: "Region IV-B – MIMAROPA" },
        { value: "Region V", label: "Region V – Bicol Region" },
        { value: "Region VI", label: "Region VI – Western Visayas" },
        { value: "Region VII", label: "Region VII – Central Visayas" },
        { value: "Region VIII", label: "Region VIII – Eastern Visayas" },
        { value: "Region IX", label: "Region IX – Zamboanga Peninsula" },
        { value: "Region X", label: "Region X – Northern Mindanao" },
        { value: "Region XI", label: "Region XI – Davao Region" },
        { value: "Region XII", label: "Region XII – SOCCSKSARGEN" },
        { value: "Region XIII", label: "Region XIII – Caraga" },
        { value: "BARMM", label: "BARMM – Bangsamoro Autonomous Region in Muslim Mindanao" },
    ];
    const topicOptions = topics || [];

    const initialForm = {
        name: "",
        birthdate: "",
        regionDropdown: "",
        region: "",
        contact: "",
        facebook: "",
        email: "",
        validId: "",
        community: "MSL",
        smartSubscriber: "",
        academicTrack: "",
        selectedTopic: "",
        topicInterest: "",
        agreedAccuracy: false,
        agreedPrivacy: false,
        likeMPLPage: "",
        likeMSLPage: "",
        likeCHPage: "",
        joinMPLGroup: "",
    };

        const [form, setForm] = useState(initialForm);

        const [errors, setErrors] = useState({});
        const [showTerms, setShowTerms] = useState(null);
        const [showModal, setShowModal] = useState(false);
        const [hoveredTopic, setHoveredTopic] = useState(null);
        const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
        const topicDropdownRef = useRef(null);

        // TEMP: bypass MLBB verification for frontend testing
        const [showVerifyModal, setShowVerifyModal] = useState(true);

        const [mlbbId, setMlbbId] = useState("");
        const [mlbbServer, setMlbbServer] = useState("");
        const [verified, setVerified] = useState(false);
        
        const [activeModal, setActiveModal] = useState(null);
        const mlLoginRef = useRef(null);

        const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error'
        const [showStatusModal, setShowStatusModal] = useState(false);
        const [tempMlData, setTempMlData] = useState(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        /* ================= VALIDATION ================= */

        const is16Plus = (birthdate) => {
            const today = new Date();
            const birth = new Date(birthdate);
                let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }

            return age >= 16;
            };

        const validate = () => {
            let e = {};

            if (!form.name.trim()) e.name = "Name is required.";

            if (!form.birthdate) e.birthdate = "Birthdate is required.";
            else if (!is16Plus(form.birthdate))
                e.birthdate = "You must be at least 16 years old.";

            if (!form.regionDropdown) e.regionDropdown = "Please select your region.";
            if (!form.region.trim()) e.region = "Region / School is required.";

            const phoneRegex = /^09\d{9}$/;

            if (!form.contact.trim())
                e.contact = "Contact number is required.";
            else if (!phoneRegex.test(form.contact))
                e.contact = "Enter a valid PH number (09XXXXXXXXX).";

            if (!form.facebook.trim()) e.facebook = "Facebook profile link required.";
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!form.email.trim())
                e.email = "Email address required.";
            else if (!emailRegex.test(form.email))
                e.email = "Please enter a valid email address.";
            
            if (!form.validId.trim()) e.validId = "Google Drive link required.";
            if (!mlbbId) e.mlbbId = "MLBB UID verification required.";
            if (!mlbbServer) e.mlbbServer = "MLBB Server verification required.";
            if (!form.community) e.community = "Please select a community.";
            if (!form.smartSubscriber) e.smartSubscriber = "Please select Yes or No.";
            if (!form.academicTrack.trim()) e.academicTrack = "Please enter your academic track or degree program.";
            if (!form.selectedTopic) e.selectedTopic = "Please select a topic of interest.";
            if (!form.topicInterest.trim()) e.topicInterest = "Please explain why this topic interests you.";
            if (!form.agreedAccuracy) e.agreedAccuracy = "Please certify that your information is accurate and truthful.";
            if (!form.agreedPrivacy) e.agreedPrivacy = "Please acknowledge data privacy consent.";

            if (form.likeMPLPage !== "Yes")
                e.likeMPLPage = "Please follow the page before selecting Yes.";

            if (form.likeMSLPage !== "Yes")
                e.likeMSLPage = "Please follow the page before selecting Yes.";

            if (form.likeCHPage !== "Yes")
                e.likeCHPage = "Please follow the page before selecting Yes.";

            if (form.joinMPLGroup !== "Yes")
                e.joinMPLGroup = "Please join the group before selecting Yes.";

            setErrors(e);

            return Object.keys(e).length === 0;
        };

        /* ================= HANDLERS ================= */

        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;

            let v = type === 'checkbox' ? checked : value;

            if (name === "contact") {
                v = value.replace(/\D/g, "").slice(0, 11);
            }

            if (name === "mlbbId") v = value.replace(/\D/g, "").slice(0, 12);
            if (name === "mlbbServer") v = value.replace(/\D/g, "").slice(0, 6);

            if (name === "joinMPLGroup" && value === "No") {
                setActiveModal({
                title: "Join the MPL Facebook Community",
                link: "https://www.facebook.com/groups/mplphilippinesofficial/?ref=share&mibextid=NSMWBT",
                });

                v = "";
            }

            if (name === "likeMPLPage" && value === "No") {
                setActiveModal({
                title: "Like the MPL Page",
                link: "https://www.facebook.com/share/171Rpf73QJ/",
                });

                v = "";
            }

            if (name === "likeMSLPage" && value === "No") {
                setActiveModal({
                title: "Like the MSL Page",
                link: "https://www.facebook.com/share/1ZrTg5hGG6/",
                });

                v = "";
            }

            if (name === "likeCHPage" && value === "No") {
                setActiveModal({
                title: "Like the CH Page",
                link: "https://www.facebook.com/share/1LAUXewtSG/",
                });

                v = "";
            }

            setForm((prev) => {
                const next = { ...prev, [name]: v };


                return next;
            });

            setErrors((prev) => ({ ...prev, [name]: "" }));
        };

             const handleSubmit = async (e) => {
                e.preventDefault();

                if (!validate()) return;

                setIsSubmitting(true);

                const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/1OKWoaaGNcKeq-HxiV5UM8e6ilhDo84dkp4LlRThdg7s/formResponse";
                
                const formBody = new FormData();
                formBody.append("entry.729291285", form.name);
                formBody.append("entry.402538445", form.birthdate);
                formBody.append("entry.1939203588", form.regionDropdown);
                formBody.append("entry.262902066", form.region);
                formBody.append("entry.1495590749", form.contact);
                formBody.append("entry.752780621", form.facebook);
                formBody.append("entry.1827884672", form.email);
                formBody.append("entry.620958207", mlbbId);
                formBody.append("entry.847940885", mlbbServer);
                formBody.append("entry.223095383", form.validId);
                formBody.append("entry.73129402", form.community);
                formBody.append("entry.707751425", form.likeMPLPage);
                formBody.append("entry.1668597456", form.likeMSLPage);
                formBody.append("entry.2025817146", form.likeCHPage);
                formBody.append("entry.1715367664", form.joinMPLGroup);
                formBody.append("entry.1573792121", form.smartSubscriber);
                formBody.append("entry.1133001918", form.academicTrack);
                formBody.append("entry.136116163", form.selectedTopic);
                formBody.append("entry.1783674452", form.topicInterest);
                formBody.append("entry.1422588371", form.agreedAccuracy ? "Yes" : "No");
                formBody.append("entry.1808873271", form.agreedPrivacy ? "Yes" : "No");

                try {
                    await fetch(GOOGLE_FORM_ACTION_URL, {
                        method: "POST",
                        body: formBody,
                        mode: "no-cors",
                    });

                    setShowModal(true);
                } catch (error) {
                    console.error("Error submitting to GSheet:", error);
                    alert("There was an error submitting your entry. Please try again.");
                } finally {
                    setIsSubmitting(false);
                }
            };

            const handleLoginInfo = (info) => {
            console.log("MLBB Login Info:", info);
            
            // Moonton API usually returns { code: 0, data: { uid, server_id, ... } }
            // Or { success: true, data: { ... } } if from our backend
            const data = info.data || info;
            
            if (info && info.data) {
                const uid = data.uid || data.roleId;
                const server = data.server_id || data.zoneId;
                const ign = data.nick_name || data.name || "Player";

                setTempMlData({ uid, server, ign });
                setVerificationStatus('success');
                setShowStatusModal(true);
            } else {
                setVerificationStatus('error');
                setShowStatusModal(true);
            }
        };

        const confirmVerification = () => {
            if (tempMlData) {
                setMlbbId(tempMlData.uid);
                setMlbbServer(tempMlData.server);
                setVerified(true);

                setErrors((prev) => ({
                    ...prev,
                    mlbbId: "",
                    mlbbServer: ""
                }));

                setShowVerifyModal(false);
                setShowStatusModal(false);
                setTempMlData(null);
            }
        };

        /* ================= UI ================= */

    return (
        <>
            <Head title="MPLS18 Battle Trips" />
            <Helmet>
                <title>MPLS18 Battle Trips</title>
            </Helmet>

            <AuthenticatedLayout>
                <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 sm:pt-5 font-['Montserrat'] bg-cover bg-top bg-no-repeat" style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}>
                    <img src={Logo} alt="Battle Trips Logo" className="w-64 sm:w-80 mb-4" />

                    <div className="text-black text-center max-w-2xl mt-4 mb-6 text-[12px] sm:text-base md:text-lg font-medium leading-tight [text-shadow:_0_0_6px_#fff,_0_0_12px_rgba(255,255,255,.85)]">
                        The MPL Battle Trips is an 8-week event where fans of MLBB from the Philippines will be given a chance to visit the MPL PH venue and enjoy the MLBB events.
                    </div>

                    <div className="text-black text-center mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-widest [text-shadow:_0_0_6px_#fff,_0_0_12px_rgba(255,255,255,.85)] uppercase">
                        Submission Form
                    </div>

                    {/* FORM CARD */}
                    <div className="p-4 sm:p-6 md:p-8 w-full max-w-3xl rounded-xl border border-solid border-[#e59639] shadow-xl bg-white text-black">
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

                    {/* Full Name */}
                    <FormInput icon={<User />} label="Full Name" name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} error={errors.name} />

                    {/* Birthdate */}
                    <FormInput icon={<Calendar />} type="date" label="Birthdate" name="birthdate" value={form.birthdate} onChange={handleChange} error={errors.birthdate} />

                    {/* Region */}
                    <div className="space-y-2">
                        <label className="font-semibold block">Region</label>
                        <select
                            name="regionDropdown"
                            value={form.regionDropdown}
                            onChange={handleChange}
                            className="w-full border border-[#e59639] px-4 py-3 rounded-md bg-white text-black"
                        >
                            <option disabled value="">Select a region</option>
                            {REGION_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.regionDropdown && <p className="text-red-500 text-sm mt-2">{errors.regionDropdown}</p>}
                    </div>

                    {/* Area / School */}
                    <FormInput icon={<School />} label="Area / School" name="region" placeholder="Enter your region, area, or school" value={form.region} onChange={handleChange} error={errors.region} />

                    {/* Contact Number */}
                    <FormInput icon={<Phone />} label="Contact Number" name="contact" placeholder="09XXXXXXXXX" inputMode="numeric" pattern="[0-9]*" value={form.contact} onChange={handleChange} error={errors.contact} />

                    {/* Facebook */}
                    <FormInput icon={<Globe />} label="Facebook Profile Link" name="facebook" placeholder="https://facebook.com/yourprofile" value={form.facebook} onChange={handleChange} tooltip="Paste your Facebook profile link" error={errors.facebook} />

                    {/* Valid Email Address */}
                    <FormInput icon={<Mail />} label="Valid Email Address" name="email" placeholder="example@email.com" value={form.email} onChange={handleChange} tooltip="Use an active email address" error={errors.email} />

                    {/* Valid ID */}
                    <FormInput icon={<Globe />} label="Valid ID" name="validId" placeholder="Paste your Google Drive link to a valid ID" value={form.validId} onChange={handleChange} tooltip="Provide a shareable Google Drive link to your valid ID" error={errors.validId} />

                    {/* MLBB ACCOUNT (AUTO VERIFIED) */}
                    <FormInput verified={verified} icon={<Hash />} label="MLBB UID" name="mlbbId" value={mlbbId} disabled={true} error={errors.mlbbId} />

                    <FormInput verified={verified} icon={<Globe />} label="MLBB Server" name="mlbbServer" value={mlbbServer} disabled={true} error={errors.mlbbServer} />

                    <div className="border border-solid border-[#e59639] p-4 rounded-lg bg-gray-50">
                        <label className="font-semibold block mb-2">Community</label>
                        <select
                            name="community"
                            value={form.community}
                            onChange={handleChange}
                            className="w-full border border-[#e59639] px-4 py-3 rounded-md bg-white text-black"
                        >
                            <option disabled value="">Select a community</option>
                            {COMMUNITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.community && <p className="text-red-500 text-sm mt-2">{errors.community}</p>}
                    </div>

                    {/* MPL SOCIAL REQUIREMENTS */}
                    <YesNoQuestion label="Have you already followed the MPL Page?" name="likeMPLPage" value={form.likeMPLPage} onChange={handleChange} error={errors.likeMPLPage} />

                    <YesNoQuestion label="Have you already followed the MSL Page?" name="likeMSLPage" value={form.likeMSLPage} onChange={handleChange} error={errors.likeMSLPage} />

                    <YesNoQuestion label="Have you already followed the CH Page?" name="likeCHPage" value={form.likeCHPage} onChange={handleChange} error={errors.likeCHPage} />
                    
                    <YesNoQuestion label="Are you a member of the MPL Official Group?" name="joinMPLGroup" value={form.joinMPLGroup} onChange={handleChange} error={errors.joinMPLGroup} />

                    {/* SMART */}
                    <div className="border border-solid border-[#e59639] p-4 rounded-lg bg-gray-50">
                        <label className="font-semibold block mb-2 text-center">
                            Are you a Smart Subscriber?
                        </label>

                        <select
                            name="smartSubscriber"
                            value={form.smartSubscriber}
                            onChange={handleChange}
                            className="w-full border border-[#e59639] px-4 py-3 rounded-md bg-white text-black"
                        >
                            <option disabled value="">Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>

                        {errors.smartSubscriber && (
                            <p className="text-red-500 text-sm mt-2 text-center max-w-xs mx-auto">
                                {errors.smartSubscriber}
                            </p>
                        )}
                    </div>

                    {/* ACADEMIC TRACK */}
                    <FormInput icon={<School />} label="Current Academic Track / Degree Program (e.g., BS Information Technology)" name="academicTrack" placeholder="Enter your academic track or degree program" value={form.academicTrack} onChange={handleChange} error={errors.academicTrack} />

                    {/* SELECTED TOPIC OF INTEREST */}
                    <div className="space-y-2 relative" ref={topicDropdownRef}>
                        <label className="font-semibold block">Selected Topic of Interest</label>
                        <button
                            type="button"
                            onClick={() => setTopicDropdownOpen((prev) => !prev)}
                            className="w-full border border-[#e59639] px-4 py-3 rounded-md bg-white text-black flex items-center justify-between"
                        >
                            <span>{form.selectedTopic ? topicOptions.find((topic) => topic.name === form.selectedTopic)?.name : 'Choose your topic of interest'}</span>
                            <span className="text-gray-500">▾</span>
                        </button>
                        {topicDropdownOpen && (
                            <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl z-10">
                                {topicOptions.map((topic) => {
                                    const disabled = topic.status !== 'OPEN';
                                    return (
                                        <button
                                            key={topic.name}
                                            type="button"
                                            disabled={disabled}
                                            onClick={() => {
                                                if (disabled) return;
                                                setForm((prev) => ({ ...prev, selectedTopic: topic.name }));
                                                setErrors((prev) => ({ ...prev, selectedTopic: '' }));
                                                setTopicDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 flex items-center gap-2 ${disabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'cursor-pointer hover:bg-gray-100 text-black'}`}
                                        >
                                            <p
                                                className={
                                                    topic.status === 'OPEN' ? 'text-green-600 font-semibold' :
                                                    topic.status === 'FULL' ? 'text-red-600 font-semibold' :
                                                    'text-gray-500 font-semibold'
                                                }
                                            >
                                                {topic.status}
                                            </p>
                                            <p>{topic.name}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {errors.selectedTopic && <p className="text-red-500 text-sm mt-2">{errors.selectedTopic}</p>}
                        <p className="text-gray-500 text-sm">
                            {form.selectedTopic
                                ? topicOptions.find((topic) => topic.name === form.selectedTopic)?.description
                                : 'Select a topic to see its description.'}
                        </p>
                    </div>

                    {/* TOPIC INTEREST */}
                    <div>
                        <label className="font-semibold mb-1 block">Why does this topic interest you? (Paragraph)</label>
                        <textarea
                            name="topicInterest"
                            value={form.topicInterest}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Tell us why this topic interests you"
                            className="w-full border border-[#e59639] rounded-xl px-4 py-3 bg-white text-black outline-none resize-vertical"
                        />
                        {errors.topicInterest && <p className="text-red-500 text-sm mt-2">{errors.topicInterest}</p>}
                    </div>

{/* DATA PRIVACY */}
<div className="border p-4 rounded-lg bg-gray-200 space-y-4">
    <div className="flex items-start gap-3">
        <input
            type="checkbox"
            name="agreedAccuracy"
            checked={form.agreedAccuracy}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded border-2 border-black bg-white checked:bg-[#e59639] checked:border-[#e59639] focus:outline-none focus:ring-2 focus:ring-[#e59639]/50"
        />
        <div className="flex-1 text-sm">
            I certify that the information I have provided is accurate and truthful, and I acknowledge that my selection is based on my stated field of interest, the topic I have described, and slot availability.
        </div>
        <button
            type="button"
            className="text-[#e59639] underline text-sm"
            onClick={() => setShowTerms('accuracy')}
        >
            View details
        </button>
    </div>
    {errors.agreedAccuracy && <p className="text-red-500 text-sm">{errors.agreedAccuracy}</p>}

    <div className="flex items-start gap-3">
        <input
            type="checkbox"
            name="agreedPrivacy"
            checked={form.agreedPrivacy}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded border-2 border-black bg-white checked:bg-[#e59639] checked:border-[#e59639] focus:outline-none focus:ring-2 focus:ring-[#e59639]/50"
        />
        <div className="flex-1 text-sm">
            By ticking this box, I hereby grant my free, prior, and informed consent to MSL, CH, and MPL Philippines to collect, store, and process my personal data solely for the purpose of registration, coordination, and documentation of this event.
        </div>
        <button
            type="button"
            className="text-[#e59639] underline text-sm"
            onClick={() => setShowTerms('privacy')}
        >
            View details
        </button>
    </div>
    {errors.agreedPrivacy && <p className="text-red-500 text-sm">{errors.agreedPrivacy}</p>}
</div>

                     {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#e59639] hover:bg-[#d47f20]'}`}
                    >
                        {isSubmitting && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {isSubmitting ? "Submitting..." : "Submit Entry"}
                    </button>
                    </form>
                </div>
                </div>
            </AuthenticatedLayout>

            {/* TERMS MODAL */}
            {showTerms && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999]">
                <div className="bg-white p-6 rounded-2xl max-w-lg w-full text-black shadow-xl border-2" style={{ borderColor: "#e59639" }}>
                    <h2 className="text-lg font-bold mb-3">
                        {showTerms === 'accuracy' ? 'Accuracy Certification Details' : 'Data Privacy Consent Details'}
                    </h2>

                    <div className="text-sm text-gray-700 space-y-3 max-h-[250px] overflow-y-auto pr-2">
                        {showTerms === 'accuracy' ? (
                            <>
                                <p>
                                    I certify that the information I have provided is accurate and truthful.
                                </p>
                                <p>
                                    I acknowledge that my selection is based on my stated field of interest, the topic I have described, and slot availability.
                                </p>
                                <p>
                                    This information will be used for verification and selection purposes related to this event.
                                </p>
                            </>
                        ) : (
                            <>
                                <p>
                                    By ticking this box, I hereby grant my free, prior, and informed consent to MSL, CH, and MPL Philippines to collect, store, and process my personal data.
                                </p>
                                <p>
                                    My personal data will be used solely for registration, coordination, and documentation of this event.
                                </p>
                                <p>
                                    I understand this will be handled in accordance with the Data Privacy Act of 2012 and the company’s Privacy Policy.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setShowTerms(null)}
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* SUCCESS MODAL */}
            {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
                <div
                    className="bg-white rounded-2xl p-8 text-center w-full max-w-md shadow-2xl border-2"
                    style={{ borderColor: "#e59639" }}
                >
                <div className="text-5xl mb-3">🎉</div>

                <h2 className="text-xl font-bold mb-2">
                Submission Received!
                </h2>

                <p className="text-gray-600 text-sm mb-6">
                Thank you for your entry. If chosen, we will send a confirmation of your participation to your registered email address. Additionally, our team may reach out to you via your provided Facebook profile or contact number for further coordination.
                </p>

                <button
                onClick={() => {
                    setShowModal(false);

                    // reset form
                    setForm(initialForm);

                    // reset MLBB verification
                    setMlbbId("");
                    setMlbbServer("");
                    setVerified(false);

                    // reopen verification modal
                    setShowVerifyModal(true);
                }}
                className="px-6 py-3 rounded-lg font-bold text-white transition hover:scale-105"
                style={{ backgroundColor: "#e59639" }}
                >
                Close
                </button>
            </div>
        </div>
            )}

            {/* MLBB VERIFY MODAL */}
            {showVerifyModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999]">
                
                <div
                    className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border-2"
                    style={{ borderColor: "#e59639" }}
                >

                    <div className="text-5xl mb-3">🎮</div>

                    <h2 className="text-xl font-bold mb-2">
                        Verify MLBB Account
                    </h2>

                    <p className="text-gray-600 text-sm mb-6">
                        You will be redirected to log in and verify your Mobile Legends account.
                        This step confirms your MLBB profile before submitting your entry.
                    </p>

                    <div className="flex justify-center gap-3">

                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-4 py-2 rounded-lg border border-gray-100  hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => mlLoginRef.current?.triggerLogin()}
                            className="px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all hover:scale-105"
                            style={{ backgroundColor: "#e59639" }}
                        >
                            Continue
                        </button>

                    </div>

                </div>

            </div>
            )}

            <MLLogin 
                ref={mlLoginRef} 
                onLoginInfo={handleLoginInfo}
            />

            {/* VERIFICATION STATUS MODAL */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border-t-8 border-[#e59639]">
                        {verificationStatus === 'success' ? (
                            <>
                                <div className="text-4xl mb-4 text-green-500">✅</div>
                                <h2 className="text-xl font-bold mb-2">Account Linked!</h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    We found your account: <br/>
                                    <span className="font-bold text-black text-base">{tempMlData?.ign}</span>
                                </p>
                                
                                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-dashed border-gray-300">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500 font-semibold">UID:</span>
                                        <span className="font-mono text-black">{tempMlData?.uid}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-semibold">Server:</span>
                                        <span className="font-mono text-black">{tempMlData?.server}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={confirmVerification}
                                    className="w-full py-3 rounded-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                                    style={{ backgroundColor: "#e59639" }}
                                >
                                    Confirm Account
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl mb-4">❌</div>
                                <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    We couldn't retrieve your MLBB profile. Please try logging in again.
                                </p>
                                <button 
                                    onClick={() => setShowStatusModal(false)}
                                    className="w-full py-3 rounded-lg font-bold text-white"
                                    style={{ backgroundColor: "#e59639" }}
                                >
                                    Retry
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {activeModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999]">
                
                <div
                className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border-2"
                style={{ borderColor: "#e59639" }}
                >

                <div className="text-4xl mb-3">📢</div>

                <h2 className="text-lg font-bold mb-3">
                    {activeModal.title}
                </h2>

                <p className="text-gray-600 text-sm mb-6">
                    Please follow/join the page before selecting Yes.
                </p>

                <div className="flex justify-center gap-3">

                    <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300"
                    >
                    Close
                    </button>

                    <a
                    href={activeModal.link}
                    target="_blank"
                    className="px-6 py-2 rounded-lg font-bold text-white"
                    style={{ backgroundColor: "#e59639" }}
                    >
                    Open Page
                    </a>

                </div>

                </div>

            </div>
            )}
        </>
    );
}

/* ================= REUSABLE INPUT ================= */

function FormInput({
    icon,
    label,
    name,
    value,
    placeholder,
    onChange,
    error,
    tooltip,
    type = "text",
    disabled = false,
    verified = false
    }) {

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-1">
                <label className="font-semibold block">{label}</label>
                {verified && (
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                         Verified Account
                    </span>
                )}
            </div>

            <div className={`flex items-center gap-3 border border-solid px-4 py-3 rounded-md bg-white transition-all ${verified ? 'border-green-500 bg-green-50' : 'border-[#e59639]'}`}>
                <div className={`${verified ? 'text-green-500' : 'text-[#e59639]'}`}>{icon}</div>

                <input
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full outline-none text-black disabled:bg-transparent disabled:text-black disabled:cursor-not-allowed font-medium"
                />

                {verified && (
                    <div className="text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                )}

                {tooltip && <Tooltip text={tooltip} />}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function YesNoQuestion({ label, name, value, onChange, error }) {
    return (
        <div className="border border-solid border-[#e59639] p-3 sm:p-4 rounded-lg bg-gray-50">

        <label className="font-semibold block mb-2 text-center text-sm sm:text-base">
            {label}
        </label>

        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full border border-[#e59639] px-4 py-3 rounded-md bg-white text-black"
        >
            <option disabled value="">Select an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>

        {error && (
            <p className="text-red-500 text-sm mt-2 text-center max-w-xs mx-auto">
            {error}
            </p>
        )}

        </div>
    );
}

// FrontEnd by PD - Jaijai
