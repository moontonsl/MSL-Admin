import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Head, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/Layouts/MainLayout.jsx";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";

/** @typedef {'login' | 'selection' | 'join_team' | 'solo_matchmaking'} RegistrationView */

export default function Registration({ inviteTeamId }) {
  /** @type {[RegistrationView, function]} */
  const [currentView, setCurrentView] = useState("login");
  const [authUser, setAuthUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [rolesError, setRolesError] = useState("");
  const roleTriggerRef = useRef(null);
  const roleMenuRef = useRef(null);
  const [roleMenuPos, setRoleMenuPos] = useState(null);

  const roleOptions = [
    "Jungler",
    "Roam",
    "Gold Laner",
    "Exp Laner",
    "Mid Laner",
  ];

  const inputClassLogin =
    "w-full rounded-full border border-white/30 bg-transparent text-white placeholder-white/40 px-4 py-2.5 focus:outline-none focus:border-yellow-400/60";

  const toggleRole = (role) => {
    setRolesError("");
    setSelectedRoles([role]);
    setIsRoleOpen(false);
  };

  const soloRoleLabel = selectedRoles.length > 0 ? selectedRoles[0] : "Select your role";

  const updateRoleMenuPosition = useCallback(() => {
    const el = roleTriggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRoleMenuPos({ top: r.bottom + 8, left: r.left, width: r.width });
  }, []);

  useLayoutEffect(() => {
    if (!isRoleOpen || currentView !== "solo_matchmaking") {
      setRoleMenuPos(null);
      return;
    }
    updateRoleMenuPosition();
    window.addEventListener("scroll", updateRoleMenuPosition, true);
    window.addEventListener("resize", updateRoleMenuPosition);
    return () => {
      window.removeEventListener("scroll", updateRoleMenuPosition, true);
      window.removeEventListener("resize", updateRoleMenuPosition);
    };
  }, [isRoleOpen, currentView, updateRoleMenuPosition]);

  useEffect(() => {
    if (!isRoleOpen) return;
    const onPointerDown = (e) => {
      if (roleTriggerRef.current?.contains(e.target)) return;
      if (roleMenuRef.current?.contains(e.target)) return;
      setIsRoleOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isRoleOpen]);

  // Handle ?view=solo query parameter (for "Change Role" return trip)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'solo' && authUser) {
      setCurrentView('solo_matchmaking');
    }
  }, [authUser]);

  const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";

  const usernameContainsAt = () => username.includes("@");

  const checkTeamAndRedirect = async (user) => {
    try {
      const resp = await fetch(`/team-check?user_id=${user.id}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.isInTeam) {
          if (data.team_type === "solo") {
            window.location.href = "/Tournament/SoloPlayer";
          } else {
            window.location.href = "/Tournament/CampusTournamentTeam";
          }
          return true;
        }
      }
    } catch (e) {
      console.error("Team check failed", e);
    }
    return false;
  };

  const submitLoginOnly = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (!username || !password) {
        setError("Please enter your username and password.");
        return;
      }

      if (usernameContainsAt()) {
        setError(
          "Use your MSL username from student registration (letters and numbers only), not an email. Staff accounts such as admin@msl.com use the admin login, not this page. For local testing try username msltcap1."
        );
        return;
      }

      const response = await fetch("/validate-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrf(),
        },
        body: JSON.stringify({
          username,
          password,
          invite_team_id: inviteTeamId,
        }),
      });

      if (response.ok) {
        const userData = await response.json();

        if (userData.user) {
          if (userData.user.state !== "Verified") {
            setError(
              "Only verified users can participate in campus tournaments. Please complete your verification first."
            );
            return;
          }

          // Check if user is already in a team before showing selection
          const redirected = await checkTeamAndRedirect(userData.user);
          if (redirected) return;

          if (userData.csrf_token) {
            document.querySelector('meta[name="csrf-token"]')?.setAttribute("content", userData.csrf_token);
          }

          setAuthUser(userData.user);
          sessionStorage.setItem("campusTournamentCaptain", JSON.stringify(userData.user));
          sessionStorage.removeItem("soloMatchmakingRole");
          setCurrentView("selection");
          return;
        }
        setError("Login failed. Please check your credentials.");
      } else {
        if (response.status === 419) {
          setError("Session expired. Please refresh the page and try again.");
        } else {
          try {
            const errorData = await response.json();
            setError(errorData.message || "Login failed. Please check your credentials.");
          } catch {
            setError("Login failed. Please check your credentials.");
          }
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitJoinFlow = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (!teamCode) {
        setError("Please enter the team code.");
        setIsLoading(false);
        return;
      }

      if (!username || !password) {
        setError("Please enter your username and password. Go back to login if needed.");
        setIsLoading(false);
        return;
      }

      if (usernameContainsAt()) {
        setError(
          "Use your MSL username, not an email. Go back to the first screen and sign in with your username, or use a demo account like msltcap1 for local testing."
        );
        setIsLoading(false);
        return;
      }

      const response = await fetch("/join-by-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrf(),
        },
        body: JSON.stringify({
          username,
          password,
          invite_team_id: inviteTeamId,
          team_code: teamCode,
        }),
      });

      if (response.ok) {
        const userData = await response.json();

        if (userData.user) {
          if (userData.user.state !== "Verified") {
            setError(
              "Only verified users can participate in campus tournaments. Please complete your verification first."
            );
            return;
          }

          sessionStorage.removeItem("soloMatchmakingRole");
          router.visit("/Tournament/CampusTournamentTeam");
          return;
        }
        setError("Login failed. Please check your credentials.");
      } else {
        if (response.status === 419) {
          setError("Session expired. Please refresh the page and try again.");
        } else {
          try {
            const errorData = await response.json();
            setError(errorData.message || "Login failed. Please check your credentials.");
          } catch {
            setError("Login failed. Please check your credentials.");
          }
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleCreateTeam = async () => {
    setError("");

    if (!authUser) {
      setError("Please log in first.");
      setCurrentView("login");
      return;
    }

    setIsLoading(true);
    try {
      const teamCheckResponse = await fetch(`/team-check?user_id=${authUser.id}`);
      if (teamCheckResponse.ok) {
        const teamData = await teamCheckResponse.json();
        if (teamData.isInTeam) {
          router.visit("/Tournament/CampusTournamentTeam");
          return;
        }
      }

      const tournamentResponse = await fetch("/approved-tournaments");
      const tournaments = await tournamentResponse.json();

      const hasApprovedTournament = tournaments.some((t) => t.school_name === authUser.university);

      if (hasApprovedTournament) {
        sessionStorage.setItem("campusTournamentCaptain", JSON.stringify(authUser));
        router.visit("/Tournament/CampusTournamentReg");
      } else {
        setError("There's no available tournament in your campus");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const enterSoloMatchmaking = async () => {
    setError("");
    setIsLoading(true);

    try {
      // 1. Check if user is already in a team (solo or regular)
      const redirected = await checkTeamAndRedirect(authUser);
      if (redirected) return;

      // 2. Check for approved tournament
      const tournamentResponse = await fetch("/approved-tournaments");
      const tournaments = await tournamentResponse.json();

      const hasApprovedTournament = tournaments.some((t) => t.school_name === authUser.university);

      if (hasApprovedTournament) {
        // Redirect directly to SoloPlayer dashboard
        window.location.href = "/Tournament/SoloPlayer";
      } else {
        setError("There's no available tournament in your campus");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (currentView === "login") {
      await submitLoginOnly();
      return;
    }
    if (currentView === "join_team") {
      await submitJoinFlow();
      return;
    }
  };

  const goBackToSelection = () => {
    setError("");
    setRolesError("");
    setIsRoleOpen(false);
    setCurrentView("selection");
  };

  const motionProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.22 },
  };

  return (
    <MainLayout>
      <Head title="Campus Tournament" />
      <section
        className="relative min-h-[calc(100vh-160px)] py-8 md:py-12 overflow-visible"
        style={{
          backgroundImage: "url('/images/Campus Tournament/MainBG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative max-w-md mx-auto px-4 font-['Montserrat'] overflow-visible">
          <div className="flex flex-col items-center gap-2 md:gap-3 mb-6 md:mb-8">
            <img
              src="/images/About Page/SL Logo.png"
              alt="SL Logo"
              className="w-16 h-16 md:w-20 md:h-20 object-contain select-none pointer-events-none"
            />
            <h1 className="text-white font-bold tracking-tight text-[24px] md:text-[32px] lg:text-[40px] md:whitespace-nowrap">
              CAMPUS TOURNAMENT
            </h1>
            <p className="text-white/80 text-[12px] md:text-[14px] text-center">
              Log in using your MSL credentials to continue.
            </p>
          </div>

          <div className="relative rounded-2xl border border-white/10 shadow-xl overflow-visible">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl bg-neutral-900/70 backdrop-blur"
              aria-hidden
            />
            <div className="relative z-0 p-5 md:p-6 overflow-visible min-h-0">
              <AnimatePresence mode="wait">
                {currentView === "login" && (
                  <motion.div key="login" {...motionProps}>
                    <div className="text-center text-white font-bold tracking-tight text-[20px] md:text-[24px] lg:text-[30px] uppercase rounded-md py-2 mb-3">
                      Registration
                    </div>

                    <form className="space-y-4 overflow-visible min-h-0" onSubmit={handleFormSubmit}>
                      {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                          {error}
                        </div>
                      )}

                      <div>
                        <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1">
                          MSL Username
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={inputClassLogin}
                          placeholder="Enter your MSL Username"
                          required
                          autoComplete="username"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={inputClassLogin}
                          placeholder="Enter your password"
                          required
                          autoComplete="current-password"
                        />
                      </div>

                      <div className="pt-2 flex justify-center">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full md:w-auto px-10 py-3 rounded-full bg-[#F2C21A] hover:bg-[#d9ae17] text-black font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                          <span>{isLoading ? "Processing..." : "Login"}</span>
                          {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {currentView === "selection" && (
                  <motion.div key="selection" {...motionProps}>
                    <h2 className="text-white font-bold text-center text-lg md:text-xl mb-8">
                      Monthly Tournament Registration
                    </h2>
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleCreateTeam}
                        className="w-full py-3 rounded-full bg-[#FFC107] text-black font-bold text-sm hover:bg-[#e6ae06] transition-colors disabled:opacity-50"
                      >
                        Create a New Team
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setCurrentView("join_team");
                        }}
                        className="w-full py-3 rounded-full bg-neutral-700 text-white font-semibold text-sm hover:bg-neutral-600 transition-colors"
                      >
                        Join an Existing Team
                      </button>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={enterSoloMatchmaking}
                        className="w-full py-3 rounded-full bg-neutral-700 text-white font-semibold text-sm hover:bg-neutral-600 transition-colors disabled:opacity-50"
                      >
                        {isLoading && currentView === "selection" ? "Checking..." : "Solo Matchmaking"}
                      </button>
                    </div>
                    {error && (
                      <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm text-center">
                        {error}
                      </div>
                    )}
                  </motion.div>
                )}

                {currentView === "join_team" && (
                  <motion.div key="join_team" {...motionProps}>
                    <button
                      type="button"
                      onClick={goBackToSelection}
                      className="flex items-center gap-1 text-white/60 hover:text-white text-sm mb-4 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>

                    <h2 className="text-white font-bold text-[20px] md:text-[22px] text-center mb-6">
                      Join an Existing <span className="text-[#FFC107]">Team</span>
                    </h2>

                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                      {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                          {error}
                        </div>
                      )}

                      <div>
                        <label className="block text-[12px] md:text-sm text-white/70 font-medium mb-1">
                          Team Code
                        </label>
                        <input
                          type="text"
                          value={teamCode}
                          onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                          className={inputClassLogin}
                          placeholder="Enter Team Code"
                          maxLength={6}
                          required
                        />
                      </div>

                      <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                        Need a Team Code? Reach out to your team captain, as they are the only ones authorized to
                        generate it. Make sure to copy the code exactly as provided.
                      </p>

                      <div className="pt-2 flex justify-center">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full md:w-auto px-10 py-3 rounded-full bg-[#F2C21A] hover:bg-[#d9ae17] text-black font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                          <span>{isLoading ? "Processing..." : "Join Team"}</span>
                          {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
