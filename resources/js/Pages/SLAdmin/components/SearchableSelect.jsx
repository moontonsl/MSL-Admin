import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [open]);

    useEffect(() => {
        const handler = (e) => {
            if (
                buttonRef.current && !buttonRef.current.contains(e.target) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = (options || []).filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (opt) => {
        onChange(opt);
        setOpen(false);
        setSearch('');
    };

    return (
        <div className="relative w-full">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="w-full flex items-center justify-between bg-neutral-700/50 border border-neutral-600/50 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className={value ? 'text-white' : 'text-neutral-400'}>
                    {value || placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {value && (
                        <span
                            onClick={(e) => { e.stopPropagation(); onChange(''); }}
                            className="text-neutral-400 hover:text-white p-0.5 rounded"
                        >
                            <X className="w-3 h-3" />
                        </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {open && createPortal(
                <div
                    ref={dropdownRef}
                    className="bg-neutral-800 border border-neutral-600/50 rounded-lg shadow-xl overflow-hidden"
                    style={{
                        position: 'absolute',
                        top: dropdownPos.top + 4,
                        left: dropdownPos.left,
                        width: dropdownPos.width,
                        zIndex: 9999,
                    }}
                >
                    <div className="p-2 border-b border-neutral-700">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-neutral-700/50 border border-neutral-600/50 rounded px-3 py-1.5 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                        <button
                            onClick={() => handleSelect('')}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${!value ? 'text-blue-400' : 'text-neutral-400'}`}
                        >
                            All
                        </button>
                        {filtered.map(opt => (
                            <button
                                key={opt}
                                onClick={() => handleSelect(opt)}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 transition-colors ${value === opt ? 'text-blue-400 bg-neutral-700/50' : 'text-white'}`}
                            >
                                {opt}
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <div className="px-3 py-3 text-sm text-neutral-400 text-center">No results</div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default SearchableSelect;
