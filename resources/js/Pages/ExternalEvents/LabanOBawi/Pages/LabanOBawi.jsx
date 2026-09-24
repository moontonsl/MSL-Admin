import React, { useState, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import MLLogin from "@/Pages/MLLoginApi/MLLogin";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsLabanOBawi.jsx";
import {
    User,
    School,
    Hash,
    Globe,
    Link2,
} from "lucide-react";

const BG = "/BGSB.png";
const Emote = "/SB%20Girlsm%20emote%20latest.png";

const Tooltip = ({ text }) => (
    <div className="relative group ml-auto">
        <span className="text-[#ff6fa8] cursor-pointer font-bold text-sm">?</span>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white text-black text-xs px-3 py-2 rounded-lg shadow-lg w-56 z-50 border border-[#ff6fa8]">
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
    border: "2px solid #ff6fa8",
    backgroundColor: checked ? "#ff6fa8" : "#ffffff",
    backgroundImage: checked
        ? 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%273 11 8 16 17 5%27/%3E%3C/svg%3E")'
        : "none",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "12px 12px",
    cursor: "pointer",
});

export default function LabanOBawi() {
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
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error'
    const [tempMlData, setTempMlData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verified, setVerified] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(true);
    const [mlbbUid, setMlbbUid] = useState("");
    const [mlbbServer, setMlbbServer] = useState("");
    
    const mlLoginRef = useRef(null);

    const isValidUrl = (value) => /^https?:\/\/\S+/i.test(value);

    const validate = () => {
        const nextErrors = {};

        if (!form.name.trim()) nextErrors.name = "Name is required.";
        if (!form.school.trim()) nextErrors.school = "School is required.";

        if (!String(mlbbUid).trim()) nextErrors.uid = "MLBB UID is required.";
        // else if (!/^\d{7,12}$/.test(mlbbUid))
        //     nextErrors.uid = "UID must be 7-12 digits.";

        if (!String(mlbbServer).trim()) nextErrors.server = "MLBB Server is required.";
        // else if (!/^\d{3,6}$/.test(mlbbServer))
        //     nextErrors.server = "Server must be 3-6 digits.";

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

        // if (name === "uid" || name === "server") {
        //     nextValue = value.replace(/\D/g, "");
        // }

        // if (name === "uid" || name === "server") {
        //     return;
        // }

        setForm((prev) => ({ ...prev, [name]: nextValue }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleLoginInfo = (info) => {
        console.log("MLBB Login Info:", info);
        const data = info.data || info;
        
        if (info && (data.uid || data.roleId)) {
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
            const uidStr = String(tempMlData.uid);
            const serverStr = String(tempMlData.server);
            setMlbbUid(uidStr);
            setMlbbServer(serverStr);
            setForm((prev) => ({ ...prev, uid: uidStr, server: serverStr }));
            setVerified(true);
            setShowVerifyModal(false);
            setShowStatusModal(false);
            setErrors((prev) => ({ ...prev, uid: "", server: "" }));
        }
    };

    const getFormattedDate = () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const d = new Date();
        const month = months[d.getMonth()];
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${month} ${day} ${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validate();

        if (!String(mlbbUid).trim() || !String(mlbbServer).trim()) {
            setShowVerifyModal(true);
            return;
        }

        if (!isValid) return;
        
        setIsSubmitting(true);

        const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/1_WPFJH0F_RBeRoob3kS2OSEY2Gilkq_zMrn0nRHAYfY/formResponse";
        
        const formBody = new FormData();
        formBody.append("entry.1262416561", form.name);
        formBody.append("entry.148736703", form.school);
        formBody.append("entry.1764312379", mlbbUid);
        formBody.append("entry.719871319", mlbbServer);
        formBody.append("entry.1070165291", form.facebookProfileLink);
        formBody.append("entry.1570730642", form.postLink);
        formBody.append("entry.2141797676", "Yes");
        formBody.append("entry.260699065", "Yes");
        formBody.append("entry.532413128", getFormattedDate());

        try {
            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: "POST",
                body: formBody,
                mode: "no-cors",
            });

            setShowModal(true);
        } catch (error) {
            console.error("Error submitting to Google Form:", error);
            alert("There was an error submitting your entry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="LabanOBawi" />
            <Helmet>
                <title>LabanOBawi</title>
            </Helmet>

            <div
                className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 sm:pt-5 font-['Montserrat'] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}
            >
                <img src={Emote} alt="SexBomb emote" className="w-64 sm:w-80 mb-4" />

                <div className="text-black text-center mb-4 text-sm md:text-3xl lg:text-4xl font-bold tracking-normal [text-shadow:_0_0_6px_#fff,_0_0_12px_rgba(255,255,255,.85)]">
                    #LabanOBawi: The Epic Comeback Challenge
                </div>

                <div className="p-8 w-full max-w-3xl rounded-xl border border-[#ff6fa8] shadow-xl bg-white text-black border-solid">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold mb-2">LabanOBawi Submission</h2>

                            <div className="border border-solid border-[#ff6fa8] p-4 rounded-lg bg-gray-50">
                                Please fill out the submission details below.
                            </div>
                        </div>

                        <FormInput
                            icon={<User />}
                            label="Name"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                        />

                        <FormInput
                            icon={<School />}
                            label="School"
                            name="school"
                            placeholder="Enter your school"
                            value={form.school}
                            onChange={handleChange}
                            error={errors.school}
                        />

                        <FormInput
                            verified={verified}
                            icon={<Hash />}
                            label="MLBB UID"
                            name="uid"
                            placeholder="Verified UID"
                            value={mlbbUid}
                            disabled={true}
                            error={errors.uid}
                        />

                        <FormInput
                            verified={verified}
                            icon={<Globe />}
                            label="MLBB Server"
                            name="server"
                            placeholder="Verified server"
                            value={mlbbServer}
                            disabled={true}
                            error={errors.server}
                        />

                        <FormInput
                            icon={<Globe />}
                            label="Facebook Profile Link"
                            name="facebookProfileLink"
                            placeholder="https://facebook.com/yourprofile"
                            value={form.facebookProfileLink}
                            onChange={handleChange}
                            tooltip="Paste your Facebook profile link."
                            error={errors.facebookProfileLink}
                        />

                        <FormInput
                            icon={<Link2 />}
                            label="Post link"
                            name="postLink"
                            placeholder="https://facebook.com/your-post"
                            value={form.postLink}
                            onChange={handleChange}
                            tooltip="Paste the link to your post."
                            error={errors.postLink}
                        />

                        <div className="border p-4 rounded-lg bg-gray-50">
                            <label className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={agreedMechanics}
                                    onChange={() => {
                                        setShowMechanics(true);
                                        setErrors((prev) => ({ ...prev, mechanics: "" }));
                                    }}
                                    style={checkboxStyle(agreedMechanics)}
                                />
                                <span>
                                    By clicking this box, I agree with the game mechanics.
                                    <button
                                        type="button"
                                        className="underline ml-1"
                                        onClick={() => setShowMechanics(true)}
                                    >
                                        View Mechanics
                                    </button>
                                </span>
                            </label>

                            {errors.mechanics && (
                                <p className="text-red-500 text-sm">{errors.mechanics}</p>
                            )}
                        </div>

                        <div className="border p-4 rounded-lg bg-gray-50">
                            <label className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={() => {
                                        setShowTerms(true);
                                        setErrors((prev) => ({ ...prev, consent: "" }));
                                    }}
                                    style={checkboxStyle(agreed)}
                                />
                                <span>
                                    By clicking this box, I agree to the Terms and Conditions.
                                    <button
                                        type="button"
                                        className="underline ml-1"
                                        onClick={() => setShowTerms(true)}
                                    >
                                        View Terms
                                    </button>
                                </span>
                            </label>

                            {errors.consent && (
                                <p className="text-red-500 text-sm">{errors.consent}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff6fa8] hover:bg-[#e85b93]'}`}
                        >
                            {isSubmitting && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            {isSubmitting ? "Submitting..." : "Submit Entry"}
                        </button>
                    </form>
                </div>
            </div>

            {showTerms && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[10000]">
                    <div
                        className="bg-white p-6 rounded-2xl max-w-lg w-full text-black shadow-xl border-2"
                        style={{ borderColor: "#ff6fa8" }}
                    >
                        <h2 className="text-lg font-bold mb-3">Terms and Conditions</h2>

                        <div className="text-sm text-gray-700 space-y-3 max-h-[250px] overflow-y-auto pr-2">
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

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowTerms(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setAgreed(true);
                                    setShowTerms(false);
                                    setErrors((prev) => ({ ...prev, consent: "" }));
                                }}
                                className="px-6 py-2 rounded-lg font-bold text-white"
                                style={{ backgroundColor: "#ff6fa8" }}
                            >
                                I Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMechanics && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 z-[10000]">
                    <div
                        className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white text-black shadow-2xl border border-[#ff6fa8]"
                        style={{ borderColor: "#ff6fa8" }}
                    >
                        <div className="px-6 py-5 border-b border-[#ffd3e6] bg-[#fff0f6]">
                            <p className="text-xs uppercase tracking-[0.25em] text-[#d94f8a] font-semibold">
                                Game Mechanics
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                Laban o Bawi Challenge
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-3xl">
                                A quick guide on what to post and submit.
                            </p>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-7 space-y-5">
                            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff6fa8] text-white text-sm font-bold">
                                            1
                                        </span>
                                        <h3 className="font-semibold text-gray-900">
                                            Create the clip
                                        </h3>
                                    </div>
                                    <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                                        Upload a video on Facebook or TikTok showcasing a
                                        &quot;Bawi&quot; moment, such as a near defeat, wipeout, or
                                        stolen Lord, that transitions into a &quot;LABAN&quot; moment
                                        with an Epic Comeback or Victory.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#ffd3e6] bg-[#fff0f6] p-5">
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                        Official hashtags
                                    </h3>
                                    <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                                        #MSLPhilippines #MSLComebackChallenge #MLBBGetGetAw
                                        #MLBBxSexBomb #MLBBTagArAW #MLBB
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff6fa8] text-white text-sm font-bold">
                                            2
                                        </span>
                                        <h3 className="font-semibold text-gray-900">
                                            Show the emote
                                        </h3>
                                    </div>
                                    <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                                        Make sure the <strong>SexBomb &quot;Laban o Bawi&quot; emote</strong> appears as
                                        the ultimate taunt or celebration in the clip.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff6fa8] text-white text-sm font-bold">
                                            3
                                        </span>
                                        <h3 className="font-semibold text-gray-900">
                                            Submit your entry
                                        </h3>
                                    </div>
                                    <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                                        Post it publicly, copy the link, and submit it here with your
                                        in-game information.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-[#ffd3e6] bg-[#fff0f6] px-6 py-4">
                            <button
                                onClick={() => setShowMechanics(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 bg-white font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setAgreedMechanics(true);
                                    setShowMechanics(false);
                                    setErrors((prev) => ({ ...prev, mechanics: "" }));
                                }}
                                className="px-6 py-2 rounded-lg font-bold text-white transition hover:scale-[1.02]"
                                style={{ backgroundColor: "#ff6fa8" }}
                            >
                                I Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-4">
                    <div
                        className="bg-white rounded-2xl p-8 text-center w-full max-w-md shadow-2xl border-2"
                        style={{ borderColor: "#ff6fa8" }}
                    >
                        <div className="text-5xl mb-3">🎉</div>

                        <h2 className="text-black text-xl font-bold mb-2">
                        Submission Successful!
                        </h2>

                        <p className="text-gray-600 text-sm mb-6">
                            Thank you for submitting your LabanOBawi submission details.
                        </p>

                        <button
                            onClick={() => {
                                setShowModal(false);
                                setForm(initialForm);
                                setAgreed(false);
                                setAgreedMechanics(false);
                                setVerified(false);
                                setMlbbUid("");
                                setMlbbServer("");
                                setShowVerifyModal(true);
                            }}
                            className="px-6 py-3 rounded-lg font-bold text-white transition hover:scale-105"
                            style={{ backgroundColor: "#ff6fa8" }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showVerifyModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[10000]">
                    
                    <div
                        className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border-2"
                        style={{ borderColor: "#ff6fa8" }}
                    >
                        <div className="text-5xl mb-3">🎮</div>

                        <h2 className="text-gray-600 text-xl font-bold mb-2">
                            Verify MLBB Account
                        </h2>

                        <p className="text-gray-600 text-sm mb-6">
                            You will be redirected to log in and verify your Mobile Legends account.
                            This step confirms your MLBB profile before submitting your entry.
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowVerifyModal(false)}
                                className="px-4 py-2 rounded-lg border text-gray-600 border-gray-300 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowVerifyModal(false);
                                    mlLoginRef.current?.triggerLogin();
                                }}
                                className="px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95"
                                style={{ backgroundColor: "#ff6fa8" }}
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
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[11000]">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border-t-8 border-[#ff6fa8]">
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
                                    style={{ backgroundColor: "#ff6fa8" }}
                                >
                                    Confirm Account
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl mb-4 text-red-500">❌</div>
                                <h2 className="text-xl font-bold mb-2 text-black">Verification Failed</h2>
                                <p className="text-gray-600 text-sm mb-6">
                                    We couldn't retrieve your MLBB profile. Please try logging in again.
                                </p>
                                <button 
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setShowVerifyModal(true);
                                    }}
                                    className="w-full py-3 rounded-lg font-bold text-white"
                                    style={{ backgroundColor: "#ff6fa8" }}
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
        <div className="w-full">
            <div className="flex items-center justify-between mb-1">
                <label className="font-semibold block">{label}</label>
                {verified && (
                    <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                         Verified Account
                    </span>
                )}
            </div>

            <div className={`flex items-center gap-3 border border-solid px-4 py-3 rounded-md bg-white transition-all ${verified ? 'border-green-500 bg-green-50' : 'border-[#ff6fa8]'}`}>
                <div className={`${verified ? 'text-green-500' : 'text-[#ff6fa8]'}`}>{icon}</div>

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
                    className="w-full outline-none text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {/* border border-solid */}
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
