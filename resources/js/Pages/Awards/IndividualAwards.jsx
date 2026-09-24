import React, { useEffect, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout.jsx';
import { Head, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import MLLoginVoting from '@/Pages/MCC/Voting/Voting Sign In/MLLoginVoting.jsx';

const HERO_BANNER_SRC = '/images/Awards/Top%20Image.png';

const individualAwards = [
  {
    id: 'esports-advocate',
    title: 'Esports Advocate of the Year',
    image: '/images/Awards/Indiv%20Award%20Buttons/esports%20advocate.png',
  },
  {
    id: 'student-talent',
    title: 'Student Talent of the Year',
    image: '/images/Awards/Indiv%20Award%20Buttons/student%20talent.png',
  },
  {
    id: 'student-creator',
    title: 'Student Creator of the Year',
    image: '/images/Awards/Indiv%20Award%20Buttons/student%20creator.png',
  },
];

export default function IndividualAwards() {
  const { isMlAuthenticated } = usePage().props;
  const mlLoginRef = useRef(null);

  useEffect(() => {
    if (isMlAuthenticated === false && mlLoginRef.current) {
      mlLoginRef.current.triggerLogin();
    }
  }, [isMlAuthenticated]);

  return (
    <MainLayout>
      <Head title="Student Awards - MSL Network Awards" />
      <MLLoginVoting ref={mlLoginRef} onLoginSuccess={() => window.location.reload()} />

      <div className="w-full min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center pb-24">
        {/* Hero Banner */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8 mb-6 md:mb-8">
          <img
            src={HERO_BANNER_SRC}
            alt="MSL Network Awards"
            className="w-full h-auto object-cover rounded-2xl shadow-2xl"
          />
        </div>

        {/* Back */}
        <div className="w-full max-w-5xl mx-auto px-4 mb-4 md:mb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#FFC107] font-bold font-sans hover:-translate-x-1 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black font-heading tracking-tight text-center mb-8 md:mb-12 px-4">
          MSL Network Student Awards Nomination
        </h1>

        {/* Awards */}
        <div className="w-full max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-3 md:gap-6 lg:gap-8">
          {individualAwards.map((award) => (
            <a
              key={award.id}
              href={`/MSLNetworkAwards/NominateStudent/${award.id}`}
              className="relative w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] max-w-[300px] shrink-0 rounded-xl md:rounded-2xl overflow-hidden block transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFC107]/50"
              aria-label={award.title}
              title={award.title}
            >
              <img src={award.image} alt={award.title} className="w-full h-auto object-contain" />
            </a>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

