import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";
import BG from "./BG.png";
import FFLogo from "./FF2xMSL_logo.png";
import { User, Hash, Globe, Link as LinkIcon } from "lucide-react";
import { Link } from "@inertiajs/react";
import MechanicsFFBattleEmote from "./mechanicsFFBattleEmote.jsx";

export default function FFBattleEnote() {
  const [form, setForm] = useState({
    fullname: "",
    mlbbid: "",
    mlbbserver: "",
    ign: "",
    fblink: "",
    fbpost: "",
    agree: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [showMechanics, setShowMechanics] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("entry.1221870114", form.fullname);
    formData.append("entry.698807122", form.mlbbid);
    formData.append("entry.1253661770", form.mlbbserver);
    formData.append("entry.233770124", form.ign);
    formData.append("entry.1933347602", form.fblink);
    formData.append("entry.1579063636", form.fbpost);
    formData.append("entry.2102359487", form.agree ? "Yes" : "No");

    await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSdU1OrHAlBSEsSOMiUwU8uN_jTzjxYuuIUu95SS-2lWL6RYew/formResponse",
      
      { method: "POST", mode: "no-cors", body: formData }
    );

    // auto clear form
    setForm({
        fullname: "",
        mlbbid: "",
        mlbbserver: "",
        ign: "",
        fblink: "",
        fbpost: "",
        agree: false,
    });

    setShowModal(true);
  };

  return (
    <AuthenticatedLayout>
      <Head title="FF25 Battle Emote Registration" /> 
      <Helmet>
        <title>FF25 Battle Emote Registration</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div
        className="relative z-50 min-h-screen flex flex-col items-center justify-start text-[#1a1f7a] p-4"
        style={{
          backgroundImage: `url(${BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* <Link href="/FF25"> */}
        <Link href="#">
          <img 
            src={FFLogo} 
            alt="FF25 MSL Logo"
            className="w-64 sm:w-80 drop-shadow-lg mb-6 cursor-pointer" 
          />
        </Link>

        {/* <div className="rounded-2xl p-6 w-full max-w-2xl shadow-xl mx-auto border-2 border-pink-500 bg-yellow-300/80 backdrop-blur-md"> */}
        <div className="rounded-2xl p-5 sm:p-8 w-full max-w-sm sm:max-w-3xl shadow-lg mx-auto border-2 border-pink-500 bg-yellow-300/80 backdrop-blur-md">
          <h2 className="text-center text-3xl font-bold text-pink-600 mb-6">
            FF BATTLE EMOTE REGISTRATION
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* FULL NAME */}
            <div>
              <label className="font-bold text-pink-700">Full Name</label>
              <div className="flex items-center bg-white p-3 rounded-xl border border-yellow-300">
                <User className="text-[#1a1f7a] w-5 h-5" />
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="bg-transparent w-full outline-none text-[#1a1f7a] pl-3 placeholder-[#1a1f7a] ml-3"
                />
              </div>
            </div>

            {/* MLBB ID */}
            <div>
              <label className="font-bold text-pink-700">MLBB ID</label>
              <div className="flex items-center  bg-white p-3 rounded-xl border border-yellow-300">
                <Hash className=" text-[#1a1f7a] w-5 h-5" />
                <input
                  type="text"
                  name="mlbbid"
                  value={form.mlbbid}
                  onChange={handleChange}
                  required
                  placeholder="Enter MLBB ID"
                  className="bg-transparent w-full outline-none  text-[#1a1f7a] pl-3  placeholder-[#1a1f7a] ml-3"
                />
              </div>
            </div>

            {/* MLBB SERVER */}
            <div>
              <label className="font-bold text-pink-700">MLBB Server</label>
              <div className="flex items-center  bg-white p-3 rounded-xl border border-yellow-300">
                <Globe className=" text-[#1a1f7a] w-5 h-5" />
                <input
                  type="text"
                  name="mlbbserver"
                  value={form.mlbbserver}
                  onChange={handleChange}
                  required
                  placeholder="Enter MLBB Server"
                  className="bg-transparent w-full outline-none  text-[#1a1f7a] pl-3  placeholder-[#1a1f7a] ml-3"
                />
              </div>
            </div>

            {/* IGN */}
            <div>
              <label className="font-bold text-pink-700">In-Game Name (IGN)</label>
              <div className="flex items-center  bg-white p-3 rounded-xl border border-yellow-300">
                <User className=" text-[#1a1f7a] w-5 h-5" />
                <input
                  type="text"
                  name="ign"
                  value={form.ign}
                  onChange={handleChange}
                  required
                  placeholder="Enter your IGN"
                  className="bg-transparent w-full outline-none  text-[#1a1f7a] pl-3  placeholder-[#1a1f7a] ml-3"
                />
              </div>
            </div>

            {/* FACEBOOK LINK */}
            <div>
              <label className="font-bold text-pink-700">Facebook Profile Link</label>
              <div className="flex items-center  bg-white p-3 rounded-xl border border-yellow-300">
                <LinkIcon className=" text-[#1a1f7a] w-5 h-5" />
                <input
                  type="url"
                  name="fblink"
                  value={form.fblink}
                  onChange={handleChange}
                  required
                  placeholder="Paste your FB Profile link"
                  className="bg-transparent w-full outline-none  text-[#1a1f7a] pl-3  placeholder-[#1a1f7a] ml-3"
                />
              </div>
            </div>

            {/* FACEBOOK POST */}
            <div>
              <label className="font-bold text-pink-700">Facebook Post Link</label>
              <div className="flex items-center  bg-white p-3 rounded-xl border border-yellow-300">
                <LinkIcon className=" text-[#1a1f7a] w-5 h-5" />
                <input
                  type="url"
                  name="fbpost"
                  value={form.fbpost}
                  onChange={handleChange}
                  required
                  placeholder="Paste your FB post link"
                  className="bg-transparent w-full outline-none  text-[#1a1f7a] pl-3  placeholder-[#1a1f7a] ml-3"
                />
              </div>
            </div>

            {/* AGREEMENT CHECKBOX */}
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-yellow-300">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, agree: e.target.checked }))
                }
                required
                className="w-5 h-5 mt-1 text-pink-600"
              />

              <label className="text-[#1a1f7a] font-semibold">
                I agree to the{" "}
                <span
                  onClick={() => setShowMechanics(true)}
                  className="text-pink-600 underline cursor-pointer"
                >
                  game mechanics.
                </span>
              </label>
            </div>


            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full mt-4 bg-pink-600 hover:bg-pink-700 transition p-3 rounded-xl  text-white font-bold text-lg shadow-lg"
            >
              SUBMIT ENTRY
            </button>
          </form>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl text-center max-w-xs">
              <h3 className="text-xl font-bold text-pink-600 mb-2">
                Registration Submitted!
              </h3>
              <p className="text-gray-700 mb-4">
                Thank you for submitting your FF Battle Emote registration!
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-pink-600  text-[#1a1f7a] w-full py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showMechanics && (
          <MechanicsFFBattleEmote onClose={() => setShowMechanics(false)} />
        )}

      </div>
    </AuthenticatedLayout>
  );
}
