import React, { useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import MLLogin from "@/Pages/MLLoginApi/MLLogin";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsLabanOBawi.jsx";
import { Globe, Hash, Link2, School, User } from "lucide-react";
import axios from "axios";

const BG = "/images/Naruto/BGNARUTO.png";
const Logo = "/images/Naruto/SPD-logo.png";

const Tooltip = ({ text }) => (
  <div className="relative group ml-auto">
    <span className="text-[#f97316] cursor-pointer font-bold text-sm">?</span>

    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block bg-[#0A0A0A]/95 backdrop-blur-md text-gray-100 text-xs px-3 py-2 rounded-lg shadow-xl w-56 z-50 border border-white/15">
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
  borderRadius: "6px",
  border: checked ? "2px solid #f97316" : "2px solid rgba(255,255,255,0.2)",
  backgroundColor: checked ? "#f97316" : "rgba(255,255,255,0.05)",
  backgroundImage: checked
    ? 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%273 11 8 16 17 5%27/%3E%3C/svg%3E")'
    : "none",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "12px 12px",
  cursor: "pointer",
});

export default function NarutoFanArtChallenge() {
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
    if (!String(mlbbServer).trim()) nextErrors.server = "MLBB Server is required.";

    if (!form.facebookProfileLink.trim())
      nextErrors.facebookProfileLink = "Facebook profile link is required.";
    else if (!isValidUrl(form.facebookProfileLink))
      nextErrors.facebookProfileLink = "Enter a valid Facebook profile link.";

    if (!form.postLink.trim()) nextErrors.postLink = "Post link is required.";
    else if (!isValidUrl(form.postLink))
      nextErrors.postLink = "Enter a valid post link.";

    if (!agreedMechanics) nextErrors.mechanics = "Please agree to the mechanics.";
    if (!agreed) nextErrors.consent = "Please agree to the Terms and Conditions.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLoginInfo = (info) => {
    const data = info?.data || info;

    if (data && (data.uid || data.roleId)) {
      const uid = data.uid || data.roleId;
      const server = data.server_id || data.zoneId;
      const ign = data.nick_name || data.name || "Player";

      setTempMlData({ uid, server, ign });
      setVerificationStatus("success");
      setShowStatusModal(true);
      return;
    }

    setVerificationStatus("error");
    setShowStatusModal(true);
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
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const d = new Date();
    const month = months[d.getMonth()];
    const day = String(d.getDate()).padStart(2, "0");
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

    try {
      const response = await axios.post('/naruto-fan-art/submit', {
        name: form.name,
        school: form.school,
        uid: mlbbUid,
        server: mlbbServer,
        facebookProfileLink: form.facebookProfileLink,
        postLink: form.postLink,
      });

      if (response.data.success) {
        setShowModal(true);
      } else {
        alert("There was an error submitting your entry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting to backend:", error);
      alert("There was an error submitting your entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Naruto Fan Art Challenge" />
      <Helmet>
        <title>Naruto Fan Art Challenge</title>
      </Helmet>

      <div
        className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 sm:pt-5 font-['Montserrat'] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}
      >
        <img
          src={Logo}
          alt="MLBB x Naruto logo"
          className="w-72 sm:w-96 mb-4 select-none pointer-events-none drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
        />

        <div className="text-white text-center mb-5 text-sm md:text-3xl lg:text-4xl font-bold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          Naruto Fan Art Challenge
        </div>

        <div className="bg-[#0A0A0A]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-3xl shadow-2xl text-white">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                Fan Art Submission
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
                Complete the form below. Verify your MLBB account first, then add
                your public post link and profile.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <GlassFormField
                icon={<User />}
                label="Name"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
              />
              <GlassFormField
                icon={<School />}
                label="School"
                name="school"
                placeholder="Enter your school"
                value={form.school}
                onChange={handleChange}
                error={errors.school}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <GlassFormField
                verified={verified}
                icon={<Hash />}
                label="MLBB UID"
                name="uid"
                placeholder="Verified UID"
                value={mlbbUid}
                disabled={true}
                onChange={handleChange}
                error={errors.uid}
              />
              <GlassFormField
                verified={verified}
                icon={<Globe />}
                label="MLBB Server"
                name="server"
                placeholder="Verified server"
                value={mlbbServer}
                disabled={true}
                onChange={handleChange}
                error={errors.server}
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <label
                  htmlFor="naruto-post-link"
                  className="text-sm font-semibold text-gray-200 block"
                >
                  Social Media Post Link (TikTok, Facebook, or Instagram)
                </label>
                <Tooltip text="Paste the full URL to your public post featuring your fan art." />
              </div>
              <div
                className={`group flex items-center gap-3 w-full bg-white/5 border rounded-xl px-4 py-3 transition-all duration-300 focus-within:bg-white/10 focus-within:border-[#F97316] focus-within:ring-1 focus-within:ring-[#F97316] outline-none ${errors.postLink
                    ? "border-red-400/45 ring-1 ring-red-400/30"
                    : "border-white/10"
                  }`}
              >
                <Link2 className="w-5 h-5 shrink-0 text-gray-400 transition-colors duration-300 group-focus-within:text-[#F97316]" />
                <input
                  id="naruto-post-link"
                  name="postLink"
                  value={form.postLink}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full bg-transparent border-0 text-white placeholder:text-gray-500 outline-none focus:ring-0 transition-all duration-300"
                />
              </div>
              {errors.postLink && (
                <p className="text-red-400 text-sm mt-1">{errors.postLink}</p>
              )}
              <div className="mt-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-lg p-3">
                <p className="text-xs text-[#F97316] leading-relaxed">
                  ⚠️ Ensure your post is public and includes these exact hashtags:
                  <br />
                  <span className="font-bold">
                    #MSLPhilippines #MSLFanArtChallege #MLBB #MLBBxNaruto
                    #MLBBNinjaComeback
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <GlassFormField
                icon={<Globe />}
                label="Facebook profile link"
                name="facebookProfileLink"
                placeholder="https://facebook.com/yourprofile"
                value={form.facebookProfileLink}
                onChange={handleChange}
                tooltip="Required for the official entry form — use your Facebook profile URL."
                error={errors.facebookProfileLink}
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
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
                <span className="text-sm text-gray-200 leading-relaxed">
                  By clicking this box, I agree with the mechanics.
                  <button
                    type="button"
                    className="underline ml-1 text-[#F97316] hover:text-amber-300 transition-colors"
                    onClick={() => setShowMechanics(true)}
                  >
                    View Mechanics
                  </button>
                </span>
              </label>

              {errors.mechanics && (
                <p className="text-red-400 text-sm mt-2">{errors.mechanics}</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2">
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
                <span className="text-sm text-gray-200 leading-relaxed">
                  By clicking this box, I agree to the Terms and Conditions.
                  <button
                    type="button"
                    className="underline ml-1 text-[#F97316] hover:text-amber-300 transition-colors"
                    onClick={() => setShowTerms(true)}
                  >
                    View Terms
                  </button>
                </span>
              </label>

              {errors.consent && (
                <p className="text-red-400 text-sm mt-2">{errors.consent}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-bold text-lg py-4 rounded-xl transition-all duration-200 mt-8 flex items-center justify-center gap-2 ${isSubmitting
                  ? "bg-white/10 text-gray-400 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-[#F97316] to-[#EAB308] text-white hover:opacity-90 active:scale-[0.98] shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                }`}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
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
            style={{ borderColor: "#f97316" }}
          >
            <h2 className="text-lg font-bold mb-3">Terms and Conditions</h2>

            <div className="text-sm text-gray-700 space-y-3 max-h-[250px] overflow-y-auto pr-2">
              <p>
                By clicking this box, I hereby grant my free, prior, and informed
                consent to the event organizers to collect, store, and process my
                personal data.
              </p>
              <p>
                The information provided will only be used for event
                registration, participant verification, and coordination related
                to this activity.
              </p>
              <p>
                I understand that my personal data will be handled in accordance
                with the Data Privacy Act of 2012 and the organization&apos;s
                privacy policy.
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
                style={{ backgroundColor: "#f97316" }}
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
            className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white text-black shadow-2xl border border-[#f97316]"
            style={{ borderColor: "#f97316" }}
          >
            <div className="px-6 py-5 border-b border-[#fed7aa] bg-[#fff7ed]">
              <p className="text-xs uppercase tracking-[0.25em] text-[#c2410c] font-semibold">
                Mechanics
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                Naruto Fan Art Challenge
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-3xl">
                A quick guide on what to create, post, and submit.
              </p>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-7 space-y-5">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316] text-white text-sm font-bold">
                      1
                    </span>
                    <h3 className="font-semibold text-gray-900">
                      Create your poster
                    </h3>
                  </div>
                  <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                    Create a poster showcasing your school&apos;s spirit such as a
                    hero in your school uniform or hanging out at your school&apos;s
                    tambayan (canteen, gate, etc.). Creativity is encouraged.
                  </p>
                  <p className="mt-3 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                    You may use digital art (Clip Studio, Procreate, Photoshop)
                    or traditional art (pencil, marker, paint).{" "}
                    <strong>AI entries are prohibited.</strong>
                  </p>
                </div>

                <div className="rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Official hashtags
                  </h3>
                  <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                    #MSLPhilippines #MSLFanArtChallege #MLBB #MLBBxNaruto
                    #MLBBNinjaComeback
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316] text-white text-sm font-bold">
                      2
                    </span>
                    <h3 className="font-semibold text-gray-900">Post publicly</h3>
                  </div>
                  <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                    Upload your poster on TikTok, Facebook, or Instagram and
                    include the hashtags above.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316] text-white text-sm font-bold">
                      3
                    </span>
                    <h3 className="font-semibold text-gray-900">
                      Submit your entry
                    </h3>
                  </div>
                  <p className="text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                    Copy your post link and submit it here, along with your
                    in-game information.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-[#fed7aa] bg-[#fff7ed] px-6 py-4">
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
                style={{ backgroundColor: "#f97316" }}
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
            style={{ borderColor: "#f97316" }}
          >
            <div className="text-5xl mb-3">🎉</div>

            <h2 className="text-black text-xl font-bold mb-2">
              Submission Successful!
            </h2>

            <p className="text-gray-700 mb-6">
              Thank you for submitting your Naruto Fan Art Challenge details.
            </p>

            <button
              className="px-6 py-2 rounded-lg font-bold text-white"
              style={{ backgroundColor: "#f97316" }}
              onClick={() => {
                setShowModal(false);
                setForm(initialForm);
                setErrors({});
                setAgreed(false);
                setAgreedMechanics(false);
                setVerified(false);
                setMlbbUid("");
                setMlbbServer("");
                setShowVerifyModal(true);
              }}
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
            style={{ borderColor: "#f97316" }}
          >
            <div className="text-5xl mb-3">🎮</div>

            <h2 className="text-gray-600 text-xl font-bold mb-2">
              Verify MLBB Account
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              You will be redirected to log in and verify your Mobile Legends
              account. This step confirms your MLBB profile before submitting
              your entry.
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
                style={{ backgroundColor: "#f97316" }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <MLLogin ref={mlLoginRef} onLoginInfo={handleLoginInfo} />

      {showStatusModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[11000]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl border-t-8 border-[#f97316]">
            {verificationStatus === "success" ? (
              <>
                <div className="text-4xl mb-4 text-green-500">✅</div>
                <h2 className="text-xl font-bold mb-2">Account Linked!</h2>
                <p className="text-gray-600 text-sm mb-6">
                  We found your account: <br />
                  <span className="font-bold text-black text-base">
                    {tempMlData?.ign}
                  </span>
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-dashed border-gray-300">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 font-semibold">UID:</span>
                    <span className="font-mono text-black">
                      {tempMlData?.uid}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-semibold">Server:</span>
                    <span className="font-mono text-black">
                      {tempMlData?.server}
                    </span>
                  </div>
                </div>

                <button
                  onClick={confirmVerification}
                  className="w-full py-3 rounded-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: "#f97316" }}
                >
                  Confirm Account
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4 text-red-500">❌</div>
                <h2 className="text-xl font-bold mb-2 text-black">
                  Verification Failed
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  We couldn&apos;t retrieve your MLBB profile. Please try logging
                  in again.
                </p>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setShowVerifyModal(true);
                  }}
                  className="w-full py-3 rounded-lg font-bold text-white"
                  style={{ backgroundColor: "#f97316" }}
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

function GlassFormField({
  icon,
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  tooltip,
  disabled,
  verified,
}) {
  const shellClass = verified
    ? "bg-emerald-500/10 border-emerald-400/35 ring-0"
    : "bg-white/5 border-white/10 focus-within:bg-white/10 focus-within:border-[#F97316] focus-within:ring-1 focus-within:ring-[#F97316]";

  const iconClass = verified
    ? "text-emerald-400"
    : "text-gray-400 transition-colors duration-300 group-focus-within:text-[#F97316]";

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label
          htmlFor={name ? `field-${name}` : undefined}
          className="text-sm font-semibold text-gray-200 block"
        >
          {label}
        </label>
        {tooltip && <Tooltip text={tooltip} />}
      </div>

      <div
        className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 outline-none ${shellClass} ${error && !verified ? "border-red-400/45 ring-1 ring-red-400/30" : ""
          }`}
      >
        {icon && (
          <span
            className={`shrink-0 [&_svg]:w-5 [&_svg]:h-5 ${iconClass}`}
          >
            {icon}
          </span>
        )}
        <input
          id={name ? `field-${name}` : undefined}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent border-0 text-white placeholder:text-gray-500 outline-none focus:ring-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

