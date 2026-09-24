import React, { useState, useRef, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsWatchFest.jsx";
import ModalMechanics from "./ModalMechanics.jsx";
import { User, Users, CheckCircle } from "lucide-react";
import msllogo from "./msl-logo.png";
import oppologo from "./oppo-white-logo.png";

export default function OPPOxMSLRoadShowTournament() {
  const [form, setForm] = useState({
    university: "",
    teamName: "",
    captain: "",
    player2: "",
    player3: "",
    player4: "",
    player5: "",
    agree: false,
  });

  const [universities, setUniversities] = useState([
    "University of Saint La Salle",
    "Davao del Norte State College",
    "Pamantasan ng Lungsod ng Muntinlupa"
  ]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/oppo/schools');
        const data = await response.json();
        if (data.length > 0) {
          setUniversities(data);
        }
      } catch (error) {
        console.error('Error fetching roadshow schools:', error);
      }
    };

    fetchSchools();
  }, []);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMechanics, setShowMechanics] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [validatingUsernames, setValidatingUsernames] = useState({});
  const timeoutRefs = useRef({});

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeoutId => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, []);

  const checkDuplicateUsernames = (fieldName, username, allUsernames) => {
    if (!username || typeof username !== 'string' || !username.trim()) {
      return null; // No duplicate check for empty or invalid fields
    }

    const duplicates = [];
    const usernameLower = username.toLowerCase().trim();
    const usernameFields = ["captain", "player2", "player3", "player4", "player5"];

    usernameFields.forEach(field => {
      if (field !== fieldName) {
        const value = allUsernames[field];
        // Ensure value is a string before calling toLowerCase
        if (value && typeof value === 'string' && value.toLowerCase().trim() === usernameLower) {
          duplicates.push(field);
        }
      }
    });

    return duplicates.length > 0 ? duplicates : null;
  };

  const validateUsername = async (username, fieldName, currentForm) => {
    if (!username.trim()) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: "" }));
      return;
    }

    // Use currentForm if provided, otherwise fall back to form state
    const formToCheck = currentForm || form;

    // Check for duplicates first
    const duplicateFields = checkDuplicateUsernames(fieldName, username, formToCheck);
    if (duplicateFields) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: "Duplicate username. Each player must have a unique username."
      }));
      // Also update duplicate fields
      duplicateFields.forEach(field => {
        setValidationErrors(prev => ({
          ...prev,
          [field]: "Duplicate username. Each player must have a unique username."
        }));
      });
      return;
    }

    setValidatingUsernames(prev => ({ ...prev, [fieldName]: true }));

    // Get university from currentForm or form state
    const universityToCheck = (currentForm || form).university;
    if (!universityToCheck) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: "Please select a university first"
      }));
      return;
    }

    try {
      const response = await fetch(`/check-username-tournament?username=${encodeURIComponent(username)}&university=${encodeURIComponent(universityToCheck)}`);
      const data = await response.json();

      if (data.exists && data.verified) {
        // User exists and is verified - check duplicates again after validation
        // Use the currentForm parameter or form state
        const formForDuplicateCheck = currentForm || form;
        const duplicateFieldsAfter = checkDuplicateUsernames(fieldName, username, formForDuplicateCheck);
        if (duplicateFieldsAfter) {
          setValidationErrors(prevErrors => {
            const newErrors = { ...prevErrors, [fieldName]: "Duplicate username. Each player must have a unique username." };
            duplicateFieldsAfter.forEach(field => {
              newErrors[field] = "Duplicate username. Each player must have a unique username.";
            });
            return newErrors;
          });
        } else {
          setValidationErrors(prevErrors => ({ ...prevErrors, [fieldName]: "VALID" }));
        }
      } else if (data.exists && !data.verified) {
        // User exists but is not verified
        setValidationErrors(prev => ({
          ...prev,
          [fieldName]: "Username not verified"
        }));
      } else {
        // User does not exist
        setValidationErrors(prev => ({
          ...prev,
          [fieldName]: `Username not found in ${universityToCheck}`
        }));
      }
    } catch (error) {
      console.error("Error validating username:", error);
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: "Error validating username. Please try again."
      }));
    } finally {
      setValidatingUsernames(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };

    setForm(newForm);

    // If university changes, clear all validation errors and re-validate usernames
    if (name === "university") {
      setValidationErrors({});
      // Re-validate all username fields with the new university
      const usernameFields = ["captain", "player2", "player3", "player4", "player5"];
      usernameFields.forEach(field => {
        if (newForm[field] && newForm[field].trim()) {
          if (timeoutRefs.current[field]) {
            clearTimeout(timeoutRefs.current[field]);
          }
          timeoutRefs.current[field] = setTimeout(() => {
            validateUsername(newForm[field], field, newForm);
          }, 500);
        }
      });
      return;
    }

    // Validate username fields
    if (name === "captain" || name.startsWith("player")) {
      // Check if university is selected before validating
      if (!newForm.university) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: "Please select a university first"
        }));
        return;
      }

      // Check for duplicates immediately
      const duplicateFields = checkDuplicateUsernames(name, value, newForm);
      if (duplicateFields && value.trim()) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: "Duplicate username. Each player must have a unique username."
        }));
        // Also mark duplicate fields
        duplicateFields.forEach(field => {
          setValidationErrors(prev => ({
            ...prev,
            [field]: "Duplicate username. Each player must have a unique username."
          }));
        });
      } else {
        // Clear previous error for this field if no duplicates
        setValidationErrors(prev => ({ ...prev, [name]: "" }));

        // Re-validate other fields that might have been marked as duplicate
        const usernameFields = ["captain", "player2", "player3", "player4", "player5"];
        usernameFields.forEach(field => {
          if (field !== name && newForm[field] && validationErrors[field] === "Duplicate username. Each player must have a unique username.") {
            // Re-check this field for duplicates
            const otherDuplicates = checkDuplicateUsernames(field, newForm[field], newForm);
            if (!otherDuplicates && validationErrors[field] === "Duplicate username. Each player must have a unique username.") {
              // Clear duplicate error and re-validate
              setValidationErrors(prev => ({ ...prev, [field]: "" }));
              if (timeoutRefs.current[field]) {
                clearTimeout(timeoutRefs.current[field]);
              }
              timeoutRefs.current[field] = setTimeout(() => {
                validateUsername(newForm[field], field, newForm);
              }, 500);
            }
          }
        });
      }

      // Clear existing timeout
      if (timeoutRefs.current[name]) {
        clearTimeout(timeoutRefs.current[name]);
      }

      // Debounce validation (only if no duplicates)
      if (!duplicateFields || !value.trim()) {
        timeoutRefs.current[name] = setTimeout(() => {
          validateUsername(value, name, newForm);
        }, 500);
      }
    }
  };

  const handleAgreeFromModal = () => {
    setForm((prev) => ({ ...prev, agree: true }));
    setShowMechanics(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors (excluding VALID status)
    const hasErrors = Object.values(validationErrors).some(error => error !== "" && error !== "VALID");
    if (hasErrors) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    // Check for duplicate usernames before submission
    const usernameFields = ["captain", "player2", "player3", "player4", "player5"];
    const usernames = {};
    usernameFields.forEach(field => {
      usernames[field] = form[field];
    });

    // Check all fields for duplicates
    let hasDuplicates = false;
    usernameFields.forEach(field => {
      if (form[field]) {
        const duplicateFields = checkDuplicateUsernames(field, form[field], form);
        if (duplicateFields) {
          hasDuplicates = true;
          setValidationErrors(prev => ({
            ...prev,
            [field]: "Duplicate username. Each player must have a unique username."
          }));
        }
      }
    });

    if (hasDuplicates) {
      alert("Please ensure all usernames are unique. Duplicate usernames are not allowed.");
      return;
    }

    // Check if all usernames are validated
    const allUsernamesValid = usernameFields.every(field => {
      const username = form[field];
      return username.trim() === "" || validationErrors[field] === "VALID";
    });

    if (!allUsernamesValid) {
      alert("Please wait for username validation to complete or fix validation errors.");
      return;
    }

    const googleFormURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSdbHbI2DnJB3d0DcdoSR1nmTt_T5Af0MaN4w2MivO5k8ieEtg/formResponse";

    // Validate university is selected
    if (!form.university) {
      alert("Please select a university before submitting.");
      return;
    }

    const formBody = new FormData();
    formBody.append("entry.2008089998", form.university);
    formBody.append("entry.1615860502", form.teamName);
    formBody.append("entry.2087994405", form.captain);
    formBody.append("entry.1748019360", form.player2);
    formBody.append("entry.805126702", form.player3);
    formBody.append("entry.1460557887", form.player4);
    formBody.append("entry.1273012540", form.player5);
    formBody.append("entry.1231196655", form.agree ? "Yes" : "No");

    try {
      await fetch(googleFormURL, {
        method: "POST",
        body: formBody,
        mode: "no-cors",
      });

      setShowConfirmModal(true);
      setForm({
        university: "",
        teamName: "",
        captain: "",
        player2: "",
        player3: "",
        player4: "",
        player5: "",
        agree: false,
      });
      setValidationErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="OPPO x MSL Roadshow Tournament" />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          input[type="text"]:-webkit-autofill,
          input[type="text"]:-webkit-autofill:hover,
          input[type="text"]:-webkit-autofill:focus,
          input[type="text"]:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
            box-shadow: 0 0 0 1000px transparent inset !important;
            -webkit-text-fill-color: white !important;
            background-color: transparent !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          select {
            background-color: transparent !important;
            color: white !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23F2C21A' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 12px;
            padding-right: 2rem;
          }
          select option {
            background-color: #1f2937;
            color: white;
          }
        `}</style>
      </Helmet>

      <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-10 sm:pt-20 font-['Montserrat']">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-bold mb-1 text-[20px] sm:text-[26px] lg:text-[32px] text-[#F2C21A] leading-tight">
            Oppo x MSL Roadshow
          </h2>
          <h3 className="text-white text-[16px] sm:text-[22px] lg:text-[26px] font-extrabold leading-relaxed break-words">
            {form.university || "Select Your University"}
          </h3>
        </div>

        {/* Form Container */}
        <div className="bg-black/80 text-white rounded-2xl p-5 sm:p-8 w-full max-w-sm sm:max-w-3xl shadow-lg mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-gray-200 text-base sm:text-lg font-bold leading-relaxed">
              Tournament Registration
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* University Selection */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                University <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-2 sm:gap-3">
                <Users className="text-[#F2C21A] w-4 h-4 sm:w-5 sm:h-5" />
                <select
                  name="university"
                  value={form.university}
                  onChange={handleChange}
                  required
                  className="bg-transparent flex-1 outline-none text-white text-sm sm:text-base appearance-none cursor-pointer"
                  style={{
                    WebkitTextFillColor: 'white',
                    transition: 'background-color 5000s ease-in-out 0s'
                  }}
                >
                  <option value="" className="bg-gray-800 text-white">
                    Select University
                  </option>
                  {universities.map((university) => (
                    <option key={university} value={university} className="bg-gray-800 text-white">
                      {university}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team Name */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Team Name
              </label>
              <div className="flex items-center bg-white/5 rounded-xl p-2.5 sm:p-3 gap-2 sm:gap-3">
                <Users className="text-[#F2C21A] w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  name="teamName"
                  value={form.teamName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your team name"
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Team Captain */}
            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Team Captain Username
              </label>
              <div className={`flex items-center rounded-xl p-2.5 sm:p-3 gap-2 sm:gap-3 ${validationErrors.captain === "VALID"
                  ? 'bg-green-500/10 border border-green-500'
                  : validationErrors.captain
                    ? 'bg-red-500/10 border border-red-500'
                    : 'bg-white/5'
                }`}>
                {validatingUsernames.captain ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F2C21A]"></div>
                ) : validationErrors.captain === "VALID" ? (
                  <CheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <User className="text-[#F2C21A] w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <input
                  type="text"
                  name="captain"
                  value={form.captain}
                  onChange={handleChange}
                  required
                  placeholder="Enter team captain username"
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
              {validationErrors.captain && validationErrors.captain !== "VALID" && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.captain}</p>
              )}
              {validationErrors.captain === "VALID" && (
                <p className="text-green-400 text-xs mt-1">Username is valid!</p>
              )}
            </div>

            {/* Players 2–5 */}
            {[2, 3, 4, 5].map((num) => (
              <div key={num}>
                <label className="block font-medium mb-1 text-sm sm:text-base">{`Player ${num} Username`}</label>
                <div className={`flex items-center rounded-xl p-2.5 sm:p-3 gap-2 sm:gap-3 ${validationErrors[`player${num}`] === "VALID"
                    ? 'bg-green-500/10 border border-green-500'
                    : validationErrors[`player${num}`]
                      ? 'bg-red-500/10 border border-red-500'
                      : 'bg-white/5'
                  }`}>
                  {validatingUsernames[`player${num}`] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F2C21A]"></div>
                  ) : validationErrors[`player${num}`] === "VALID" ? (
                    <CheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <User className="text-[#F2C21A] w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  <input
                    type="text"
                    name={`player${num}`}
                    value={form[`player${num}`]}
                    onChange={handleChange}
                    required
                    placeholder={`Enter player ${num} username`}
                    className="bg-transparent flex-1 outline-none text-white placeholder-gray-400 text-sm sm:text-base autofill:bg-transparent autofill:text-white"
                    style={{
                      WebkitTextFillColor: 'white',
                      transition: 'background-color 5000s ease-in-out 0s'
                    }}
                  />
                </div>
                {validationErrors[`player${num}`] && validationErrors[`player${num}`] !== "VALID" && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors[`player${num}`]}</p>
                )}
                {validationErrors[`player${num}`] === "VALID" && (
                  <p className="text-green-400 text-xs mt-1">Username is valid!</p>
                )}
              </div>
            ))}

            {/* Agreement */}
            <div className="flex items-start gap-2 mt-3 sm:mt-4">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                readOnly // prevents manual checking
                className="mt-1 accent-[#F2C21A] cursor-pointer"
              />
              <label className="text-xs sm:text-sm leading-snug">
                {form.agree ? (
                  <>
                    I have read and agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowMechanics(true)}
                      className="text-[#F2C21A] underline hover:text-yellow-400 transition-colors"
                    >
                      tournament mechanics
                    </button>.
                  </>
                ) : (
                  <>
                    Please read the{" "}
                    <button
                      type="button"
                      onClick={() => setShowMechanics(true)}
                      className="text-[#F2C21A] underline hover:text-yellow-400 transition-colors"
                    >
                      tournament mechanics
                    </button>{" "}
                    first.
                  </>
                )}
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!form.agree || Object.values(validationErrors).some(error => error !== "" && error !== "VALID")}
              className={`w-full mt-4 font-bold py-3 rounded-xl transition-colors text-sm sm:text-base ${form.agree && !Object.values(validationErrors).some(error => error !== "" && error !== "VALID")
                  ? "bg-[#F2C21A] hover:bg-[#ddb518] text-black cursor-pointer"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
            >
              Submit Registration
            </button>


            {/* Logos */}
            <div className="flex flex-row justify-center items-center mt-6 space-x-4 sm:space-x-6">
              <img
                src={oppologo}
                alt="OPPO Logo"
                className="h-12 sm:h-20 w-auto"
              />
              <img
                src={msllogo}
                alt="MSL Logo"
                className="h-10 sm:h-16 w-auto"
              />
            </div>

          </form>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <div
              className="bg-black text-white border border-[#F2C21A] p-6 sm:p-8 rounded-2xl shadow-2xl text-center w-full max-w-xs sm:max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-[#F2C21A]">
                Registration Submitted!
              </h2>
              <p className="mb-4 text-sm sm:text-base">
                Thank you for registering for the{" "}
                <strong>OPPO x MSL Roadshow Tournament!</strong>
                <br /> We’ll contact you soon with further details.
              </p>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-[#F2C21A] hover:bg-[#ddb518] text-black font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Mechanics Modal */}
        {showMechanics && (
          <ModalMechanics
            onClose={() => setShowMechanics(false)}
            onAgree={handleAgreeFromModal}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
}