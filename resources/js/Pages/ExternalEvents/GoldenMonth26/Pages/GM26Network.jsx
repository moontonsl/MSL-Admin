import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";

import BG from "../Assets/Images/BGGM26NET.png";
import GMLogo from "../Assets/Images/GM26NET.png";
import { User, Mail, School, Hash, Globe } from "lucide-react";
import axios from "axios";

/* ================= TOOLTIP ================= */
const Tooltip = ({ text }) => (
    <div className="relative group ml-auto">
        <span className="text-[#56fbac] cursor-pointer font-bold text-sm">?</span>

        <div
            className="
        absolute right-0 top-1/2 -translate-y-1/2
        hidden group-hover:block
        text-xs px-3 py-2 rounded-lg
        shadow-lg w-56 z-50
        "
            style={{
                backgroundColor: "#4c75f6",
                border: "1px solid #56fbac",
                color: "#ffffff",
            }}
        >
            {text}
        </div>
    </div>
);

export default function GM26Network() {
    const [form, setForm] = useState({
        fullName: "",
        facebookLink: "",
        email: "",
        community: "Network - MSL Network",
        school: "",
        mlbbId: "",
        mlbbServer: "",
        postLink: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    /* ================= VALIDATION ================= */
    const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
    const isValidFacebook = (url) =>
        /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/i.test(url);

    const isValidMlbbId = (id) => /^\d{7,12}$/.test(id);
    const isValidMlbbServer = (s) => /^\d{4,6}$/.test(s);

    const validate = () => {
        const newErrors = {};

        if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";

        if (!form.facebookLink.trim())
            newErrors.facebookLink = "Facebook profile link is required.";
        else if (!isValidFacebook(form.facebookLink))
            newErrors.facebookLink = "Enter a valid Facebook profile link.";

        if (!form.email.trim()) newErrors.email = "Email address is required.";
        else if (!isValidEmail(form.email))
            newErrors.email = "Enter a valid email address.";

        if (!form.school.trim()) newErrors.school = "School is required.";

        if (!form.mlbbId.trim()) newErrors.mlbbId = "MLBB UID is required.";
        else if (!isValidMlbbId(form.mlbbId))
            newErrors.mlbbId = "UID must be 7–12 digits.";

        if (!form.mlbbServer.trim())
            newErrors.mlbbServer = "MLBB Server is required.";
        else if (!isValidMlbbServer(form.mlbbServer))
            newErrors.mlbbServer = "Server must be 4–6 digits.";

        if (!form.postLink.trim())
            newErrors.postLink = "Facebook post link is required.";
        else if (!isValidFacebook(form.postLink))
            newErrors.postLink = "Enter a valid Facebook post link.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "mlbbId") newValue = value.replace(/\D/g, "").slice(0, 12);
        if (name === "mlbbServer") newValue = value.replace(/\D/g, "").slice(0, 6);

        setForm((prev) => ({ ...prev, [name]: newValue }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionMessage("");

        if (!validate()) return;

        try {
            setSubmitting(true);

            const payload = {
                event_name: "GM26Network",
                ...form,
                consent: agreed,
            };

            const response = await axios.post(route("event.registration.store"), payload);

            if (response.data.success) {
                setShowModal(true);
                setForm({
                    fullName: "",
                    facebookLink: "",
                    email: "",
                    community: "Network - MSL Network",
                    school: "",
                    mlbbId: "",
                    mlbbServer: "",
                    postLink: "",
                });
                setAgreed(false);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setSubmissionMessage(err.response.data.message);
            } else {
                setSubmissionMessage("Submission failed. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Golden Month Network Submission" />
            <Helmet>
                <title>GM26 Network Submission</title>
            </Helmet>

            <div
                className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 font-['Montserrat'] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}
            >
                <Link href="/GM26">
                    <img
                        src={GMLogo}
                        alt="Golden Month Logo"
                        className="w-64 sm:w-80 drop-shadow-lg mb-6"
                    />
                </Link>

                {/* ✅ FORM CARD: BG = #4c75f6, BORDER = #56fbac */}
                <div
                    className="p-6 w-full max-w-3xl shadow-2xl border-4 backdrop-blur-md"
                    style={{
                        backgroundColor: "rgba(76, 117, 246, 0.85)", // #4c75f6 w/ opacity
                        borderColor: "#56fbac",
                        boxShadow: "0 0 30px rgba(86, 251, 172, 0.30)",
                    }}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center">
                            <h2 className="font-bold mb-1 text-[20px] sm:text-[26px] lg:text-[32px] text-white">
                                GM26 Network Submission
                            </h2>
                        </div>

                        <FormInput
                            icon={<User className="text-[#56fbac]" />}
                            label="Full Name"
                            name="fullName"
                            value={form.fullName}
                            placeholder="Enter your full name"
                            onChange={handleChange}
                            error={errors.fullName}
                        />

                        <FormInput
                            icon={<Globe className="text-[#56fbac]" />}
                            label="Facebook Profile Link"
                            name="facebookLink"
                            value={form.facebookLink}
                            placeholder="https://facebook.com/yourprofile"
                            onChange={handleChange}
                            error={errors.facebookLink}
                        />

                        <FormInput
                            icon={<Mail className="text-[#56fbac]" />}
                            label="Email Address"
                            name="email"
                            value={form.email}
                            placeholder="Enter your active email address"
                            onChange={handleChange}
                            error={errors.email}
                            tooltip="Use an active email address where we can contact you."
                        />

                        {/* ✅ COMMUNITY (default + not editable) */}
                        <FormInput
                            icon={<Globe className="text-[#56fbac]" />}
                            label="Community"
                            name="community"
                            value={form.community}
                            placeholder=""
                            onChange={() => { }}
                            error={errors.community}
                            readOnly={true}
                            tooltip="This is set by default and cannot be changed."
                        />

                        <FormInput
                            icon={<School className="text-[#56fbac]" />}
                            label="School"
                            name="school"
                            value={form.school}
                            placeholder="Enter your school name"
                            onChange={handleChange}
                            error={errors.school}
                        />

                        <FormInput
                            icon={<Hash className="text-[#56fbac]" />}
                            label="MLBB UID"
                            name="mlbbId"
                            value={form.mlbbId}
                            placeholder="7–12 digits"
                            onChange={handleChange}
                            error={errors.mlbbId}
                            tooltip="Found in your MLBB profile. Example: 123456789"
                        />

                        <FormInput
                            icon={<Globe className="text-[#56fbac]" />}
                            label="MLBB Server ID"
                            name="mlbbServer"
                            value={form.mlbbServer}
                            placeholder="4–6 digits"
                            onChange={handleChange}
                            error={errors.mlbbServer}
                            tooltip="The number in parentheses next to your UID. Example: (3024)"
                        />

                        <FormInput
                            icon={<Globe className="text-[#56fbac]" />}
                            label="Facebook Post Link"
                            name="postLink"
                            value={form.postLink}
                            placeholder="https://facebook.com/yourpostlink"
                            onChange={handleChange}
                            error={errors.postLink}
                            tooltip="Paste the public Facebook post link of your shared event post."
                        />

                        {/* DPA */}
                        <div className="flex items-start gap-3 mt-4 text-sm text-white font-semibold">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-[#56fbac]"
                            />
                            <p>
                                I accept and agree with the{" "}
                                <button
                                    type="button"
                                    onClick={() => setShowTermsModal(true)}
                                    className="underline hover:opacity-90"
                                    style={{ color: "#56fbac" }}
                                >
                                    Terms and Conditions
                                </button>
                                .
                            </p>
                        </div>

                        {submissionMessage && (
                            <p className="text-red-200 text-center text-sm">
                                {submissionMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={!agreed || submitting}
                            className="w-full mt-4 py-3 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-40"
                            style={{
                                backgroundColor: "#56fbac",
                                border: "2px solid #56fbac",
                            }}
                        >
                            {submitting ? "Submitting..." : "REGISTER"}
                        </button>
                    </form>
                </div>

                {/* ✅ SUCCESS MODAL*/}
                {showModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div
                            className="p-8 rounded-2xl text-center w-full max-w-md border-4 backdrop-blur-md"
                            style={{
                                backgroundColor: "rgba(76, 117, 246, 0.90)",
                                borderColor: "#56fbac",
                                boxShadow: "0 0 30px rgba(86, 251, 172, 0.30)",
                                color: "#fff",
                            }}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-3">
                                Submission Submitted Successfully! 🎉
                            </h2>
                            <p className="text-sm text-white/90 mb-6">
                                Thank you! We’ll verify your details soon. ✅
                            </p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 rounded-xl font-bold text-black transition-all duration-300"
                                style={{ backgroundColor: "#56fbac", border: "2px solid #56fbac" }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* ✅ DPA MODAL*/}
                {showTermsModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div
                            className="p-6 sm:p-8 rounded-2xl w-full max-w-lg border-4 backdrop-blur-md"
                            style={{
                                backgroundColor: "rgba(76, 117, 246, 0.90)",
                                borderColor: "#56fbac",
                                boxShadow: "0 0 30px rgba(86, 251, 172, 0.30)",
                                color: "#fff",
                            }}
                        >
                            <h2 className="text-lg sm:text-xl font-bold mb-4">
                                Golden Month Event – Data Privacy Consent 🔒
                            </h2>

                            <div className="text-sm text-white/90 leading-relaxed">
                                By checking this box, I authorize Moonton Student Leaders (MSL)
                                Philippines to collect and process the personal details provided
                                above, specifically my identity, contact information, and MLBB
                                game credentials, solely for the purposes of verifying my
                                registration, managing event logistics, and distributing in-game
                                rewards for the Golden Month Event.
                                <br />
                                <br />
                                I acknowledge that my data will be protected in accordance with
                                the Data Privacy Act of 2012, will not be shared with
                                unauthorized third parties, and that I retain the right to
                                access, correct, or request the deletion of my information at
                                any time.
                            </div>

                            <button
                                onClick={() => setShowTermsModal(false)}
                                className="mt-6 px-6 py-3 rounded-xl font-bold text-black transition-all duration-300 w-full sm:w-auto"
                                style={{ backgroundColor: "#56fbac", border: "2px solid #56fbac" }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
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
    readOnly = false,
}) {
    return (
        <div>
            <label className="block font-semibold mb-1 text-white">{label}</label>

            {/* FULL WHITE FIELD */}
            <div
                className="relative flex items-center gap-3 px-4 py-3 shadow-sm border-2 bg-white"
                style={{ borderColor: "#56fbac" }}
            >
                {/* Icon */}
                <div className="text-[#4c75f6]">{icon}</div>

                {/* Input */}
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    className={
                        "w-full outline-none text-black placeholder:text-gray-400 bg-transparent border-2 " +
                        (readOnly ? "cursor-not-allowed opacity-80" : "")
                    }
                    style={{ borderColor: "#4c75f6" }}
                />

                {/* Tooltip */}
                {tooltip && <Tooltip text={tooltip} />}
            </div>

            {/* Error */}
            {error && <p className="text-red-200 text-sm mt-1">{error}</p>}
        </div>
    );
}

