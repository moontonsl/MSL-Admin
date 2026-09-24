import React, { useState, useEffect, useMemo, useRef } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";
import BG from "./BG.png";
import FFLogo from "./FF2xMSL_logo.png";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Hash,
  ChevronDown,
  School,
} from "lucide-react";
import { Link } from "@inertiajs/react";

// Simple debounce helper
function debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const ISLANDS = ["Luzon", "Visayas", "Mindanao"];

// const FEATURED_SCHOOLS = [
//   { name: "Ateneo de Davao University", region: "11 - Davao Region", island: "Mindanao" },
//   { name: "Batangas State University-Alangilan", region: "04 - CALABARZON", island: "Luzon" },
//   { name: "Talisay City College", region: "07 - Central Visayas", island: "Visayas" },
//   { name: "City College of San Fernando", region: "03 - Central Luzon", island: "Luzon" },
//   { name: "Laguna State Polytechnic University-Los Baños", region: "04 - CALABARZON", island: "Luzon" },
//   { name: "La Salle University", region: "10 - Northern Mindanao", island: "Mindanao" },
//   { name: "Mindanao State University - Iligan Institute of Technology", region: "10 - Northern Mindanao", island: "Mindanao" },
//   { name: "PHINMA St. Jude College", region: "13 - Nat. Capital Region", island: "Luzon" },
//   { name: "University of the Philippines-Diliman", region: "13 - Nat. Capital Region", island: "Luzon" },
//   { name: "University of San Carlos - Cebu", region: "07 - Central Visayas", island: "Visayas" },
// ];
const FEATURED_SCHOOLS = [
  { name: "Father Saturnino Urios University", region: "16 - Caraga", island: "Mindanao" },
  { name: "Batangas State University - Alangilan", region: "04 - CALABARZON", island: "Luzon" },
  { name: "Talisay City College", region: "07 - Central Visayas", island: "Visayas" },
  { name: "City College of San Fernando", region: "03 - Central Luzon", island: "Luzon" },
  { name: "Laguna State Polytechnic University - Los Baños", region: "04 - CALABARZON", island: "Luzon" },
  { name: "La Salle University - Ozamiz City", region: "10 - Northern Mindanao", island: "Mindanao" },
  { name: "Mindanao State University - Iligan Institute of Technology", region: "10 - Northern Mindanao", island: "Mindanao" },
  { name: "Colegio de Muntinlupa", region: "13 - Nat. Capital Region", island: "Luzon" },
  { name: "University of the Philippines-Diliman", region: "13 - Nat. Capital Region", island: "Luzon" },
  { name: "Bulacan State University - Sarmiento Campus", region: "03 - Central Luzon", island: "Luzon" },
  { name: "Carlos Hilado Memorial State University", region: "07 - Western Visayas", island: "Visayas" },
  { name: "SM Butuan", region: "16 - Caraga", island: "Mindanao" },
  { name: "Colegio de Los Baños", region: "04 - CALABARZON", island: "Luzon" },
];

export default function FF25Attendance() {
  const { flash, errors } = usePage().props;
  const [hasAccount, setHasAccount] = useState("yes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIsland, setSelectedIsland] = useState("");
  const [usernameStatus, setUsernameStatus] = useState({ message: "", type: "" });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });
  const [form, setForm] = useState({
    region: "",
    school: "",
    date: "",
    username: "",
    fullname: "",
    email: "",
    mlbbid: "",
    mlbbserver: "",
  });

  // Get schools filtered by selected island
  const getFilteredSchools = () => {
    if (!selectedIsland) return [];
    return FEATURED_SCHOOLS.filter((school) => school.island === selectedIsland);
  };

  const debouncedUsernameCheck = useMemo(
    () =>
      debounce(async ({ username, island, school }) => {
        try {
          setIsCheckingUsername(true);
          const response = await axios.get("/ff25/check-username", {
            params: { username, island, school },
          });
          const data = response.data;

          if (data.exists && data.verified && data.matches?.island && data.matches?.school) {
            setUsernameStatus({
              message: data.message || "Username is verified and matches the selected region and school.",
              type: "success",
            });

            // Auto-populate user data if available
            if (data.user_data) {
              setForm((prev) => ({
                ...prev,
                fullname: data.user_data.full_name || prev.fullname,
                email: data.user_data.email || prev.email,
                mlbbid: data.user_data.mlbb_id || prev.mlbbid,
                mlbbserver: data.user_data.mlbb_server || prev.mlbbserver,
              }));
            }
          } else if (data.exists && !data.verified) {
            setUsernameStatus({
              message: data.message || "Username found but account is not verified.",
              type: "error",
            });
          } else if (data.exists) {
            setUsernameStatus({
              message: data.message || "Username found but details do not match.",
              type: "error",
            });
          } else {
            setUsernameStatus({
              message: data.message || "Username not found.",
              type: "error",
            });
          }
        } catch (error) {
          const message =
            error.response?.data?.message ||
            "Unable to verify username right now. Please try again.";
          setUsernameStatus({ message, type: "error" });
        } finally {
          setIsCheckingUsername(false);
        }
      }, 500),
    []
  );

  const triggerUsernameValidation = (usernameValue, currentFormState = form) => {
    if (hasAccount !== "yes") {
      setUsernameStatus({ message: "", type: "" });
      return;
    }

    const trimmedUsername = (usernameValue || "").trim();
    if (!trimmedUsername) {
      setUsernameStatus({ message: "", type: "" });
      return;
    }

    if (!selectedIsland || !currentFormState.school) {
      setUsernameStatus({
        message: "Select your region and school first.",
        type: "warning",
      });
      return;
    }

    setUsernameStatus({ message: "Checking username...", type: "info" });
    debouncedUsernameCheck({
      username: trimmedUsername,
      island: selectedIsland,
      school: currentFormState.school,
    });
  };

  useEffect(() => {
    if (hasAccount !== "yes") {
      setUsernameStatus({ message: "", type: "" });
      return;
    }

    if (form.username.trim()) {
      triggerUsernameValidation(form.username, form);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccount, selectedIsland, form.school]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "username") {
        triggerUsernameValidation(value, updated);
      }
      return updated;
    });
  };

  const handleIslandChange = (e) => {
    const island = e.target.value;
    setSelectedIsland(island);
    setForm((prev) => ({
      ...prev,
      region: island, // Store island as region for backend
      school: "" // Clear school when island changes
    }));
    // Trigger username validation if username exists
    if (form.username.trim()) {
      triggerUsernameValidation(form.username, { ...form, region: island, school: "" });
    }
  };

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, school: value }));
    // Trigger username validation if username exists
    if (form.username.trim()) {
      triggerUsernameValidation(form.username, { ...form, school: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate region selection
    if (!selectedIsland) {
      alert("Please select a region.");
      return;
    }

    // Validate school selection
    if (!form.school.trim()) {
      alert("Please select a school.");
      return;
    }

    // Validate MSL username when account is yes
    if (hasAccount === "yes" && !form.username.trim()) {
      alert("Please enter your MSL username.");
      return;
    }

    // Validate username status if account is yes
    if (hasAccount === "yes" && usernameStatus.type !== "success") {
      alert("Please ensure your username is verified and matches the selected region and school.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      has_msl_account: hasAccount,
      region: form.region,
      school: form.school,
      event_date: form.date,
      msl_username: hasAccount === "no" ? "No Account" : form.username,
      full_name: hasAccount === "no" ? form.fullname : (form.fullname || null),
      email: hasAccount === "no" ? form.email : (form.email || null),
      mlbb_id: hasAccount === "no" ? form.mlbbid : (form.mlbbid || null),
      mlbb_server: hasAccount === "no" ? form.mlbbserver : (form.mlbbserver || null),
    };

    router.post(route("ff25.attendance.store"), payload, {
      preserveScroll: true,
      onSuccess: () => {
        setForm({
          region: "",
          school: "",
          date: "",
          username: "",
          fullname: "",
          email: "",
          mlbbid: "",
          mlbbserver: "",
        });
        setHasAccount("yes");
        setSelectedIsland("");
        setUsernameStatus({ message: "", type: "" });
        setModalInfo({
          open: true,
          type: "success",
          title: "Registration Success",
          message: "Your attendance has been recorded successfully.",
        });
      },
      onError: (serverErrors) => {
        const errorMessage =
          serverErrors?.username ||
          serverErrors?.fullname ||
          serverErrors?.mlbbid ||
          serverErrors?.mlbb_server ||
          serverErrors?.event_date ||
          "Something went wrong. Please check your inputs and try again.";

        setModalInfo({
          open: true,
          type: "error",
          title: "Registration Failed",
          message: errorMessage,
        });
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const closeModal = () => {
    setModalInfo((prev) => ({ ...prev, open: false }));
  };

  return (
    <AuthenticatedLayout>
      <Head title="FF25 Attendance Registration" />
      <Helmet>
        <title>FF25 Attendance Registration</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div
        className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 sm:pt-5 font-['Montserrat'] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}
      >
        <Link href="/FF25">
          <img 
            src={FFLogo} 
            alt="FF25 MSL Logo"
            className="w-64 sm:w-80 drop-shadow-lg mb-6 cursor-pointer" 
          />
        </Link>

        {/* Form Card */}
          <div
            className="rounded-2xl p-5 sm:p-8 w-full max-w-sm sm:max-w-3xl shadow-lg mx-auto border-2 backdrop-blur-md bg-[#1a1f7a]/75 ]"
            style={{
              borderColor: "#fcd821",
              borderWidth: "2px",
            }}
          >

          <form onSubmit={handleSubmit} className="space-y-4">
            {flash?.success && (
              <div className="rounded-xl border border-green-500 bg-green-500/20 px-4 py-3 text-center text-sm font-semibold text-green-100">
                {flash.success}
              </div>
            )}
            {errors?.username && (
              <div className="rounded-xl border border-red-500 bg-red-500/20 px-4 py-3 text-center text-sm font-semibold text-red-100">
                {errors.username}
              </div>
            )}
            {errors?.fullname && (
              <div className="rounded-xl border border-red-500 bg-red-500/20 px-4 py-3 text-center text-base font-bold text-red-100">
                {errors.fullname}
              </div>
            )}
            <div className="text-center">
              <h2 className="font-bold mb-1 text-[20px] sm:text-[26px] lg:text-[32px] text-[#fcd821]">
                ATTENDANCE REGISTRATION
              </h2>
            </div>

            {/* DROPDOWN: Do you have MSL Account? */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Do you have an MSL Account?</label>

              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">

                {/* Left yellow circle */}
                <User className="text-[#fcd821] w-5 h-5" />

                {/* Select */}
                <select
                  name="hasAccount"
                  value={hasAccount}
                  onChange={(e) => setHasAccount(e.target.value)}
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                >
                  <option value="yes" className="text-black">Yes</option>
                  <option value="no" className="text-black">No</option>
                </select>

                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
              </div>
            </div>


            {/* REGION */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Region</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <MapPin className="text-[#fcd821] w-5 h-5" />

                <select
                  name="island"
                  value={selectedIsland}
                  onChange={handleIslandChange}
                  required
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                >
                  <option value="" disabled className="text-black">Select your region</option>
                  {ISLANDS.map((island) => (
                    <option key={island} value={island} className="text-black">{island}</option>
                  ))}
                </select>

                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
              </div>
            </div>


            {/* SCHOOL */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">School</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <School className="text-[#fcd821] w-5 h-5" />

                <select
                  name="school"
                  value={form.school}
                  onChange={handleSchoolChange}
                  required
                  disabled={!selectedIsland}
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled className="text-black">
                    {selectedIsland ? "Select your school" : "Select region first"}
                  </option>
                  {getFilteredSchools().map((school) => (
                    <option key={school.name} value={school.name} className="text-black">
                      {school.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#fcd821] w-5 h-5 pointer-events-none" />
              </div>
            </div>


            {/* MSL Username */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">MSL Username</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <User className="text-[#fcd821] w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={hasAccount === "no" ? "No Account" : form.username}
                  onChange={hasAccount === "yes" ? handleChange : undefined}
                  readOnly={hasAccount === "no"}
                  required={hasAccount === "yes"}
                  placeholder="Enter your MSL username"
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                />
              </div>
              {hasAccount === "yes" && usernameStatus.message && (
                <p
                  className={`mt-1 text-base font-semibold ${{
                    success: "text-green-400",
                    error: "text-red-400",
                    warning: "text-yellow-300",
                    info: "text-white/70",
                  }[usernameStatus.type] || "text-white/70"
                    }`}
                >
                  {isCheckingUsername ? "Checking username..." : usernameStatus.message}
                </p>
              )}
              {hasAccount === "yes" && errors?.username && (
                <p className="mt-1 text-sm font-semibold text-red-400">
                  {errors.username}
                </p>
              )}
            </div>


            {/* Extra Fields if NO account */}
            {hasAccount === "no" && (
              <>
                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Full Name</label>
                  <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                    <User className="text-[#fcd821] w-5 h-5" />
                    <input type="text" name="fullname" value={form.fullname} onChange={handleChange} required placeholder="Enter your full name"
                      className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" />
                  </div>
                  {errors?.fullname && (
                    <p className="mt-1 text-base font-semibold text-red-300">
                      {errors.fullname}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">Email Address</label>
                  <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                    <Mail className="text-[#fcd821] w-5 h-5" />
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Enter your email"
                      className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">MLBB ID</label>
                  <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                    <Hash className="text-[#fcd821] w-5 h-5" />
                    <input type="text" name="mlbbid" value={form.mlbbid} onChange={handleChange} required placeholder="Enter MLBB ID"
                      className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-sm sm:text-base">MLBB Server</label>
                  <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                    <Globe className="text-[#fcd821] w-5 h-5" />
                    <input type="text" name="mlbbserver" value={form.mlbbserver} onChange={handleChange} required placeholder="Enter MLBB server"
                      className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50" />
                  </div>
                </div>
              </>
            )}


            {/* DATE */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">Date</label>
              <div className="relative bg-[#1a1f7a]/80 rounded-xl p-3 flex items-center gap-3">
                <Calendar className="text-[#fcd821] w-5 h-5" />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="bg-transparent w-full outline-none text-white appearance-none pl-3 rounded-md border border-white/50"
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 font-bold py-3 rounded-xl bg-[#F2C21A] hover:bg-[#ddb518] text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "REGISTER"}
            </button>

          </form>
        </div>

        {modalInfo.open && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-2xl bg-[#1a1f7a] border border-[#fcd821] p-6 text-center shadow-2xl">
              <h3
                className={`text-2xl font-bold mb-3 ${modalInfo.type === "success" ? "text-[#fcd821]" : "text-red-400"
                  }`}
              >
                {modalInfo.title}
              </h3>
              <p className="text-white text-base mb-6">{modalInfo.message}</p>
              <button
                onClick={closeModal}
                className={`w-full py-2 rounded-xl font-semibold ${modalInfo.type === "success"
                  ? "bg-[#fcd821] text-[#1a1f7a]"
                  : "bg-red-500 text-white"
                  }`}
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