import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutBuffsAndSupport.jsx";
import { Helmet } from "react-helmet";
import frameImg from "./Assets/Frame437.png";
import frameImgFooter from "./Assets/Frame437Footer.png";
import { CalendarX, Users, HandCoins, Goal, Handshake, Sparkles, X, Send } from "lucide-react";
import Toast from "@/Components/Toast";

const MSLNetwork = () => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedRegionEmail, setSelectedRegionEmail] = useState("");
  const [emailForm, setEmailForm] = useState({
    to: "",
    ccEmails: [],
    subject: "Intent to Partner with MSL Philippines",
    message: ""
  });
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

  const regionEmails = {
    "msl.partnerships.ncluz@gmail.com": "North/Central Luzon",
    "msl.partnerships.ncr@gmail.com": "NCR",
    "msl.partnerships.sluz@gmail.com": "South Luzon",
    "msl.partnerships.vis@gmail.com": "Visayas",
    "msl.partnerships.min@gmail.com": "Mindanao"
  };

  const handleRegionSelect = (email) => {
    setSelectedRegionEmail(email);
    setEmailForm(prev => ({
      ...prev,
      to: "msl.partnerships.ph@gmail.com",
      ccEmails: [
        "msl.network.ph@gmail.com",
        email
      ]
    }));
  };

  const handleEmailFormChange = (field, value) => {
    setEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const closeToast = () => {
    setToast({ isVisible: false, message: "", type: "success" });
  };


  const handleSendEmail = () => {
    // Validate required fields
    if (!emailForm.to || !emailForm.subject || !emailForm.message.trim()) {
      showToast('Please fill in all required fields (To, Subject, and Message).', 'error');
      return;
    }

    // Build Gmail compose URL
    const to = emailForm.to;
    const cc = emailForm.ccEmails.filter(email => email.trim() !== '').join(',');
    const subject = emailForm.subject;
    const body = emailForm.message;

    // Construct Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}${cc ? `&cc=${encodeURIComponent(cc)}` : ''}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open Gmail compose in new window
    window.open(gmailUrl, '_blank');

    // Show success message
    showToast('Opening Gmail compose window. Please send the email from there.', 'success');
    
    // Reset form and close modal after a short delay
    setTimeout(() => {
      setEmailForm({ to: "", ccEmails: [], subject: "Intent to Partner with MSL Philippines", message: "" });
      setSelectedRegionEmail("");
      setIsEmailModalOpen(false);
    }, 1000);
  };

  const handleCopyEmailDetails = () => {
    const emailDetails = `To: ${emailForm.to || selectedRegionEmail}
CC: ${emailForm.ccEmails.length ? emailForm.ccEmails.join(', ') : 'None'}
Subject: ${emailForm.subject}
Message: ${emailForm.message}`;

    navigator.clipboard.writeText(emailDetails).then(() => {
      alert('Email details copied to clipboard! You can now paste them into your email client.');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = emailDetails;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Email details copied to clipboard! You can now paste them into your email client.');
    });
  };

  const openEmailModal = () => {
    if (!selectedRegionEmail) {
      alert("Please select a region first");
      return;
    }
    setIsEmailModalOpen(true);
  };

  return (
    <>
      <Head title="MSL Network" />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <AuthenticatedLayout>
      {/* --- MSL Network Header --- */}
      <div className="w-full bg-gradient-to-r from-[#F2C21A] to-[#CA8B04] text-black font-['Montserrat']">
        <div className="grid md:grid-cols-2 gap-0 items-stretch min-h-[250px] md:min-h-[320px] lg:min-h-[380px] relative">
          
          {/* LEFT SIDE (Content) */}
          <div className="flex flex-col justify-center items-center text-center px-6 py-8 md:px-8 md:py-12 relative z-10">
            
            {/* TITLE */}
            <h1 className="font-bold mb-2 
              text-[24px] sm:text-[32px] lg:text-[40px] leading-tight">
              The MSL Network
            </h1>
            
            {/* HEADER */}
            <h2 className="font-bold mb-4 
              text-[20px] sm:text-[24px] lg:text-[30px] leading-tight">
              Fueling Your Next Win
            </h2>
            
            {/* BODY */}
            <p className="font-medium mb-6 
              text-[12px] sm:text-[16px] lg:text-[16px] max-w-xl">
              The MSL Network is a nationwide community of collegiate esports
              organizations powered by MSL Philippines.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-row gap-3 justify-center">
              <a
                href="#apply-section"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("apply-section")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-black text-[#F3C718] font-bold rounded-xl text-sm sm:text-base"
              >
                APPLY NOW
              </a>

              <a
                href="https://discord.com/invite/themslnetwork"
                className="px-4 py-2 md:px-6 md:py-3 border border-black text-black font-bold rounded-xl text-[12px] sm:text-[14px] lg:text-[16px]"
              >
                JOIN DISCORD SERVER →
              </a>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE (hidden on mobile) */}
          <div className="hidden md:block w-full h-full">
            <img
              src={frameImg}
              alt="MSL Network Visual"
              className="w-full h-full object-cover"
            />
          </div>

          {/* MOBILE BACKGROUND IMAGE + OVERLAY */}
          <div className="absolute inset-0 md:hidden">
            <img
              src={frameImg}
              alt="MSL Network Visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F2C21A]/90 to-[#CA8B04]/90"></div>
          </div>
        </div>
      </div>
      {/* --- MSL Network Header --- */}

      {/* Be part of the MSL Network */}
      <div className="max-w-6xl mx-auto px-3 py-3 md:py-6 font-['Montserrat']">
        <section className="bg-black/60 rounded-[16px] p-3 sm:p-6 hover:bg-black/70 transition-colors">
          
          {/* HEADER */}
          <h2 className="font-bold mb-2 text-[16px] sm:text-[24px] lg:text-[30px] text-center leading-snug max-w-xs mx-auto sm:max-w-none">
            Why Your Organization Should Be 
            <br className="sm:block hidden" />
            Part of The MSL Network
          </h2>
          <p className="font-medium mb-4 text-[11px] sm:text-[16px] text-center leading-snug max-w-full mx-auto whitespace-normal lg:whitespace-nowrap">
            Joining us unlocks growth, recognition, and exclusive opportunities for your campus org.
          </p>

          {/* GRID CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            
            {/* Event Activations */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <CalendarX className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Event Activations
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Take part in campus and nationwide tournaments that bring student communities to life.
                </p>
              </div>
            </div>

            {/* Creative Growth Space */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <Goal className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Creative Growth Space
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Access tools, assets, and mentorship to level up your org’s content and branding.
                </p>
              </div>
            </div>

            {/* Sponsorship and Rewards */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <HandCoins className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Sponsorship and Rewards
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Unlock funding, perks, and support through our Buffs & Support program.
                </p>
              </div>
            </div>

            {/* Exclusive Opportunities */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <Handshake className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Exclusive Opportunities
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Be first in line for MLBB campaigns, brand partnerships, and national esports initiatives.
                </p>
              </div>
            </div>

            {/* Visibility and Exposure */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <Users className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Visibility and Exposure
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Get featured on MSL platforms and connect with audiences across the country.
                </p>
              </div>
            </div>

            {/* Path to Pro */}
            <div className="flex items-start gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-6 hover:bg-white/10 transition-colors group">
              <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-[#F2C21A] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h3 className="font-bold text-[14px] sm:text-[22px] lg:text-[26px] mb-1 sm:mb-2">
                  Path to Pro
                </h3>
                <p className="font-medium text-gray-400 text-[11px] sm:text-[16px] leading-snug">
                  Build experience, connections, and credibility that open doors to the esports industry.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Be part of the MSL Network */}


      {/* --- Apply part of The MSL Network --- */}
      <div className="bg-gradient-to-r from-[#F2C21A] to-[#CA8B04] text-black font-['Montserrat']">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center text-center md:text-left py-4 md:py-10">
          
          {/* LEFT SIDE - TEXT */}
          <div className="flex flex-col justify-center items-center md:items-start space-y-1 md:space-y-3">
            <h1 className="font-bold text-[20px] sm:text-[28px] lg:text-[36px] leading-tight whitespace-nowrap">
              Already part of The MSL Network?
            </h1>
            <p className="font-medium text-[12px] sm:text-[16px] lg:text-[16px] max-w-sm sm:max-w-lg">
              Learn how to access <span className="font-bold">Buffs & Support </span>, our exclusive sponsorship
              program for partnered orgs.
            </p>
          </div>

          {/* RIGHT SIDE - BUTTONS */}
          <div className="w-full flex justify-center items-center mt-0">
            <div className="flex flex-row flex-nowrap gap-2 sm:gap-3">
              <a
                href="/MSLBuffsAndSupportApplicationForm"
                className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-black text-[#F3C718] font-bold rounded-xl text-sm sm:text-base"
              >
                APPLY NOW
              </a>
              <a
                href="https://docs.google.com/document/d/1Nn3yrCn3qAMdxmEz9Tvo4xACrUIv1pukZ9tJVA1p7ak/edit?tab=t.0"
                className="px-3 py-1.5 sm:px-5 sm:py-2.5 border border-black text-black font-bold rounded-xl text-sm sm:text-base"
              >
                LEARN MORE →
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* --- Apply part of The MSL Network --- */}

      {/* --- Partnership Tiers --- */}
      <div className="max-w-sm sm:max-w-7xl mx-auto px-3 sm:px-6 py-0 space-y-6 font-['Montserrat'] mt-5">
        <section className="flex flex-col items-center rounded-[20px] p-2 sm:p-4 w-full">
          
          {/* HEADER */}
          <h2 className="font-bold mb-2 sm:mb-3 text-[14px] sm:text-[24px] lg:text-[30px] text-center leading-snug">
            Partnership Tiers
          </h2>
          <label className="font-medium mb-4 sm:mb-6 text-[10px] sm:text-[16px] lg:text-[16px] text-center w-full leading-snug">
            Every org has a place in The MSL Network — tiers recognize your progress, impact, and consistency.
          </label>

          {/* --- PERKS --- */}
          <h3 className="font-bold text-[16px] sm:text-[22px] lg:text-[28px] text-[#F2C21A] mb-3 self-start">
            Perks
          </h3>

          <div className="flex flex-row w-full gap-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
            {/* LEFT COLUMN */}
            <div className="flex flex-col w-[10%] sm:w-[30%] min-w-[80px] sm:min-w-[120px] gap-0 sm:gap-4 bg-black/60 rounded-lg">
            {[
              "Tiers",
              "Diamond Allocation (per sem)",
              <>Monetary<br />Sponsorship</>,
              <>Sponsorships &<br />Rewards</>,
              <>Event Activations<br/>(Game Campaigns)</>,
              <>Creative Growth<br/>Space</>,
              <>Exclusive<br/>Opportunities</>
            ].map((perk, idx) => (
              <p
                key={idx}
                className={`font-bold text-[8px] sm:text-[16px] lg:text-[20px] 
                            leading-snug text-center flex items-center justify-center px-1 sm:px-2
                            h-[30px] sm:h-[60px] ${idx === 0 ? "text-yellow-400" : "text-white"}`}
                style={{ minHeight: "40px" }}
              >
                {perk}
              </p>
            ))}
          </div>

            {/* TIERS */}
            {[
              { name: "C", values: ["50,000", "-", "Diamonds + TL", "Low Priority", "-", "Low Priority"] },
              { name: "B", values: ["70,000", "-", "Diamonds + TL + Merch", "Moderate Priority", "Basic Access", "Moderate Priority"] },
              { name: "A", values: ["100,000", "YES", "Diamonds + TL + Merch + Monetary", "High Priority", "Full Access", "High Priority"] },
              { name: "Super School", values: ["150,000", "YES", "All + First Priority Allocations", "First Priority", "Full Access", "First Priority"] }
            ].map((tier, idx) => (
              <div
                key={idx}
                className="flex flex-col w-[1%] sm:w-[20%] min-w-[80px] sm:min-w-[100px] 
                          gap-0 sm:gap-4 p-1 sm:p-4 bg-gray-400/20 rounded-lg"
              >
                <h4
                  className="text-[#F3C718] font-bold text-[8px] sm:text-[20px] 
                            leading-snug text-center flex items-center justify-center
                            h-[20px] sm:h-[50px]"
                  style={{ minHeight: "30px" }}
                >
                  {tier.name}
                </h4>
                {tier.values.map((val, i) => (
                  <p
                    key={i}
                    className="text-white font-bold text-[8px] sm:text-[16px] lg:text-[20px] 
                              leading-snug text-center flex items-center justify-center
                              h-[30px] sm:h-[60px]"
                    style={{ minHeight: "40px" }}
                  >
                    {val}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* --- REQUIREMENTS --- */}
          <h3 className="font-bold text-[16px] sm:text-[22px] lg:text-[28px] text-[#F2C21A] mt-6 mb-3 self-start">
            Requirements
          </h3>
          <div className="flex flex-row w-full gap-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
            <div className="flex flex-col w-[10%] sm:w-[30%] min-w-[80px] sm:min-w-[120px] gap-0 sm:gap-4 bg-black/60 rounded-lg">
              {[
                "Tiers",
                <>OSA-Accredited<br/>Organization</>,
                <>Endorsement of Org<br/>Adviser/Moderator</>,
                <>Accomplished<br/>Application Form</>,
                <>Signed MOU with<br/>MSL Philippines</>
              ].map((perk, idx) => (
                <p
                  key={idx}
                  className={`font-bold text-[7px] sm:text-[16px] lg:text-[20px] text-center flex items-center justify-center ${
                    idx === 0 ? "text-[#F2C21A]" : "text-white"
                  } h-[30px] sm:h-[70px]`}
                  style={{ minHeight: "40px" }}
                >
                  {perk}
                </p>
              ))}
            </div>
            {[
              { name: "C", values: ["-", "-", "YES", "YES"] },
              { name: "B", values: ["-", "-", "YES", "YES"] },
              { name: "A", values: ["YES", "YES", "YES", "YES"] },
              { name: "Super School", values: ["YES", "YES", "YES", <>Moonton &<br/>School Admin</>] }
            ].map((tier, idx) => (
              <div key={idx} className="flex flex-col w-[1%] sm:w-[20%] min-w-[80px] sm:min-w-[100px] gap-0 sm:gap-4 p-1 sm:p-4 bg-gray-400/20 rounded-lg">
                <h4
                  className="text-[#F3C718] font-bold text-[8px] sm:text-[20px] leading-snug text-center flex items-center justify-center h-[20px] sm:h-[55px]"
                  style={{ minHeight: "30px" }}
                >
                  {tier.name}
                </h4>
                {tier.values.map((val, i) => (
                  <p
                    key={i}
                    className="text-white font-bold text-[8px] sm:text-[16px] lg:text-[20px] text-center flex items-center justify-center h-[30px] sm:h-[70px]"
                    style={{ minHeight: "40px" }}
                  >
                    {val}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* --- COMMUNITY REQUIREMENTS --- */}
          <h3 className="font-bold text-[16px] sm:text-[22px] lg:text-[28px] text-[#F2C21A] mt-6 mb-2 self-start">
            Community Requirements
          </h3>
          <p className="font-medium mb-4 text-[12px] sm:text-[16px] lg:text-[16px] w-full self-start">
            Community Requirements are waived for Super School partners
          </p>
          <div className="flex flex-row w-full gap-2 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
            <div className="flex flex-col w-[10%] sm:w-[30%] min-w-[80px] sm:min-w-[120px] gap-0 sm:gap-4 bg-black/60 rounded-lg">
              {[
                "Tiers",
                <>Turnouts in 2<br/>Consecutive MSL<br/>Tournaments</>,
                <>Members in MSL<br/>Community</>,
                <>Community<br/>Participation in<br/>Events</>
              ].map((perk, idx) => (
                <p
                  key={idx}
                  className={`font-bold text-[7px] sm:text-[16px] lg:text-[17px] text-center flex items-center justify-center ${
                    idx === 0 ? "text-[#F2C21A]" : "text-white"
                  } h-[30px] sm:h-[70px]`}
                  style={{ minHeight: "40px" }}
                >
                  {perk}
                </p>
              ))}
            </div>
            {[
              { name: "C", values: ["8 - 15 Teams", "< 100", "≤ 5%"] },
              { name: "B", values: ["16 - 31 Teams", "100 - 250", "5% - 15%"] },
              { name: "A", values: ["≥ 24 Teams", "≥ 250", "> 15%"] },
              { name: "Super School", values: ["N/A", "N/A", "N/A"] }
            ].map((tier, idx) => (
              <div key={idx} className="flex flex-col w-[1%] sm:w-[20%] min-w-[80px] sm:min-w-[100px] gap-0 sm:gap-4 p-1 sm:p-4 bg-gray-400/20 rounded-lg">
                <h4
                  className="text-[#F3C718] font-bold text-[8px] sm:text-[20px] leading-snug text-center flex items-center justify-center h-[20px] sm:h-[55px]"
                  style={{ minHeight: "30px" }}
                >
                  {tier.name}
                </h4>
                {tier.values.map((val, i) => (
                  <p
                    key={i}
                    className="text-white font-bold text-[8px] sm:text-[16px] lg:text-[20px] text-center flex items-center justify-center h-[30px] sm:h-[70px]"
                    style={{ minHeight: "40px" }}
                  >
                    {val}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* --- Partnership Tiers --- */}

      {/* --- MSL Network Footer --- */}
      <div id="apply-section" className="w-full bg-gradient-to-r from-[#F2C21A] to-[#CA8B04] text-black font-['Montserrat'] mt-8">
        
        {/* MOBILE (same style as header) */}
        <div className="relative md:hidden min-h-[250px] flex flex-col justify-center items-center text-center px-6 py-8">
          
          {/* Background image */}
          <img
            src={frameImgFooter}
            alt="MSL Network Visual"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F2C21A]/90 to-[#CA8B04]/90"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center w-full max-w-md">
            
            {/* TITLE */}
            <h1 className="font-bold mb-2 text-[20px] sm:text-[24px] leading-tight whitespace-nowrap">
              Join the MSL Network Today
            </h1>

            {/* BODY */}
            <p className="font-medium mb-6 text-[12px] max-w-sm">
              Becoming a member is quick and easy — just send us an email to get started.
            </p>

            {/* DROPDOWN + BUTTON */}
            <div className="flex flex-col gap-3 w-full px-4">
              <select
                className="px-4 py-2 bg-black text-[#F3C718] font-bold rounded-xl text-[12px] text-center"
                value={selectedRegionEmail}
                onChange={(e) => handleRegionSelect(e.target.value)}
              >
                <option value="" disabled>
                  SELECT YOUR REGION
                </option>
                <option value="msl.partnerships.ncluz@gmail.com">
                  North/Central Luzon
                </option>
                <option value="msl.partnerships.ncr@gmail.com">
                  NCR
                </option>
                <option value="msl.partnerships.sluz@gmail.com">
                  South Luzon
                </option>
                <option value="msl.partnerships.vis@gmail.com">
                  Visayas
                </option>
                <option value="msl.partnerships.min@gmail.com">
                  Mindanao
                </option>
              </select>

              <button
                onClick={openEmailModal}
                className={`px-4 py-2 bg-black text-[#F3C718] font-bold rounded-xl text-[12px] text-center transition ${
                  selectedRegionEmail 
                    ? "opacity-100 cursor-pointer hover:bg-gray-800" 
                    : "pointer-events-none opacity-50"
                }`}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>


        {/* DESKTOP (unchanged) */}
        <div className="hidden md:grid md:grid-cols-2 gap-0 items-stretch min-h-[350px]">
          {/* LEFT SIDE IMAGE */}
          <div className="w-full h-full">
            <img
              src={frameImgFooter}
              alt="MSL Network Visual"
              className="w-full h-full object-cover"
            />
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="flex flex-col justify-center px-8 py-12">
            <h1 className="font-bold mb-4 text-[20px] sm:text-[28px] lg:text-[36px] leading-tight">
              Join the MSL Network Today
            </h1>
            <p className="font-medium mb-6 text-[12px] sm:text-[16px] lg:text-[16px]">
              Becoming a member is quick and easy — just send us an email to get started.
            </p>
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {/* Dropdown */}
              <select
                className="px-6 py-3 bg-black text-[#F3C718] font-bold rounded-xl"
                value={selectedRegionEmail}
                onChange={(e) => handleRegionSelect(e.target.value)}
              >
                <option value="" disabled className="text-center">
                  SELECT YOUR REGION
                </option>
                <option value="msl.partnerships.ncluz@gmail.com">
                  North/Central Luzon — msl.partnerships.ncluz@gmail.com
                </option>
                <option value="msl.partnerships.ncr@gmail.com">
                  National Capital Region — msl.partnerships.ncr@gmail.com
                </option>
                <option value="msl.partnerships.sluz@gmail.com">
                  South Luzon — msl.partnerships.sluz@gmail.com
                </option>
                <option value="msl.partnerships.vis@gmail.com">
                  Visayas — msl.partnerships.vis@gmail.com
                </option>
                <option value="msl.partnerships.min@gmail.com">
                  Mindanao — msl.partnerships.min@gmail.com
                </option>
              </select>

              <button
                onClick={openEmailModal}
                className={`px-6 py-3 bg-black text-[#F3C718] font-bold rounded-xl text-center transition ${
                  selectedRegionEmail 
                    ? "opacity-100 cursor-pointer hover:bg-gray-800" 
                    : "pointer-events-none opacity-50"
                }`}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Composition Modal - Dark Version */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg sm:max-w-[50%] w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">Apply Now</h3>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* To Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Send to:
                </label>
                <input
                  type="email"
                  value={emailForm.to || "msl.partnerships.ph@gmail.com"}
                  onChange={(e) => handleEmailFormChange('to', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2C21A] focus:border-transparent text-white bg-gray-800 placeholder-gray-400"
                  placeholder="Enter email address"
                  readOnly
                />
              </div>

              {/* CC Field - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CC:
                </label>
                <div className="flex flex-wrap gap-1 p-2 border border-gray-600 rounded-md bg-gray-800 min-h-[40px]">
                  {emailForm.ccEmails.map((email, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#F2C21A] text-black text-xs rounded-md"
                    >
                      {email}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  CC recipients are automatically added based on your selected region.
                </p>
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject:
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => handleEmailFormChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2C21A] focus:border-transparent text-white bg-gray-800 placeholder-gray-400"
                  placeholder="Enter email subject"
                  readOnly
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message:
                </label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => handleEmailFormChange('message', e.target.value)}
                  rows={6}
                  className="w-full h-[200px] px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2C21A] focus:border-transparent resize-none text-white bg-gray-800 placeholder-gray-400"
                  placeholder="Please introduce yourself, which org you're from, and what school you're based in, and then your partnership intent..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyEmailDetails}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
                >
                  Copy Details
                </button>
                <button
                  onClick={handleSendEmail}
                  data-send-email
                  className="flex items-center gap-2 px-4 py-2 bg-[#F2C21A] text-black font-bold rounded-md hover:bg-[#CA8B04] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Open Gmail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
        duration={5000}
      />
      
      </AuthenticatedLayout>
    </>
  );
};

export default MSLNetwork;
