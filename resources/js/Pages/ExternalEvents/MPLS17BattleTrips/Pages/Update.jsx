import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayoutEventsBTS17.jsx";
import { Lock, Save, Layout, HelpCircle } from "lucide-react";
import BG from "../Assets/Images/BTMPLS17-BG.png";
import Logo from "../Assets/Images/BTLogo.png";

const DEFAULT_TOPICS = [
    {
        name: "Building Your Brand in Esports",
        description: "Learn the fundamentals of social media and content creation to grow your audience, establish your personal brand, and unlock opportunities in the esports industry.",
        status: "OPEN",
    },
    {
        name: "Career at Moonton Games",
        description: "Explore the many career paths beyond playing professionally and learn how different disciplines come together to create world-class esports experiences.",
        status: "OPEN",
    },
    {
        name: "Data Wins Championships",
        description: "Learn how MPL coaches leverage data, analytics, and strategic preparation to make informed decisions, refine team performance, and gain a competitive edge in today\'s esports landscape.",
        status: "OPEN",
    },
    {
        name: "Esports Journalism",
        description: "Learn how journalists cover the fast-paced world of esports by telling compelling stories, reporting accurately, and documenting the people, teams, and moments that shape the industry.",
        status: "OPEN",
    },
    {
        name: "Finding Your Voice in Esports",
        description: "Discover how MPL casters develop their unique on-air identity, build confidence behind the microphone, and connect with audiences through authentic storytelling and effective communication.",
        status: "OPEN",
    },
    {
        name: "Leveling Up Philippine Esports",
        description: "Explore how organizations like GAB and PESO are shaping the future of Philippine esports through athlete development, governance, and initiatives that support a sustainable and competitive industry.",
        status: "OPEN",
    },
    {
        name: "Pathway to Pro: Pressure Makes Players",
        description: "Discover what it takes to succeed in the world\'s strongest MLBB region as an MPL player shares the challenges, sacrifices, and lessons that transform aspiring competitors into professional champions.",
        status: "OPEN",
    },
    {
        name: "Powering the Future of Esports",
        description: "Discover how technology, connectivity, and innovation are transforming the esports experience and empowering players, fans, and communities to compete and connect like never before.",
        status: "OPEN",
    },
];

export default function Update({ currentTopics }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
        topics: currentTopics?.length ? currentTopics : DEFAULT_TOPICS,
    });

    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleAuth = (e) => {
        e.preventDefault();
        if (data.code === "3054") {
            setIsAuthorized(true);
        } else {
            alert("Invalid Access Code");
        }
    };

    const updateTopic = (index, field, value) => {
        const updatedTopics = [...data.topics];
        updatedTopics[index] = { ...updatedTopics[index], [field]: value };
        setData("topics", updatedTopics);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("MPLS18Battletrips.store"), {
            onSuccess: () => {
                alert("Settings updated successfully!");
                reset("code");
            },
        });
    };

    return (
        <>
            <Head title="Update MPLS18 Battle Trips Settings" />
            <Helmet>
                <title>Update | MPLS18 Battle Trips</title>
            </Helmet>

            <AuthenticatedLayout>
                <div className="relative z-50 min-h-screen flex flex-col items-center justify-center text-white p-4 pt-5 font-['Montserrat'] bg-cover bg-top bg-no-repeat" style={{ backgroundImage: `url(${BG})`, backgroundAttachment: "fixed" }}>
                    <img src={Logo} alt="Battle Trips Logo" className="w-48 mb-6" />

                    <div className="w-full max-w-3xl">
                        {!isAuthorized ? (
                            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#e59639] text-black">
                                <div className="flex items-center justify-center w-16 h-16 bg-[#e59639]/10 rounded-full mx-auto mb-6">
                                    <Lock className="text-[#e59639]" size={32} />
                                </div>
                                <h1 className="text-2xl font-bold text-center mb-2">Restricted Access</h1>
                                <p className="text-gray-500 text-center mb-8 text-sm">Please enter the security code to update event settings.</p>
                                
                                <form onSubmit={handleAuth} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-gray-700">Security Code</label>
                                        <input
                                            type="password"
                                            value={data.code}
                                            onChange={(e) => setData("code", e.target.value)}
                                            placeholder="Enter 4-digit code"
                                            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#e59639] outline-none transition-all text-center text-2xl tracking-[1em] font-mono"
                                            maxLength={4}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-[#e59639] hover:bg-[#d47f20] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#e59639]/20 transition-all active:scale-95"
                                    >
                                        Authorize Access
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#e59639] text-black">
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="text-2xl font-bold">Update Content</h1>
                                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-tighter">Authorized</div>
                                </div>

                                <form onSubmit={submit} className="space-y-6">
                                    <div className="text-center mb-6">
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <HelpCircle size={18} className="text-[#e59639]" />
                                            <h2 className="text-lg font-bold uppercase tracking-widest">Topics Configuration</h2>
                                        </div>
                                        <p className="text-sm text-gray-500">Manage the topic dropdown options and status for the public MPLS18 Battle Trips registration form.</p>
                                    </div>

                                    {data.topics.map((topic, index) => (
                                        <div key={`${topic.name}-${index}`} className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
                                            <div className="grid gap-4 sm:grid-cols-[1fr_150px] mb-4">
                                                <div>
                                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Topic Name</label>
                                                    <input
                                                        type="text"
                                                        value={topic.name}
                                                        onChange={(e) => updateTopic(index, 'name', e.target.value)}
                                                        className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#e59639] outline-none"
                                                    />
                                                    {errors[`topics.${index}.name`] && <p className="text-red-500 text-xs mt-1">{errors[`topics.${index}.name`]}</p>}
                                                </div>

                                                <div>
                                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Status</label>
                                                    <select
                                                        value={topic.status}
                                                        onChange={(e) => updateTopic(index, 'status', e.target.value)}
                                                        className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#e59639] outline-none bg-white"
                                                    >
                                                        <option value="OPEN">OPEN</option>
                                                        <option value="FULL">FULL</option>
                                                        <option value="CLOSED">CLOSED</option>
                                                    </select>
                                                    {errors[`topics.${index}.status`] && <p className="text-red-500 text-xs mt-1">{errors[`topics.${index}.status`]}</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-bold uppercase tracking-wider text-gray-700">Description</label>
                                                <textarea
                                                    value={topic.description}
                                                    onChange={(e) => updateTopic(index, 'description', e.target.value)}
                                                    rows={4}
                                                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#e59639] outline-none resize-none"
                                                />
                                                {errors[`topics.${index}.description`] && <p className="text-red-500 text-xs mt-1">{errors[`topics.${index}.description`]}</p>}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-4 space-y-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-[#e59639] hover:bg-[#d47f20] disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#e59639]/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Save size={20} />
                                            {processing ? "Saving Changes..." : "Publish Updates"}
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setIsAuthorized(false)}
                                            className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors"
                                        >
                                            Log Out from Editor
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                    
                    <a href="/MPLS18Battletrips" className="mt-8 text-black/60 hover:text-black text-sm font-medium transition-colors border-b border-transparent hover:border-black/30">
                        View Public Page
                    </a>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
