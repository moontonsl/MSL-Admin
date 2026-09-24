import React, { useState } from "react";
import { Gem, School, HeartHandshake, Banknote } from "lucide-react";

// Utility for formatting diamonds
const fmt = new Intl.NumberFormat('en-US');
function formatDiamonds(n) {
    return fmt.format(n) + ' Diamonds';
}

// Diamonds Support Calculator Component
export function DiamondsSupportCalculator() {
    const [type, setType] = useState('tournament');
    const [scope, setScope] = useState('department');
    const [tier, setTier] = useState('I');
    const matrix = {
        department: { I:{tournament:10000,non:7000}, II:{tournament:10000,non:7000}, III:{tournament:10000,non:7000}, super:{tournament:10000,non:7000} },
        college: { I:{tournament:10000,non:5000}, II:{tournament:12000,non:6000}, III:{tournament:13500,non:7000}, super:{tournament:15000,non:7500} },
        university: { I:{tournament:12000,non:6000}, II:{tournament:13500,non:7000}, III:{tournament:15000,non:7500}, super:{tournament:16500,non:8500} },
        system: { I:{tournament:15000,non:7500}, II:{tournament:16500,non:8500}, III:{tournament:18000,non:9500}, super:{tournament:19500,non:10500} },
        nationwide: { I:{tournament:20000,non:10000}, II:{tournament:25000,non:12500}, III:{tournament:30000,non:15000}, super:{tournament:32000,non:16000} }
    };
    const maxDiamonds = (() => {
        const base = matrix[scope][tier][type];
        if(scope==='department') return Math.min(base,10000);
        return base;
    })();

    return (
        <section className="bg-white/5 rounded-2xl p-8 ring-1 ring-zinc-800 mb-8">
            <h3 className="font-['Montserrat'] font-bold mb-6 flex items-center gap-2 text-[20px] sm:text-[24px] lg:text-[30px]">
                <Gem className="w-7 h-7 text-[#F2C21A]" /> Diamonds Support
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Type of Event</label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="tournament">Tournament</option>
                        <option value="non">Non-Tournament</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Scope</label>
                    <select
                        value={scope}
                        onChange={e => setScope(e.target.value)}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="department">Department-wide</option>
                        <option value="college">College-wide</option>
                        <option value="university">University-wide</option>
                        <option value="system">System-wide</option>
                        <option value="nationwide">Nationwide</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Tier</label>
                    <select
                        value={tier}
                        onChange={e => setTier(e.target.value)}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="I">Level I</option>
                        <option value="II">Level II</option>
                        <option value="III">Level III</option>
                        <option value="super">Super School</option>
                    </select>
                </div>
            </div>
            <div className="mt-6 p-4 bg-zinc-900 rounded-xl border border-[#F2C21A] flex flex-col items-center shadow-lg">
                <p className="font-['Montserrat'] font-medium text-[12px] sm:text-[16px] lg:text-[16px] text-gray-300 mb-1 text-center">
                    Max Allowable Budget
                </p>
                <p className="font-['Montserrat'] font-bold text-2xl text-[#F2C21A] text-center">
                    {formatDiamonds(maxDiamonds)}
                </p>
            </div>
        </section>
    );
}

// SHS Events Calculator
export function ShsEventsCalculator() {
    const [intramurals, setIntramurals] = useState(false);
    const [type, setType] = useState('tournament');
    const [setup, setSetup] = useState('on-ground');
    const [livestream, setLivestream] = useState('with');

    let maxDiamonds = 0;
    if (intramurals) {
        maxDiamonds = 25000;
    } else if (type === 'tournament') {
        if (setup === 'on-ground') maxDiamonds = 8000;
        else if (setup === 'online') maxDiamonds = livestream === 'with' ? 7000 : 5000;
    } else {
        maxDiamonds = 4000;
    }

    return (
        <section className="bg-white/5 rounded-2xl p-8 ring-1 ring-zinc-800 mb-8">
            <h3 className="font-['Montserrat'] font-bold mb-6 flex items-center gap-2 text-[20px] sm:text-[24px] lg:text-[30px]">
                <School className="w-7 h-7 text-[#F2C21A]" /> Senior High School Events
            </h3>
            <label className="inline-flex items-center gap-3 mb-6 font-['Montserrat'] font-medium text-[12px] sm:text-[16px] lg:text-[16px]">
                <input type="checkbox" checked={intramurals} onChange={e => setIntramurals(e.target.checked)} className="w-5 h-5 accent-[#F2C21A]" />
                <span>High School Intramurals</span>
            </label>
            <div className={`grid md:grid-cols-3 gap-6 ${intramurals ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Type of Event</label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="tournament">Tournament</option>
                        <option value="non">Non-Tournament</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Setup</label>
                    <select
                        value={setup}
                        onChange={e => setSetup(e.target.value)}
                        disabled={type !== 'tournament'}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="on-ground">Onsite</option>
                        <option value="online">Online</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Livestream</label>
                    <select
                        value={livestream}
                        onChange={e => setLivestream(e.target.value)}
                        disabled={type !== 'tournament'}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="with">With</option>
                        <option value="without">Without</option>
                    </select>
                </div>
            </div>
            <div className="mt-6 p-4 bg-zinc-900 rounded-xl border border-[#F2C21A] flex flex-col items-center shadow-lg">
                <p className="font-['Montserrat'] font-medium text-[12px] sm:text-[16px] lg:text-[16px] text-gray-300 mb-1 text-center">
                    Max Allowable Budget
                </p>
                <p className="font-['Montserrat'] font-bold text-2xl text-[#F2C21A] text-center">
                    {formatDiamonds(maxDiamonds)}
                </p>
            </div>
        </section>
    );
}

// Events for a Cause Calculator
export function EventsForCauseCalculator() {
    const [setup, setSetup] = useState('on-ground');
    const [teamsIdx, setTeamsIdx] = useState(1);

    const teamBands = ['4-7', '8-15', '>16'];
    const band = teamBands[teamsIdx - 1];
    const matrix = {
        'on-ground': { '4-7': 5000, '8-15': 7000, '>16': 10000 },
        'online': { '4-7': 4000, '8-15': 5000, '>16': 7000 },
        'other': { '4-7': 2000, '8-15': 3000, '>16': 4000 }
    };
    const maxDiamonds = matrix[setup][band];

    return (
        <section className="bg-white/5 rounded-2xl p-8 ring-1 ring-zinc-800 mb-8">
            <h3 className="font-['Montserrat'] font-bold mb-6 flex items-center gap-2 text-[20px] sm:text-[24px] lg:text-[30px]">
                <HeartHandshake className="w-7 h-7 text-[#F2C21A]" /> Events for a Cause
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Setup</label>
                    <select
                        value={setup}
                        onChange={e => setSetup(e.target.value)}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="on-ground">Onsite</option>
                        <option value="online">Online</option>
                        <option value="other">Others</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Number of Teams</label>
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="1"
                        value={teamsIdx}
                        onChange={e => setTeamsIdx(Number(e.target.value))}
                        className="w-full accent-[#F2C21A]"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>4–7</span><span>8–15</span><span>&gt;16</span>
                    </div>
                </div>
            </div>
            <div className="mt-6 p-4 bg-zinc-900 rounded-xl border border-[#F2C21A] flex flex-col items-center shadow-lg">
                <p className="font-['Montserrat'] font-medium text-[12px] sm:text-[16px] lg:text-[16px] text-gray-300 mb-1 text-center">
                    Max Allowable Budget
                </p>
                <p className="font-['Montserrat'] font-bold text-2xl text-[#F2C21A] text-center">
                    {formatDiamonds(maxDiamonds)}
                </p>
            </div>
        </section>
    );
}

// Monetary Grants Calculator
export function MonetaryGrantsCalculator() {
    const [scope, setScope] = useState('college');
    const [type, setType] = useState('tournament');
    const [setup, setSetup] = useState('on-ground');

    function displayBudget() {
        if (scope === 'nationwide') return 'Varies — pitch deck required';
        if (type === 'tournament') {
            if (scope === 'college') return '₱ 5,000';
            if (scope === 'university') return '₱ 10,000';
            if (scope === 'system') return '₱ 15,000';
        }
        return '₱ 3,000';
    }

    return (
        <section className="bg-white/5 rounded-2xl p-8 ring-1 ring-zinc-800">
            <h3 className="font-['Montserrat'] font-bold mb-6 flex items-center gap-2 text-[20px] sm:text-[24px] lg:text-[30px]">
                <Banknote className="w-7 h-7 text-[#F2C21A]" /> Monetary Grants
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Scope</label>
                    <select
                        value={scope}
                        onChange={e => setScope(e.target.value)}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="college">College-wide</option>
                        <option value="university">University-wide</option>
                        <option value="system">System-wide</option>
                        <option value="nationwide">Nationwide</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Type</label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="tournament">Tournament</option>
                        <option value="non">Non-Tournament</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-['Montserrat'] font-medium">Setup</label>
                    <select
                        value={setup}
                        onChange={e => setSetup(e.target.value)}
                        disabled={type !== 'tournament' || scope === 'nationwide'}
                        className="w-full min-h-[44px] block rounded bg-zinc-900 border border-white/20 py-2 px-3 font-['Montserrat'] font-medium text-white text-[12px] sm:text-[16px] lg:text-[16px] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#F2C21A] transition"
                    >
                        <option value="on-ground">Onsite</option>
                        <option value="online">Online</option>
                    </select>
                </div>
            </div>
            <div className="mt-6 p-4 bg-zinc-900 rounded-xl border border-[#F2C21A] flex flex-col items-center shadow-lg">
                <p className="font-['Montserrat'] font-medium text-[12px] sm:text-[16px] lg:text-[16px] text-gray-300 mb-1 text-center">
                    Max Allowable Budget
                </p>
                <p className="font-['Montserrat'] font-bold text-2xl text-[#F2C21A] text-center">
                    {displayBudget()}
                </p>
            </div>
        </section>
    );
}