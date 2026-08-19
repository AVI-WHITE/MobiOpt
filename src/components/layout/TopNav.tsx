import React from 'react';
import { 
  Navigation, 
  Clock, 
  Scale, 
  Ticket,
} from 'lucide-react';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenDailyCommute: () => void;
  onOpenBookings: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  compareCount,
  onOpenCompare,
  onOpenDailyCommute,
  onOpenBookings,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-subtle">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Tagline */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('plan')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Navigation className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                    Mobi<span className="text-brand-600">Opt</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    Delhi NCR Intermodal
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden md:block">
                  One Destination. Multiple Choices. One Optimal Journey.
                </p>
              </div>
            </div>

            {/* Delhi NCR Sub-line */}
            <div className="hidden xl:flex items-center pl-4 border-l border-slate-200 text-[11px] text-slate-500 gap-1.5">
              <span className="font-semibold text-slate-700">DMRC • DTC Electric • E-Rickshaw • Cabs</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'plan'
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-brand-600" />
              <span>Plan Journey</span>
            </button>

            <button
              onClick={onOpenDailyCommute}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Daily Commute</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            </button>

            <button
              onClick={onOpenCompare}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                compareCount > 0
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.2 bg-brand-600 text-white rounded-full text-[10px] font-bold">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenBookings}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sub-Passes & Tickets</span>
            </button>


          </nav>

          {/* Right Action & Status Area */}
          <div className="flex items-center gap-3">
            {/* Live Data Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-700 text-[11px]">
                Live Delhi GTFS & DMRC Data
              </span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
