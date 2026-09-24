import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsFF25.jsx";
import BG from "./BG.png";
import FFLogo from "./FF2xMSL_logo.png";
import { User, Hash, Globe, Link as LinkIcon, Image as ImageIcon, FileText } from "lucide-react";
import { Link } from "@inertiajs/react";
import MechanicsFFFreedomWall from "./mechanicsFFFreedomWall.jsx";

export default function FFFreedomWall() {
  const [form, setForm] = useState({
    fullname: "",
    mlbbid: "",
    mlbbserver: "",
    ign: "",
    fblink: "",
    story: "",
    picture: "",
    codename: "",
    agree: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [showMechanics, setShowMechanics] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("entry.1221870114", form.fullname);
    formData.append("entry.698807122", form.mlbbid);
    formData.append("entry.1253661770", form.mlbbserver);
    formData.append("entry.320985960", form.ign);
    formData.append("entry.1194636185", form.fblink);
    formData.append("entry.268110709", form.story);
    formData.append("entry.1933308767", form.picture);
    formData.append("entry.1180792450", form.codename);
    formData.append("entry.1795577190", form.agree ? "Yes" : "No");

    await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSeohjDp5OjEwBs_3aqq-7VmfGg8zUsPzxr6gk2Yu0zjFAzL0g/formResponse",
      { method: "POST", mode: "no-cors", body: formData }
    );

    // auto clear
    setForm({
      fullname: "",
      mlbbid: "",
      mlbbserver: "",
      ign: "",
      fblink: "",
      story: "",
      picture: "",
      codename: "",
      agree: false,
    });

    setShowModal(true);
  };

  return (
    <AuthenticatedLayout>
      <Head title="FF25 Freedom Wall Entry" />

      <Helmet>
        <title>FF25 Freedom Wall Registration</title>
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
        <Link href="/FF25">
          <img 
            src={FFLogo} 
            alt="FF25 MSL Logo"
            className="w-64 sm:w-80 drop-shadow-lg mb-6 cursor-pointer" 
          />
        </Link>

        <div className="rounded-2xl p-5 sm:p-8 w-full max-w-sm sm:max-w-3xl shadow-lg mx-auto border-2 border-yellow-300/80 bg-pink-500 backdrop-blur-md">
          <h2 className="text-center text-3xl font-bold text-yellow-300 mb-6">
            FF FREEDOM WALL REGISTRATION
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FULL NAME */}
            <div>
              <label className="font-bold text-yellow-300">Full Name</label>
              <div className="flex items-center bg-white p-3 rounded-xl border border-pink-500">
                <User className="text-[#1a1f7a] w-5 h-5" />
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="bg-transparent w-full outline-none ml-3 text-[#1a1f7a]"
                />
              </div>
            </div>

            {/* MLBB ID */}
            <div>
              <label className="font-bold text-yellow-300">MLBB ID</label>
              <div className="flex items-center bg-white p-3 rounded-xl border border-pink-500">
                <Hash className="text-[#1a1f7a] w-5 h-5" />
                <input
                  type="text"
                  name="mlbbid"
                  value={form.mlbbid}
                  onChange={handleChange}
                  required
                  placeholder="Enter MLBB ID"
                  className="bg-transparent w-full outline-none ml-3 text-[#1a1f7a]"
                />
              </div>
            </div>

            {/* SERVER */}
            <div>
              <label className="font-bold  text-yellow-300">MLBB Server</label>
              <div className="flex items-center bg-white p-3 rounded-xl border border-pink-500">
                <Globe className="text-[#1a1f7a] w-5 h-5" />
                <input
                  type="text"
                  name="mlbbserver"
                  value={form.mlbbserver}
                  onChange={handleChange}
                  required
                  placeholder="Enter server"
                  className="bg-transparent w-full outline-none ml-3 text-[#1a1f7a]"
                />
              </div>
            </div>

            {/* IGN */}
            <div>
              <label className="font-bold  text-yellow-300">In-Game Name (IGN)</label>
              <div className="flex items-center bg-white p-3 rounded-xl border border-pink-500">
                <User className="text-[#1a1f7a] w-5 h-5" />
                <input
                  type="text"
                  name="ign"
                  value={form.ign}
                  onChange={handleChange}
                  required
                  placeholder="Enter your IGN"
                  className="bg-transparent w-full outline-none ml-3 text-[#1a1f7a]"
                />
              </div>
            </div>

            {/* FB LINK */}
            <div>
              <label className="font-bold  text-yellow-300">Facebook Profile Link</label>
              <div className="flex items-center bg-white p-3 rounded-xl border border-pink-500">
                <LinkIcon className="text-[#1a1f7a] w-5 h-5" />
                <input
                  type="url"
                  name="fblink"
                  value={form.fblink}
                  onChange={handleChange}
                  required
                  placeholder="Paste your profile link"
                  className="bg-transparent w-full outline-none ml-3 text-[#1a1f7a]"
                />
              </div>
            </div>

            {/* STORY */}
            <div>
              <label className="font-bold text-yellow-300">Friends Fest Story</label>
              <div className="flex items-start bg-white p-3 rounded-xl border border-pink-500">
                {/* Changed items-center to items-start so the icon stays at the top */}
                <FileText className="text-[#1a1f7a] w-5 h-5 mt-1" />
                <textarea
                  name="story"
                  value={form.story}
                  onChange={handleChange}
                  required
                  placeholder="Tell your Friends Fest story"
                  rows={4} // Sets the initial height
                  className="bg-transparent w-full outline-none ml-3 text-[#1a1f7a] resize-y" 
                  // 'resize-y' makes it stretchable vertically
                />
              </div>
            </div>

            {/* PICTURE UPLOAD */}
            <div>
              <label className="font-bold  text-yellow-300">Picture with the Friend (Link of the Photos)</label>
              <div className="flex items-center bg-white p-3 rounded-xl border border-pink-500">
                <ImageIcon className="text-[#1a1f7a] w-5 h-5" />
                <input
                  type="url"
                  name="picture"
                  value={form.picture}
                  onChange={handleChange}
                  required
                  placeholder="Your picture with your friend"
                  className="bg-transparent w-full outline-none ml-3 text-[#1a1f7a]"
                />
              </div>
            </div>

            {/* CODENAME */}
            <div>
              <label className="font-bold  text-yellow-300">Code Name</label>
              <div className="flex items-center bg-white p-3 rounded-xl border border-pink-500">
                <User className="text-[#1a1f7a] w-5 h-5" />
                <input
                  type="text"
                  name="codename"
                  value={form.codename}
                  onChange={handleChange}
                  required
                  placeholder="Your codename"
                  className="bg-transparent w-full outline-none ml-3 text-[#1a1f7a]"
                />
              </div>
            </div>

            {/* AGREEMENT CHECKBOX */}
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-pink-500">
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

            <button
              type="submit"
              className="w-full mt-4 bg-yellow-300/80  hover:bg-yellow-400 transition p-3 rounded-xl text-pink-700 font-bold text-lg shadow-lg"
            >
              SUBMIT ENTRY
            </button>
          </form>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl text-center max-w-xs">
              <h3 className="text-xl font-bold text-pink-600 mb-2">Entry Submitted!</h3>
              <p className="text-gray-700 mb-4">
                Thank you for submitting your Friends Fest Freedom Wall Entry!
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-pink-600 text-white w-full py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showMechanics && (
          <MechanicsFFFreedomWall onClose={() => setShowMechanics(false)} />
        )}
        
      </div>
    </AuthenticatedLayout>
  );
}
