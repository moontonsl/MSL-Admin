import React from 'react';
import { Lock } from 'lucide-react';

/**
 * Premium roster lock callout with purple→yellow gradient border and dark glass inner panel.
 */
export default function RosterLockNotice({
  title = 'Roster Lock: Mar 20, 2026',
  subtext = 'Editing your roster will be disabled after this date.',
}) {
  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-purple-600/50 to-[#FFC107]/50 max-w-sm">
      <div className="bg-[#111111]/95 backdrop-blur-sm rounded-2xl p-3 sm:p-4 flex items-start sm:items-center gap-3 h-full w-full">
        <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFC107] shrink-0 mt-0.5 sm:mt-0" aria-hidden />
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="text-[#FFC107] font-bold text-sm tracking-wide">{title}</h4>
          <p className="text-gray-400 text-xs leading-relaxed">{subtext}</p>
        </div>
      </div>
    </div>
  );
}
