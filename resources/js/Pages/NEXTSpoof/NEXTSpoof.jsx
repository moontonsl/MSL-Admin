import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutNEXTSpoof";
import { Helmet } from "react-helmet";
import MechanicsModal from "./MechanicsModal"; // <- adjust path if needed

export default function NEXTSpoof({ auth }) {
  const [form, setForm] = useState({
    fullName: "",
    mlbbId: "",
    mlbbServer: "",
    ign: "",
    school: "",
    entryLink: "",
    chsl: "",
  });

  const [showModal, setShowModal] = useState(false); // submission success modal
  const [showMechanicsModal, setShowMechanicsModal] = useState(false); // mechanics modal
  const [mechanicsChecked, setMechanicsChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mechanicsChecked) {
      setErrorMsg("Please check the mechanics first.");
      setTimeout(() => setErrorMsg(""), 5000);
      return;
    }

    const formURL =
      "https://docs.google.com/forms/d/e/1FAIpQLSemum0YfeNTpfdPIZx-KTJG2_9Xh3MtqCwJ8t_Gdt4-tYSdFQ/formResponse";

    const formData = new FormData();
    formData.append("entry.1221870114", form.fullName);
    formData.append("entry.698807122", form.mlbbId);
    formData.append("entry.1253661770", form.mlbbServer);
    formData.append("entry.1432545897", form.ign);
    formData.append("entry.295064081", form.school);
    formData.append("entry.1099317544", form.entryLink);
    formData.append("entry.369093009", form.chsl);

    fetch(formURL, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        setShowModal(true); // show success modal
        setForm({
          fullName: "",
          mlbbId: "",
          mlbbServer: "",
          ign: "",
          school: "",
          entryLink: "",
          chsl: "",
        });
        // Optionally uncheck mechanics if you want the user to re-open it next time:
        // setMechanicsChecked(false);
      })
      .catch((err) => console.error("Error submitting form:", err));
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="NEXT Spoof" />
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 pt-5 mt-[-55px] md:mt-[-70px]">
        {/* Logo */}
        <img
            src="/NEXT-FLICKS-logo.png"
            alt="NEXTSpoof Logo"
            className="w-[250px] h-[200px] md:w-[400px] md:h-[320px] mt-5 block mx-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 5px rgba(255,255,255,0.7)) drop-shadow(0 0 10px rgba(255,255,255,0.5))",
            }}
        />

        {/* Card */}
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 backdrop-blur-md border border-black mt-[-10px] mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-center text-black mb-5 tracking-wide">
            NEXT Spoof Submission
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name", name: "fullName", placeholder: "Full name" },
              { label: "MLBB ID (ie.9923103)", name: "mlbbId", placeholder: "MLBB ID (ie.9923103)" },
              { label: "MLBB Server (ie.5932)", name: "mlbbServer", placeholder: "MLBB Server (ie.5932)" },
              { label: "IGN", name: "ign", placeholder: "IGN" },
              { label: "School Name / Community", name: "school", placeholder: "School or Community" },
              { label: "Entry Link", name: "entryLink", placeholder: "Link of your entry" },
            ].map((field, idx) => (
              <div key={idx}>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-black text-black placeholder-gray-500 
                            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 
                            focus:shadow-[0_0_10px_2px_rgba(250,204,21,0.7)] transition text-center"
                />
              </div>
            ))}

            {/* CH/SL Dropdown */}
            <div>
              <select
                name="chsl"
                value={form.chsl}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-black text-black placeholder-gray-500 
                          focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 
                          focus:shadow-[0_0_10px_2px_rgba(250,204,21,0.7)] transition text-center"
              >
                <option value="" disabled>
                  Are you part of CH or SL?
                </option>
                <option value="CH">Community Heroes</option>
                <option value="SL">Student Leaders</option>
              </select>
            </div>

            {/* Mechanics agreement */}
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={mechanicsChecked}
                  onChange={() => {
                    // If not yet checked, open modal (checking is only via modal Done)
                    if (!mechanicsChecked) {
                      setShowMechanicsModal(true);
                    } else {
                      // allow unchecking if user wants to revoke agreement
                      setMechanicsChecked(false);
                    }
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setShowMechanicsModal(true)}
                  className="text-sm text-black underline"
                >
                  {mechanicsChecked
                    ? "I have read and understood the mechanics, and I agree on it."
                    : "Please read the Mechanics"}
                </button>
              </div>

              {errorMsg && (
                <div className="mt-2 w-full px-3 py-2 border border-red-500 bg-red-50 text-red-600 text-sm rounded-xl shadow-md text-center">
                  {errorMsg}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl shadow-lg hover:opacity-90 transition"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Submission Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-black text-white p-6 sm:p-8 rounded-2xl shadow-xl text-center w-full max-w-xs sm:max-w-md border border-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Registration Submitted Successfully!
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-none bg-yellow-300 text-gray-800 font-bold cursor-pointer text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Mechanics modal (separate component) */}
        {showMechanicsModal && (
          <MechanicsModal
            onClose={() => setShowMechanicsModal(false)}
            onDone={() => {
              setMechanicsChecked(true);
            }}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
}
