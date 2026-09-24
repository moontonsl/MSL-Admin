import React, { useMemo, useState, useEffect, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout.jsx';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { orgAwardsData } from '@/Data/awardsData.js';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import SubmissionSuccessModal from '@/Components/SubmissionSuccessModal.jsx';
import MLLoginVoting from '@/Pages/MCC/Voting/Voting Sign In/MLLoginVoting.jsx';

const HERO_BANNER_SRC = '/images/Awards/Top%20Image.png';
const FORM_GOLD = '#FBBF24';

const LABEL_CLASS = 'block text-sm font-bold text-[#FBBF24] mb-2';
const INPUT_CLASS =
  'w-full bg-[#1A1A1A] border border-[#FBBF24] text-[#FBBF24] placeholder:text-[#FBBF24]/60 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#FBBF24] transition-all';

function TextField({ label, value, onChange, placeholder, type = 'text', readOnly = false }) {
  return (
    <label className={LABEL_CLASS}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${INPUT_CLASS} ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className={LABEL_CLASS}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#1A1A1A] text-[#FBBF24]">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function AwardNominationForm() {
  const { awardId: pageAwardId, prefilledName = '', isNameReadOnly = false, isMlAuthenticated } = usePage().props;
  const awardId = String(pageAwardId || '');
  const currentAward = orgAwardsData[awardId];

  const orgOptions = useMemo(
    () => [
      { value: '', label: 'Select your organization' },
      { value: 'msl-org', label: 'MSL Organization' },
      { value: 'chapter-a', label: 'MSL Chapter A' },
      { value: 'chapter-b', label: 'MSL Chapter B' },
    ],
    []
  );

  const [fullName, setFullName] = useState(prefilledName);
  const [orgName, setOrgName] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const mlLoginRef = useRef(null);

  useEffect(() => {
    if (isMlAuthenticated === false && mlLoginRef.current) {
      mlLoginRef.current.triggerLogin();
    }
  }, [isMlAuthenticated]);

  const isReady = Boolean(fullName.trim() && orgName && reason.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/awards/nominate', {
        award_id: awardId,
        award_type: 'organization',
        nominator_name: fullName,
        nominee_name: orgName,
        reason: reason,
      });

      if (response.data.success) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        if (error.response.data.needs_verification) {
            // Optional: redirect to verification flow or show message
        }
      } else {
        toast.error('Failed to submit nomination. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Head title={`${currentAward?.title || 'Award Nomination'} - MSL Network Awards`} />
      <MLLoginVoting ref={mlLoginRef} onLoginSuccess={() => window.location.reload()} />

      <div className="w-full min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center pb-24">
        <SubmissionSuccessModal
          isOpen={showSuccessModal}
          onYes={() => {
            setShowSuccessModal(false);
            router.visit('/MSLNetworkAwards');
          }}
          onNo={() => {
            setFullName('');
            setOrgName('');
            setReason('');
            setShowSuccessModal(false);
          }}
        />

        {/* Hero Banner */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8 mb-6">
          <img
            src={HERO_BANNER_SRC}
            alt="MSL Network Awards"
            className="w-full h-auto object-cover rounded-2xl shadow-2xl"
          />
        </div>

        {/* Back */}
        <div className="w-full max-w-5xl mx-auto px-4 mb-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#FBBF24] font-bold font-sans hover:-translate-x-1 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white text-center mb-10 md:mb-16 w-full px-4">
          {currentAward?.title || 'Award Nomination'}
        </h1>

        {/* Content */}
        <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-16 md:pb-24">
          {/* Left column */}
          <div className="min-w-0">
            {currentAward?.subtitle && (
              <h2 className="text-xl md:text-2xl font-bold font-heading text-white mb-4">
                {currentAward.subtitle}
              </h2>
            )}

            <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed mb-6">
              {currentAward?.description || 'Award details not found. Please go back and select a valid award.'}
            </p>

            {currentAward?.criteria && currentAward.criteria.length > 0 ? (
              <>
                <h3 className="text-lg md:text-xl font-bold font-heading text-white mb-4 mt-8">
                  Detailed Criteria and Mechanics:
                </h3>
                {currentAward.criteria.map((item, index) => (
                  <p key={index} className="text-gray-300 font-sans text-sm md:text-base mb-3">
                    • {item}
                  </p>
                ))}
              </>
            ) : null}
          </div>

          {/* Right column (form card) */}
          <div className="w-full">
            <div className="bg-[#111111] border border-[#FBBF24] rounded-2xl p-6 md:p-8 shadow-2xl h-fit w-full">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <TextField
                    label="Fullname"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="e.g. Crisostomo Ibarra"
                    readOnly={isNameReadOnly}
                  />

                  <SelectField
                    label="Nominated Organization"
                    value={orgName}
                    onChange={setOrgName}
                    options={orgOptions}
                  />

                  <label className={LABEL_CLASS}>
                    Reason for Nomination
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Insert reason here..."
                      rows={6}
                      className={`${INPUT_CLASS} min-h-[160px] resize-y`}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!isReady || isSubmitting}
                  className={`w-full font-bold font-sans py-3.5 rounded-lg transition-all mt-6 ${
                    isReady && !isSubmitting
                      ? 'bg-[#FBBF24] text-black hover:brightness-110 active:scale-[0.98]'
                      : 'bg-[#333333] text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Toaster position="top-center" />
      </div>
    </MainLayout>
  );
}

