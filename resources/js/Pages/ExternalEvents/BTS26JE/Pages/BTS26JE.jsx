import React, { useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout.jsx';
import MLLogin from '@/Pages/MLLoginApi/MLLogin';
import { Globe, Hash, Link2, School, User } from 'lucide-react';

const LOGO_SRC = "/images/All Star/PNG.png";
const PRIMARY = "#FACC15"; // Logo yellow
const SECONDARY_LIGHT = "#5EEAD4"; // Teal accent
const ACCENT_ICON = "#9D174D"; // Burgundy-pink for form icons
const DEEP = "#2D0A1E"; // Logo outline burgundy
const EVENT_TITLE = "Jejemon vs Young Stunna Picture Challenge";
const PRIMARY_HASHTAGS = ['#MLBBALLSTAR', '#MLBBJejemonvsYoungStunna', '#MSLASPictureChallenge'];
const SIDE_HASHTAGS = ['#MLBBJejemon', '#MLBBYoungStunna'];

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const Tooltip = ({ text }) => (
  <div className="relative group ml-auto">
    <span className="text-yellow-200 cursor-pointer font-bold text-sm">?</span>
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:block bg-white text-black text-xs px-3 py-2 rounded-xl shadow-lg w-48 sm:w-56 z-50 border"
      style={{ borderColor: PRIMARY }}
    >
      {text}
    </div>
  </div>
);

const checkboxStyle = (checked) => ({
  appearance: 'none',
  WebkitAppearance: 'none',
  width: '16px',
  height: '16px',
  marginTop: '4px',
  borderRadius: '4px',
  border: `2px solid ${PRIMARY}`,
  backgroundColor: checked ? PRIMARY : '#ffffff',
  backgroundImage: checked
    ? 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%273 11 8 16 17 5%27/%3E%3C/svg%3E")'
    : 'none',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: '12px 12px',
  cursor: 'pointer',
});

function MechanicCard({ num, title, body }) {
  return (
    <div className="relative rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <span
          className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-white text-[10px] sm:text-xs font-black shadow-sm"
          style={{ backgroundColor: PRIMARY }}
        >
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

function GuidelinesSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5 mb-4">
      <h3 className="font-black text-gray-900 text-sm sm:text-base uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );
}

function HashtagBlock() {
  return (
    <div
      className="rounded-2xl p-4 shadow-inner border flex flex-col items-center w-full"
      style={{ backgroundColor: `${DEEP}E6`, borderColor: `${PRIMARY}66` }}
    >
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-yellow-300/90 mb-3 text-center">
        Required Hashtags
      </h3>
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1.5 font-mono text-xs sm:text-sm font-bold text-yellow-300 text-center w-full">
        {PRIMARY_HASHTAGS.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="mt-3 w-full flex flex-col items-center text-center">
        <p className="text-[10px] sm:text-xs text-teal-200/90">Also include one side hashtag:</p>
        <p className="mt-1.5 font-mono text-[10px] sm:text-xs font-bold text-yellow-300 leading-relaxed">
          {SIDE_HASHTAGS[0]}
          <span className="text-teal-200/70 font-sans font-normal mx-1.5">or</span>
          {SIDE_HASHTAGS[1]}
        </p>
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
  type = 'text',
  disabled = false,
  verified = false,
  inputMode,
  pattern,
  ...props
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="font-semibold block text-white text-sm sm:text-base">{label}</label>
        {verified && (
          <span className="text-green-300 text-[10px] sm:text-xs font-bold flex items-center gap-1">
            Verified Account
          </span>
        )}
      </div>

      <div
        className={`flex items-center gap-2 sm:gap-3 border px-4 py-3 rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-white/20 transition-all ${
          verified ? 'border-green-500 bg-green-50' : ''
        }`}
        style={{ borderColor: verified ? undefined : SECONDARY_LIGHT }}
      >
        <div className={`${verified ? 'text-green-500' : ''} shrink-0`} style={{ color: verified ? undefined : ACCENT_ICON }}>
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={disabled}
          inputMode={inputMode}
          pattern={pattern}
          {...props}
          className={`w-full py-1 text-sm sm:text-base outline-none text-black placeholder:text-gray-400 bg-transparent cursor-pointer ${props.className || ''}`}
        />

        {verified && (
          <div className="text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}

        {tooltip && <Tooltip text={tooltip} />}
      </div>

      {error && <p className="text-yellow-200 text-xs mt-1.5 font-bold ml-1">{error}</p>}
    </div>
  );
}

function SuccessModal({ isOpen, onClose, primaryHex }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#151515] rounded-[12px] border-[3px] border-white/5 px-6 py-12 md:px-[50px] md:py-[80px] w-[95%] max-w-[650px] shadow-[0_4px_80px_0_rgba(219,39,119,0.25)] flex flex-col items-center text-center"
        style={{
          boxShadow: `0 4px 80px 0 ${primaryHex}66`,
        }}
      >
        <h2 className="text-3xl md:text-[28px] font-bold text-white mb-7 tracking-wide">
          Successfully Submitted!
        </h2>
        <div className="flex flex-col items-center justify-center gap-1 mb-9 text-[#E5E5E5] text-sm md:text-[15px]">
          <p>Wait for the verification email of MSL events committee.</p>
          <p>Thank you!</p>
        </div>
        <div className="flex flex-row gap-4 md:gap-6 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-[#2D0A1E] font-bold font-sans py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-lg"
            style={{ backgroundColor: primaryHex }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BTS26JE() {
  const initialForm = {
    name: '',
    school: '',
    uid: '',
    server: '',
    facebookProfileLink: '',
    postLink: '',
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [agreedMechanics, setAgreedMechanics] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showMechanics, setShowMechanics] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(true);
  const [mlbbUid, setMlbbUid] = useState('');
  const [mlbbServer, setMlbbServer] = useState('');
  const [verified, setVerified] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [tempMlData, setTempMlData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mlLoginRef = useRef(null);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.school.trim()) nextErrors.school = 'School is required.';

    const uidStr = String(mlbbUid || '');
    if (!uidStr.trim()) nextErrors.uid = 'MLBB UID is required.';
    else if (!/^\d{7,12}$/.test(uidStr)) nextErrors.uid = 'UID must be 7-12 digits.';

    const serverStr = String(mlbbServer || '');
    if (!serverStr.trim()) nextErrors.server = 'MLBB Server is required.';
    else if (!/^\d{3,6}$/.test(serverStr)) nextErrors.server = 'Server must be 3-6 digits.';

    if (!form.facebookProfileLink.trim())
      nextErrors.facebookProfileLink = 'Facebook profile link is required.';
    else if (!isValidUrl(form.facebookProfileLink))
      nextErrors.facebookProfileLink = 'Enter a valid Facebook profile link.';

    if (!form.postLink.trim()) nextErrors.postLink = 'Post link is required.';
    else if (!isValidUrl(form.postLink)) nextErrors.postLink = 'Enter a valid post link.';

    if (!agreedMechanics) nextErrors.mechanics = 'Please agree to the mechanics.';
    if (!agreed) nextErrors.consent = 'Please agree to the Terms and Conditions.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === 'uid' || name === 'server') {
      nextValue = value.replace(/\D/g, '');
    }

    if (name === 'uid') {
      setMlbbUid(nextValue);
      setErrors((prev) => ({ ...prev, uid: '' }));
      return;
    }

    if (name === 'server') {
      setMlbbServer(nextValue);
      setErrors((prev) => ({ ...prev, server: '' }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleLoginInfo = (info) => {
    const data = info?.data || info;

    if (data && (data.uid || data.roleId)) {
      const uid = data.uid || data.roleId;
      const server = data.server_id || data.zoneId;
      const ign = data.nick_name || data.name || 'Player';

      setTempMlData({ uid, server, ign });
      setVerificationStatus('success');
      setShowStatusModal(true);
      return;
    }

    setVerificationStatus('error');
    setShowStatusModal(true);
  };

  const confirmVerification = () => {
    if (tempMlData) {
      setMlbbUid(String(tempMlData.uid));
      setMlbbServer(String(tempMlData.server));
      setVerified(true);
      setShowVerifyModal(false);
      setShowStatusModal(false);
      setErrors((prev) => ({ ...prev, uid: '', server: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) return;

    if (!String(mlbbUid || '').trim() || !String(mlbbServer || '').trim() || !verified) {
      setShowVerifyModal(true);
      return;
    }

    setIsSubmitting(true);

    const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/1jChNDT2EcJivWkq7bYGB1ZcHn4OjfAnryhkXQxgzDas/formResponse';

    const formBody = new FormData();
    formBody.append('entry.2101844537', form.name);
    formBody.append('entry.1073433', form.school);
    formBody.append('entry.820217909', String(mlbbUid));
    formBody.append('entry.981688386', String(mlbbServer));
    formBody.append('entry.2019044726', form.facebookProfileLink);
    formBody.append('entry.20435328', form.postLink);
    formBody.append('entry.2138848412', agreedMechanics ? 'I agree with the game mechanics' : '');
    formBody.append('entry.553940021', agreed ? 'I agree to the terms and conditions' : '');

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        body: formBody,
        mode: 'no-cors',
      });

      setShowModal(true);
    } catch (error) {
      console.error('Error submitting:', error);
      alert('An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Head title={`${EVENT_TITLE} - MLBB All Star`} />

      <div className="w-full min-h-screen text-white bg-gradient-to-b from-[#050208] via-[#2D0A1E] to-[#0f0618] font-sans pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute top-[15%] -right-28 w-[560px] h-[560px] rounded-full bg-teal-400/15 blur-3xl" />
          <div className="absolute bottom-[-160px] left-[20%] w-[640px] h-[640px] rounded-full bg-pink-500/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.10) 0 2px, transparent 3px), radial-gradient(circle at 70% 40%, rgba(255,255,255,0.08) 0 1.5px, transparent 2.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.08) 0 1.5px, transparent 2.5px)',
              backgroundSize: '280px 280px',
            }}
          />
        </div>

        {/* Hero */}
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <img
            src={LOGO_SRC}
            alt={EVENT_TITLE}
            className="w-full max-w-lg sm:max-w-2xl mx-auto drop-shadow-[0_0_40px_rgba(250,204,21,0.3)] pt-8 sm:pt-12 mb-4 sm:mb-6"
          />
        </div>

        {/* Submission Form */}
        <div className="relative z-10 px-4">
          <div
            className="w-[95%] sm:w-full max-w-3xl mx-auto mt-4 sm:mt-8 backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl relative z-10"
            style={{ backgroundColor: `${DEEP}B3`, borderColor: `${PRIMARY}4D` }}
            id="submission-form"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-2 flex flex-col items-center">
                <h2 className="text-lg sm:text-xl font-bold mb-2">Picture Challenge Submission</h2>
                <p className="text-[#fce7f3] text-xs sm:text-sm text-center">
                  Submit your post link and in-game information at /AS26PC after uploading on social media.
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

              <div onClick={() => !verified && setShowVerifyModal(true)} className="cursor-pointer">
                <FormInput
                  icon={<Hash size={20} />}
                  label="MLBB UID"
                  name="uid"
                  placeholder={verified ? "MLBB UID" : "Click to Verify MLBB Account"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={mlbbUid}
                  onChange={handleChange}
                  verified={verified}
                  error={errors.uid}
                  disabled={!verified}
                  className={!verified ? "pointer-events-none" : ""}
                />
              </div>

              <div onClick={() => !verified && setShowVerifyModal(true)} className="cursor-pointer">
                <FormInput
                  icon={<Globe size={20} />}
                  label="MLBB Server"
                  name="server"
                  placeholder={verified ? "MLBB Server" : "Click to Verify MLBB Account"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={mlbbServer}
                  onChange={handleChange}
                  verified={verified}
                  error={errors.server}
                  disabled={!verified}
                  className={!verified ? "pointer-events-none" : ""}
                />
              </div>

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
                label="Post Link"
                name="postLink"
                placeholder="https://tiktok.com/... or facebook.com/... or instagram.com/..."
                value={form.postLink}
                onChange={handleChange}
                tooltip="Paste the link to your post."
                error={errors.postLink}
              />

              <HashtagBlock />

              <div className="border p-4 rounded-2xl bg-white" style={{ borderColor: SECONDARY_LIGHT }}>
                <label className="flex items-start gap-3 text-black">
                  <input
                    type="checkbox"
                    checked={agreedMechanics}
                    onChange={() => {
                      setShowMechanics(true);
                      setErrors((prev) => ({ ...prev, mechanics: '' }));
                    }}
                    className="shrink-0 mt-1"
                    style={checkboxStyle(agreedMechanics)}
                  />
                  <span className="text-xs sm:text-sm leading-relaxed">
                    By clicking this box, I agree with the game mechanics.{` `}
                    <button
                      type="button"
                      onClick={() => setShowMechanics(true)}
                      className="font-bold underline"
                      style={{ color: ACCENT_ICON }}
                    >
                      View Mechanics
                    </button>
                  </span>
                </label>
                {errors.mechanics && (
                  <p className="text-[#facc15] text-[10px] mt-1.5 font-bold ml-1">{errors.mechanics}</p>
                )}
              </div>

              <div className="border p-4 rounded-2xl bg-white" style={{ borderColor: SECONDARY_LIGHT }}>
                <label className="flex items-start gap-3 text-black">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => {
                      setShowTerms(true);
                      setErrors((prev) => ({ ...prev, consent: '' }));
                    }}
                    className="shrink-0 mt-1"
                    style={checkboxStyle(agreed)}
                  />
                  <span className="text-xs sm:text-sm leading-relaxed">
                    By clicking this box, I agree to the Terms and Conditions.{` `}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="font-bold underline"
                      style={{ color: ACCENT_ICON }}
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
                disabled={isSubmitting || !mlbbUid}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                  isSubmitting || !mlbbUid
                    ? "bg-white/20 text-white/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#FACC15] to-[#F59E0B] text-[#2D0A1E] shadow-lg hover:shadow-yellow-500/40 hover:-translate-y-1 active:scale-[0.98] active:translate-y-0"
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Entry'}
              </button>
            </form>
          </div>
        </div>

        {/* Terms Modal */}
        {showTerms && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[10000]">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full text-black shadow-xl border-2" style={{ borderColor: PRIMARY }}>
              <h2 className="text-lg font-bold mb-3">Terms and Conditions</h2>
              <div className="text-sm text-gray-700 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                <p>
                  By clicking this box, I hereby grant my free, prior, and informed consent to the event organizers to
                  collect, store, and process my personal data.
                </p>
                <p>
                  The information provided will only be used for event registration, participant verification, and
                  coordination related to this activity.
                </p>
                <p>
                  I understand that my personal data will be handled in accordance with the Data Privacy Act of 2012 and
                  the organization&apos;s privacy policy.
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
                    setErrors((prev) => ({ ...prev, consent: '' }));
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

        {/* Mechanics Modal */}
        {showMechanics && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[10000]">
            <div className="w-[95%] sm:w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl bg-white text-black shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh]">
              <div className="px-6 py-6 bg-white border-b border-gray-100 flex flex-col items-center text-center relative">
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2" style={{ backgroundColor: `${PRIMARY}22`, color: DEEP }}>
                  Event Guidelines
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  {EVENT_TITLE}
                </h2>
              </div>

              <div className="overflow-y-auto p-4 sm:p-6 flex-1">
                <GuidelinesSection title="I. Objectives">
                  <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    <li>Showcase the creativity of students and community members.</li>
                    <li>Participate in the All Star Campaign of Mobile Legends: Bang Bang.</li>
                    <li>Gather outstanding outputs for posting on official pages.</li>
                  </ul>
                </GuidelinesSection>

                <h3 className="font-black text-gray-900 text-sm sm:text-base uppercase tracking-wide mb-3">
                  II. Mechanics
                </h3>
                <div className="grid gap-4 mb-4">
                  <MechanicCard
                    num="1"
                    title="Capture Your Entry"
                    body="Capture a photo inspired by 2010s &quot;Jeje&quot; culture (classic 45° selfie angle, school uniform aesthetics, side bangs, and playful Jejemon-style text) or today&apos;s Gen Z &quot;Young Stunna&quot; aesthetic (sunglasses with silver accessories, or hybeast fashion) while playing MLBB. Creativity is highly encouraged — bring back the vibe in your own unique way."
                  />
                  <MechanicCard
                    num="2"
                    title="Editing Rules"
                    body="You may use filters. However, AI-generated entries are strictly prohibited."
                  />
                  <MechanicCard
                    num="3"
                    title="Upload on Social Media"
                    body="Upload your entry as a poster on TikTok, Facebook, or Instagram using the official hashtags below, plus #MLBBJejemon (Jejemon side) or #MLBBYoungStunna (Young Stunna side)."
                  />
                  <MechanicCard
                    num="4"
                    title="Submit Your Entry"
                    body="Finally, submit your post link at /AS26PC, along with your in-game information."
                  />
                </div>

                <GuidelinesSection title="III. Criteria">
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    <li className="flex justify-between gap-4">
                      <span>Creativity and Originality</span>
                      <span className="font-bold text-gray-900 shrink-0">30%</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>Relevance to Theme</span>
                      <span className="font-bold text-gray-900 shrink-0">30%</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>Social Media Engagement</span>
                      <span className="font-bold text-gray-900 shrink-0">20%</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>Artistic Quality &amp; Presentation</span>
                      <span className="font-bold text-gray-900 shrink-0">20%</span>
                    </li>
                  </ul>
                </GuidelinesSection>

                <div className="mt-4">
                  <HashtagBlock />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-4 sm:p-6 bg-white border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setShowMechanics(false)}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setAgreedMechanics(true);
                    setShowMechanics(false);
                    setErrors((prev) => ({ ...prev, mechanics: '' }));
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Accept & Continue
                </button>
              </div>
            </div>
          </div>
        )}

        <SuccessModal
          isOpen={showModal}
          primaryHex={PRIMARY}
          onClose={() => {
            setShowModal(false);
            setForm(initialForm);
            setErrors({});
            setAgreed(false);
            setAgreedMechanics(false);
            setMlbbUid('');
            setMlbbServer('');
            setVerified(false);
            setShowVerifyModal(true);
          }}
        />

        {/* Verify Modal */}
        {showVerifyModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[10000]">
            <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md text-center shadow-2xl border-2" style={{ borderColor: PRIMARY }}>
              <div className="text-5xl mb-3">🎮</div>
              <h2 className="text-gray-800 text-xl font-bold mb-2">Verify MLBB Account</h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                You will be redirected to log in and verify your Mobile Legends account. This step confirms your MLBB profile
                before submitting your entry.
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

        {showStatusModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[11000]">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl border-t-8" style={{ borderColor: PRIMARY }}>
              {verificationStatus === 'success' ? (
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
      </div>
    </MainLayout>
  );
}

