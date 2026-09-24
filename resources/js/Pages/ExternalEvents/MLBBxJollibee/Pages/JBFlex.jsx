import React, { useState, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import MLLogin from "@/Pages/MLLoginApi/MLLogin";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBTS17.jsx";
import { User, School, Hash, Globe, Link2 } from "lucide-react";

const Hero = "/FRAME_ 2.png";
const PRIMARY = "#d71920";

const Tooltip = ({ text }) => (
    <div className="relative group ml-auto">
        <span className="text-[#d71920] cursor-pointer font-bold text-sm">?</span>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white text-black text-xs px-3 py-2 rounded-xl shadow-lg w-48 sm:w-56 z-50 border border-[#d71920]">
            {text}
        </div>
    </div>
);

const checkboxStyle = (checked) => ({
    appearance: "none",
    WebkitAppearance: "none",
    width: "16px",
    height: "16px",
    marginTop: "4px",
    borderRadius: "4px",
    border: "2px solid #d71920",
    backgroundColor: checked ? "#d71920" : "#ffffff",
    backgroundImage: checked
        ? 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%273 11 8 16 17 5%27/%3E%3C/svg%3E")'
        : "none",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "12px 12px",
    cursor: "pointer",
});

export default function JBFlex() {
    const initialForm = {
        name: "",
        school: "",
        uid: "",
        server: "",
        facebookProfileLink: "",
        postLink: "",
    };

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [agreed, setAgreed] = useState(false);
    const [agreedMechanics, setAgreedMechanics] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showMechanics, setShowMechanics] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(true);
    const [mlbbUid, setMlbbUid] = useState("");
    const [mlbbServer, setMlbbServer] = useState("");
    const [verified, setVerified] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [tempMlData, setTempMlData] = useState(null);
    const mlLoginRef = useRef(null);

    const isValidUrl = (value) => {
        try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.name.trim()) nextErrors.name = "Name is required.";
        if (!form.school.trim()) nextErrors.school = "School is required.";

        const uidStr = String(mlbbUid || "");
        if (!uidStr.trim()) nextErrors.uid = "MLBB UID is required.";
        else if (!/^\d{7,12}$/.test(uidStr))
            nextErrors.uid = "UID must be 7-12 digits.";

        const serverStr = String(mlbbServer || "");
        if (!serverStr.trim()) nextErrors.server = "MLBB Server is required.";
        else if (!/^\d{3,6}$/.test(serverStr))
            nextErrors.server = "Server must be 3-6 digits.";

        if (!form.facebookProfileLink.trim())
            nextErrors.facebookProfileLink = "Facebook profile link is required.";
        else if (!isValidUrl(form.facebookProfileLink))
            nextErrors.facebookProfileLink = "Enter a valid Facebook profile link.";

        if (!form.postLink.trim()) nextErrors.postLink = "Post link is required.";
        else if (!isValidUrl(form.postLink))
            nextErrors.postLink = "Enter a valid post link.";

        if (!agreedMechanics)
            nextErrors.mechanics = "Please agree to the game mechanics.";

        if (!agreed) nextErrors.consent = "Please agree to the Terms and Conditions.";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let nextValue = value;

        if (name === "uid" || name === "server") {
            nextValue = value.replace(/\D/g, "");
        }

        if (name === "uid") {
            setMlbbUid(nextValue);
            setErrors((prev) => ({ ...prev, uid: "" }));
            return;
        }

        if (name === "server") {
            setMlbbServer(nextValue);
            setErrors((prev) => ({ ...prev, server: "" }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: nextValue }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleLoginInfo = (info) => {
        const data = info.data || info;

        if (info && (data.uid || data.roleId)) {
            const uid = data.uid || data.roleId;
            const server = data.server_id || data.zoneId;
            const ign = data.nick_name || data.name || "Player";

            setTempMlData({ uid, server, ign });
            setVerificationStatus("success");
            setShowStatusModal(true);
        } else {
            setVerificationStatus("error");
            setShowStatusModal(true);
        }
    };

    const confirmVerification = () => {
        if (tempMlData) {
            setMlbbUid(tempMlData.uid);
            setMlbbServer(tempMlData.server);
            setVerified(true);
            setShowVerifyModal(false);
            setShowStatusModal(false);
            setErrors((prev) => ({ ...prev, uid: "", server: "" }));
        }
    };

    const getFormattedDate = () => {
        const d = new Date();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validate();
        if (!isValid) return;

        if (!String(mlbbUid || "").trim() || !String(mlbbServer || "").trim() || !verified) {
            setShowVerifyModal(true);
            return;
        }
        setIsSubmitting(true);

        try {
            // 1. Submit to local database
            const response = await fetch(route('jbflex.submit'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    ...form,
                    uid: String(mlbbUid),
                    server: String(mlbbServer),
                }),
            });

            const result = await response.json();

            if (result.success) {
                // 2. Double-record to Google Forms
                const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLScKj8yuFk0_l4YHLfEzmDLPGHNyuNsscCiBpInBlRm2rJmQwg/formResponse"; 
                if (GOOGLE_FORM_ACTION_URL) {
                    const googleFormData = new FormData();
                    googleFormData.append("entry.667666584", form.name);
                    googleFormData.append("entry.2058193001", form.school);
                    googleFormData.append("entry.1280932662", String(mlbbUid));
                    googleFormData.append("entry.107469135", String(mlbbServer));
                    googleFormData.append("entry.290976084", form.facebookProfileLink);
                    googleFormData.append("entry.1456806184", form.postLink);
                    googleFormData.append("entry.1180864", "Yes");
                    googleFormData.append("entry.1483156473", "Yes");
                    googleFormData.append("entry.1267887881", getFormattedDate());

                    await fetch(GOOGLE_FORM_ACTION_URL, {
                        method: "POST",
                        body: googleFormData,
                        mode: "no-cors",
                    });
                }

                setShowModal(true);
            } else {
                alert(result.message || "Something went wrong.");
            }
        } catch (error) {
            alert("An error occurred while submitting. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="MLBB x Jollibee" />
            <Helmet>
                <title>MLBB x Jollibee</title>
            </Helmet>

            <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 py-8 sm:p-6 font-['Montserrat'] bg-white">
                <img src={Hero} alt="Jollibee Joy mascot" className="w-32 sm:w-48 md:w-64 mb-4 drop-shadow-xl" />

                <div className="text-black text-center mb-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-normal [text-shadow:_0_0_6px_#fff,_0_0_12px_rgba(255,255,255,.85)]">
                    #FlexYourWowBida Challenge
                </div>

                <div className="p-5 sm:p-8 w-full max-w-3xl rounded-xl border border-[#d71920] shadow-xl bg-[#d71920] text-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-6 flex flex-col items-center">
                            <h2 className="text-lg sm:text-xl font-bold mb-2">
                                Flex your Pabida Emote Submission
                            </h2>

                            <p className="text-[#ffd0d2] text-xs sm:text-sm text-center">
                                Please fill out the submission details below for the MLBB x Jollibee event.
                            </p>
                        </div>

                        <FormInput
                            icon={<User size={20} />}
                            label="Name"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        <FormInput
                            icon={<School size={20} />}
                            label="School"
                            name="school"
                            placeholder="Enter your school"
                            value={form.school}
                            onChange={handleChange}
                            error={errors.school}
                        />

                        <FormInput
                            icon={<Hash size={20} />}
                            label="MLBB UID"
                            name="uid"
                            placeholder="MLBB UID"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={mlbbUid}
                            onChange={handleChange}
                            verified={verified}
                            error={errors.uid}
                        />

                        <FormInput
                            icon={<Globe size={20} />}
                            label="MLBB Server"
                            name="server"
                            placeholder="MLBB Server"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={mlbbServer}
                            onChange={handleChange}
                            verified={verified}
                            error={errors.server}
                        />

                        <FormInput
                            icon={<Globe size={20} />}
                            label="Facebook Profile Link"
                            name="facebookProfileLink"
                            placeholder="https://facebook.com/yourprofile"
                            value={form.facebookProfileLink}
                            onChange={handleChange}
                            tooltip="Paste your Facebook profile link."
                            error={errors.facebookProfileLink}
                        />

                        <FormInput
                            icon={<Link2 size={20} />}
                            label="Post link"
                            name="postLink"
                            placeholder="https://facebook.com/your-post"
                            value={form.postLink}
                            onChange={handleChange}
                            tooltip="Paste the link to your post."
                            error={errors.postLink}
                        />

                        <div className="border border-[#ffd0d2] p-4 rounded-2xl bg-white">
                            <label className="flex items-start gap-3 text-black">
                                <input
                                    type="checkbox"
                                    checked={agreedMechanics}
                                    onChange={() => {
                                        setShowMechanics(true);
                                        setErrors((prev) => ({ ...prev, mechanics: "" }));
                                    }}
                                    className="shrink-0 mt-1"
                                    style={checkboxStyle(agreedMechanics)}
                                />
                                <span className="text-xs sm:text-sm leading-relaxed">
                                    By clicking this box, I agree with the game mechanics.{" "}
                                    <button
                                        type="button"
                                        onClick={() => setShowMechanics(true)}
                                        className="text-[#d71920] font-bold underline"
                                    >
                                        View Mechanics
                                    </button>
                                </span>
                            </label>
                            {errors.mechanics && (
                                <p className="text-[#facc15] text-[10px] mt-1.5 font-bold ml-1">{errors.mechanics}</p>
                            )}
                        </div>

                        <div className="border border-[#ffd0d2] p-4 rounded-2xl bg-white">
                            <label className="flex items-start gap-3 text-black">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={() => {
                                        setShowTerms(true);
                                        setErrors((prev) => ({ ...prev, consent: "" }));
                                    }}
                                    className="shrink-0 mt-1"
                                    style={checkboxStyle(agreed)}
                                />
                                <span className="text-xs sm:text-sm leading-relaxed">
                                    By clicking this box, I agree to the Terms and Conditions.{" "}
                                    <button
                                        type="button"
                                        onClick={() => setShowTerms(true)}
                                        className="text-[#d71920] font-bold underline"
                                    >
                                        View Terms
                                    </button>
                                </span>
                            </label>
                            {errors.consent && (
                                <p className="text-[#facc15] text-[10px] mt-1.5 font-bold ml-1">{errors.consent}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!mlbbUid || !mlbbServer || isSubmitting}
                            className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${!mlbbUid || !mlbbServer || isSubmitting
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-white text-[#d71920] hover:bg-[#fff4f4] active:scale-[0.98]"
                                }`}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Entry"}
                        </button>
                    </form>
                </div>
            </div>

            {showTerms && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[10000]">
                    <div
                        className="bg-white p-6 rounded-xl max-w-lg w-full text-black shadow-xl border-2"
                        style={{ borderColor: PRIMARY }}
                    >
                        <h2 className="text-lg font-bold mb-3">Terms and Conditions</h2>

                        <div className="text-sm text-gray-700 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            <p>
                                By clicking this box, I hereby grant my free, prior, and informed consent
                                to the event organizers to collect, store, and process my personal data.
                            </p>
                            <p>
                                The information provided will only be used for event registration,
                                participant verification, and coordination related to this activity.
                            </p>
                            <p>
                                I understand that my personal data will be handled in accordance with
                                the Data Privacy Act of 2012 and the organization&apos;s privacy policy.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowTerms(false)}
                                className="order-2 sm:order-1 px-4 py-2 rounded-xl border border-gray-300 font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setAgreed(true);
                                    setShowTerms(false);
                                    setErrors((prev) => ({ ...prev, consent: "" }));
                                }}
                                className="order-1 sm:order-2 px-6 py-2 rounded-xl font-bold text-white shadow-md"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                I Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMechanics && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[10000]">
                    <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-gray-50 text-black shadow-2xl animate-in fade-in zoom-in duration-200">
                        
                        <div className="px-6 py-6 bg-white border-b border-gray-100 flex flex-col items-center text-center relative">
                            <div className="inline-block px-3 py-1 rounded-full bg-[#fff4f4] text-[#d71920] text-[10px] font-bold uppercase tracking-wider mb-2">
                                Event Guidelines
                            </div>

                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                                How to Join #FlexYourWowBida Challenge
                            </h2>

                            <p className="w-full text-gray-500 text-xs sm:text-sm mt-2 px-4">
                                Follow these steps to qualify for the MLBB x Jollibee event
                            </p>
                        </div>

                        <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4">
                            <div className="grid gap-4">
                                <MechanicCard
                                    num="1"
                                    title="Claim the Emote"
                                    body="Claim the official 'Wow Bida' emote in-game through the Jollibee event interface."
                                />
                                <MechanicCard
                                    num="2"
                                    title="Record Gameplay"
                                    body="Record a video using the emote during a match (e.g., after a kill, a clutch escape, or a victory)."
                                />
                                <MechanicCard
                                    num="3"
                                    title="Upload Socials"
                                    body="Post your video on Facebook or TikTok. Ensure your post privacy is set to Public."
                                />
                            </div>

                            <div className="rounded-2xl bg-[#d71920] p-4 text-white text-center shadow-inner">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">
                                    Required Hashtags
                                </h3>
                                <p className="font-mono text-xs sm:text-sm font-bold break-words leading-relaxed">
                                    #MSLPhilippines #MLBBWowBida #MLBBxJollibee #MSLFlexYourWowBida
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 p-6 bg-white border-t border-gray-100">
                            <button
                                onClick={() => setShowMechanics(false)}
                                className="order-2 sm:order-1 flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm"
                            >
                                Back
                            </button>

                            <button
                                onClick={() => {
                                    setAgreedMechanics(true);
                                    setShowMechanics(false);
                                    setErrors((prev) => ({ ...prev, mechanics: "" }));
                                }}
                                className="order-1 sm:order-2 flex-[2] px-6 py-3 rounded-2xl font-bold text-white shadow-lg shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                Accept & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-4">
                    <div
                        className="bg-white rounded-xl p-6 sm:p-8 text-center w-full max-w-md shadow-2xl border-2"
                        style={{ borderColor: PRIMARY }}
                    >
                        <div className="text-5xl mb-3">🎉</div>

                        <h2 className="text-black text-xl font-bold mb-2">
                            Submission Successful!
                        </h2>

                        <p className="text-gray-600 text-sm mb-6">
                            Thank you for submitting your MLBB x Jollibee submission details.
                        </p>

                        <button
                            onClick={() => {
                                setShowModal(false);
                                setForm(initialForm);
                                setAgreed(false);
                                setAgreedMechanics(false);
                                setMlbbUid("");
                                setMlbbServer("");
                                setShowVerifyModal(true);
                            }}
                            className="w-full sm:w-auto px-10 py-3 rounded-xl font-bold text-white transition hover:scale-105"
                            style={{ backgroundColor: PRIMARY }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showVerifyModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[10000]">
                    <div
                        className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl border-2"
                        style={{ borderColor: PRIMARY }}
                    >
                        <div className="text-5xl mb-3">🎮</div>

                        <h2 className="text-gray-800 text-xl font-bold mb-2">
                            Verify MLBB Account
                        </h2>

                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            You will be redirected to log in and verify your Mobile Legends account.
                            This step confirms your MLBB profile before submitting your entry.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Link
                                href="/"
                                className="order-2 sm:order-1 px-4 py-2 rounded-xl border text-gray-600 border-gray-300 font-bold"
                            >
                                Cancel
                            </Link>

                            <button
                                onClick={() => {
                                    setShowVerifyModal(false);
                                    mlLoginRef.current?.triggerLogin();
                                }}
                                className="order-1 sm:order-2 px-8 py-2 rounded-xl font-bold text-white shadow-md"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MLLogin ref={mlLoginRef} onLoginInfo={handleLoginInfo} />

            {/* VERIFICATION STATUS MODAL */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[11000]">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl border-t-8" style={{ borderColor: PRIMARY }}>
                        {verificationStatus === "success" ? (
                            <>
                                <div className="text-4xl mb-4 text-green-500">✅</div>
                                <h2 className="text-xl font-bold mb-2 text-black">Account Linked!</h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    We found your account: <br />
                                    <span className="font-bold text-black text-base">{tempMlData?.ign}</span>
                                </p>
                                <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-dashed border-gray-300">
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
                                    className="w-full py-3 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                                    style={{ backgroundColor: PRIMARY }}
                                >
                                    Confirm Account
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl mb-4 text-red-500">❌</div>
                                <h2 className="text-xl font-bold mb-2 text-black">Verification Failed</h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    We couldn&apos;t retrieve your MLBB profile. Please try logging in again.
                                </p>
                                <button
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setShowVerifyModal(true);
                                    }}
                                    className="w-full py-3 rounded-2xl font-bold text-white"
                                    style={{ backgroundColor: PRIMARY }}
                                >
                                    Retry
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function MechanicCard({ num, title, body }) {
    return (
        <div className="relative rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#d71920] text-white text-[10px] sm:text-xs font-black shadow-sm">
                    {num}
                </span>
                <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-1">{title}</h3>
                    <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">{body}</div>
                </div>
            </div>
        </div>
    );
}

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
    verified = false,
    inputMode,
    pattern,
}) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="font-semibold block text-white text-sm sm:text-base">{label}</label>
                {verified && (
                    <span className="text-green-400 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                        Verified Account
                    </span>
                )}
            </div>

            <div className={`flex items-center gap-2 sm:gap-3 border px-4 py-3 rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-white/20 transition-all ${verified ? "border-green-500 bg-green-50" : "border-[#ffd0d2]"}`}>
                <div className={`${verified ? "text-green-500" : "text-[#d71920]"} shrink-0`}>{icon}</div>

                <input
                    type={type}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    readOnly={disabled}
                    inputMode={inputMode}
                    pattern={pattern}
                    className="w-full outline-none text-sm sm:text-base text-black placeholder:text-gray-400 disabled:bg-transparent disabled:cursor-not-allowed bg-transparent"
                />

                {verified && (
                    <div className="text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                )}

                {tooltip && <Tooltip text={tooltip} />}
            </div>

            {error && <p className="text-yellow-300 text-xs mt-1.5 font-bold ml-1">{error}</p>}
        </div>
    );
}