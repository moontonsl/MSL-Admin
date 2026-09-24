import React, { useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout.jsx';
import { Head } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import VerificationModal from '@/Components/VerificationModal.jsx';
import MLLoginVoting from '@/Pages/MCC/Voting/Voting Sign In/MLLoginVoting.jsx';
import { Toaster } from 'react-hot-toast';
import { useRef } from 'react';

const HERO_BANNER_SRC = '/images/Awards/Top%20Image.png';
const INDIVIDUAL_BTN_SRC = '/images/Awards/Individual%20Button.png';
const ORG_BTN_SRC = '/images/Awards/Organization%20Button.png';

export default function NetworkAwards() {
  const faqs = useMemo(
    () => [
      {
        id: 'who-can-join',
        q: 'Who can join MSL?',
        a: 'Any student, campus esports organization, or recognized school-based group with a passion for Mobile Legends: Bang Bang and community development can apply.',
      },
      {
        id: 'how-to-join',
        q: 'How can I join MSL as a student?',
        a: 'Create an account, complete your profile, and follow the application flow. Once submitted, your application will go through verification and approval.',
      },
      {
        id: 'benefits',
        q: 'What benefits do MSL Communities receive?',
        a: 'Access to official programs, resources, and support for campus initiatives—plus opportunities to participate in events and recognition programs like Network Awards.',
      },
      {
        id: 'tournament-support',
        q: 'How does MSL support campus tournaments?',
        a: 'MSL provides guidance, coordination support, and tools to help organize campus tournaments, from registration to roster verification and reporting.',
      },
      {
        id: 'partners',
        q: 'Can brands and partners collaborate with MSL?',
        a: 'Yes. Partners can work with MSL for events, initiatives, and campus programs. Reach out through the official contact channels for collaboration proposals.',
      },
    ],
    []
  );

  const [openId, setOpenId] = useState(null);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState(null);
  const mlLoginRef = useRef(null);

  const openVerifyThenGo = (href) => {
    setPendingHref(href);
    setVerifyOpen(true);
  };

  return (
    <MainLayout>
      <Head title="MSL Network Awards" />

      <div className="w-full min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center pb-24">
        {/* Hero Banner */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8 mb-8 md:mb-16">
          <img
            src={HERO_BANNER_SRC}
            alt="MSL Network Awards"
            className="w-full h-auto object-cover rounded-2xl shadow-2xl"
          />
        </div>

        {/* About */}
        <section className="w-full max-w-3xl mx-auto px-4 text-center mb-20">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-heading tracking-tight mb-4 md:mb-6">
            About MSL Network Awards
          </h2>
          <p className="text-gray-300 font-sans leading-relaxed text-sm md:text-base mx-auto">
            The MSL Network Awards is an annual recognition program that celebrates excellence, innovation, and outstanding
            contributions within the MSL community. It honors individuals, teams, and organizations who demonstrate
            commitment, professionalism, and impact in their respective fields—while inspiring continuous improvement,
            collaboration, and excellence across the network.
          </p>
        </section>

        {/* Nomination Cards */}
        <section className="w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-heading tracking-tight text-center mb-6 md:mb-10 px-4">
            MSL Network Awards Nomination
          </h2>

          <div className="w-full max-w-5xl mx-auto px-4 grid grid-cols-2 gap-4 md:gap-8 lg:gap-12 mb-16 md:mb-24">
            <a
              href="/MSLNetworkAwards/Individual"
              className="relative w-full rounded-2xl overflow-hidden block transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50"
              onClick={(e) => {
                e.preventDefault();
                openVerifyThenGo('/MSLNetworkAwards/Individual');
              }}
            >
              <img src={INDIVIDUAL_BTN_SRC} alt="Individual Awards" className="w-full h-auto object-contain" />
            </a>

            <a
              href="/MSLNetworkAwards/Organization"
              className="relative w-full rounded-2xl overflow-hidden block transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50"
              onClick={(e) => {
                e.preventDefault();
                openVerifyThenGo('/MSLNetworkAwards/Organization');
              }}
            >
              <img src={ORG_BTN_SRC} alt="Organization Awards" className="w-full h-auto object-contain" />
            </a>
          </div>
        </section>

        {/* FAQs */}
        <section className="w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-heading tracking-tight text-center mb-6 md:mb-10 px-4">
            Frequently Asked Questions
          </h2>

          <div className="w-full max-w-4xl mx-auto px-4 flex flex-col gap-3">
            {faqs.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-[#111111] border border-neutral-800 rounded-lg overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                    className="w-full flex justify-between items-center p-3 md:p-4 text-left transition-colors"
                  >
                    <span
                      className={`text-sm md:text-base font-medium font-sans ${
                        isOpen ? 'text-[#FFC107]' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FFC107]' : 'text-gray-500'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-3 md:p-4 border-t border-neutral-800">
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <VerificationModal
          isOpen={verifyOpen}
          onCancel={() => {
            setVerifyOpen(false);
            setPendingHref(null);
          }}
          onContinue={() => {
            setVerifyOpen(false);
            if (mlLoginRef.current) {
              mlLoginRef.current.triggerLogin();
            }
          }}
        />

        <MLLoginVoting 
          ref={mlLoginRef} 
          onLoginSuccess={(data) => {
            if (pendingHref) {
              window.location.assign(pendingHref);
            }
          }} 
        />
        <Toaster position="top-center" />
      </div>
    </MainLayout>
  );
}

