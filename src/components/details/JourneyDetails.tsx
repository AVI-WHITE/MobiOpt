import React from 'react';
import { Journey, TransportMode } from '../../types';
import { calculatePassengerCost } from '../../services/optimizerEngine';
import { 
  Clock, 
  Ticket, 
  Navigation, 
  AlertTriangle, 
  Sparkles, 
  Bookmark, 
  Layers,
} from 'lucide-react';

interface JourneyDetailsProps {
  journey: Journey;
  passengers: number;
  isSimulatingDelay: boolean;
  onSimulateDelay: () => void;
  onAcceptAlternative?: () => void;
  onBookPass: () => void;
  onStartTracking: () => void;
  onSaveCommute: () => void;
  onClose: () => void;
}

const MODE_BADGE_STYLE: Record<TransportMode, { bg: string; text: string; icon: string }> = {
  walk: { bg: 'bg-amber-100', text: 'text-amber-900', icon: '🚶' },
  bicycle: { bg: 'bg-emerald-100', text: 'text-emerald-900', icon: '🚲' },
  auto: { bg: 'bg-orange-100', text: 'text-orange-900', icon: '🛺' },
  cab: { bg: 'bg-orange-200', text: 'text-orange-950', icon: '🚖' },
  bus: { bg: 'bg-blue-100', text: 'text-blue-900', icon: '🚌' },
  metro: { bg: 'bg-amber-100', text: 'text-amber-950', icon: '🚇' },
  train: { bg: 'bg-indigo-100', text: 'text-indigo-900', icon: '🚆' },
  shared_cab: { bg: 'bg-sky-100', text: 'text-sky-900', icon: '🚐' },
  park_and_ride: { bg: 'bg-slate-100', text: 'text-slate-900', icon: '🅿️' },
  e_rickshaw: { bg: 'bg-teal-100', text: 'text-teal-900', icon: '🛺' },
};

export const JourneyDetails: React.FC<JourneyDetailsProps> = ({
  journey,
  passengers,
  isSimulatingDelay,
  onSimulateDelay,
  onAcceptAlternative,
  onBookPass,
  onStartTracking,
  onSaveCommute,
}) => {
  const { total: totalCost } = calculatePassengerCost(journey, passengers);

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 shadow-elevated border border-slate-200/90 flex flex-col h-full overflow-y-auto">
      
      {/* Header with Title, 5-Star Eco Rating & MobiOpt Score */}
      <div className="border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${journey.badgeColor}`}>
              {journey.badge}
            </span>
            
            {/* 5-Star Eco Visual */}
            <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center gap-1">
              <span className="text-emerald-700">Eco:</span>
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < journey.ecoStars ? 'text-amber-500 font-bold' : 'text-slate-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-emerald-800">({journey.ecoStars}.0)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">MobiOpt Score:</span>
            <span className="text-xl font-black text-brand-600">
              {journey.mobiOptScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </span>
          </div>
        </div>

        <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
          {journey.title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {journey.summary}
        </p>

        {/* 3 Key Metric Cards */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-3 text-center">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Duration</div>
            <div className="text-base font-black text-slate-900 mt-0.5">{journey.totalDurationMinutes} min</div>
          </div>
          <div className="border-x border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">
              {passengers > 1 ? `Total (${passengers}p)` : 'Total Fare'}
            </div>
            <div className="text-base font-black text-slate-900 mt-0.5">₹{totalCost}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase">Wait Range</div>
            <div className="text-sm font-black text-slate-800 mt-0.5">{journey.totalWaitMinutes} min</div>
            <div className="text-[9px] text-slate-500">{journey.waitRangeSummary.split('(')[0]}</div>
          </div>
        </div>
      </div>

      {/* Dynamic Real-Time Re-Optimization Simulation Trigger */}
      <div className="mb-5">
        {!isSimulatingDelay ? (
          <button
            type="button"
            onClick={onSimulateDelay}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Simulate DMRC Signal Delay (Demo AI Reroute)</span>
          </button>
        ) : (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 text-xs shadow-md">
            <div className="flex items-center gap-2 text-rose-900 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>AI Disruption Alert: DMRC Yellow Line Signal Maintenance (+20m at Green Park)</span>
            </div>
            <p className="text-slate-600 text-[11px] mb-3">
              MobiOpt AI has dynamically rerouted via Magenta + Violet Line Express, saving 12 minutes!
            </p>
            
            {onAcceptAlternative && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onAcceptAlternative}
                  className="flex-1 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Accept New Journey (Saves 12m)</span>
                </button>
                <button
                  type="button"
                  onClick={onSimulateDelay}
                  className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition"
                >
                  Keep Current
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step-by-Step Multimodal Timeline with Breakup Points */}
      <div className="flex-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>Inspected Route Sub-Legs & Breakup Points</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            {journey.subTickets.length} Segment Passes
          </span>
        </h3>

        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          
          {/* Origin Starting Point */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white shadow">
              ●
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>{journey.segments[0].etaRange.departureWindow} • START</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">Origin</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                {journey.segments[0].from}
              </p>
            </div>
          </div>

          {/* Individual Segment Steps */}
          {journey.segments.map((seg, idx) => {
            const badge = MODE_BADGE_STYLE[seg.mode] || MODE_BADGE_STYLE.walk;

            return (
              <div key={seg.id || idx} className="relative">
                <div className={`absolute -left-6 top-2 w-5 h-5 rounded-full ${badge.bg} flex items-center justify-center text-[11px] ring-4 ring-white shadow`}>
                  {badge.icon}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-subtle hover:border-brand-300 transition">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                      {badge.icon} {seg.mode} • {seg.durationMinutes} min
                    </span>
                    <span className="text-[11px] font-bold text-slate-900">
                      {seg.costINR > 0 ? `₹${seg.costINR * (seg.mode === 'bus' || seg.mode === 'metro' ? passengers : 1)}` : 'Free'}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-800">
                    {seg.operator}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {seg.instructions || `${seg.from} ➔ ${seg.to}`}
                  </div>

                  {seg.platformOrGate && (
                    <div className="mt-1 text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded inline-block">
                      {seg.platformOrGate}
                    </div>
                  )}

                  {/* Arrival ETA Window & Wait Time Range */}
                  <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium">
                    <div>
                      <span className="text-slate-400">ETA Window:</span> <b className="text-slate-700">{seg.etaRange.arrivalWindow}</b>
                    </div>
                    <div>
                      <span className="text-slate-400">Wait Range:</span> <b className="text-brand-700">{seg.etaRange.waitRange}</b>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Destination Point */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white shadow">
              🏁
            </div>
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-brand-900">
                <span>{journey.segments[journey.segments.length - 1].etaRange.arrivalWindow} • ARRIVAL</span>
                <span className="text-[10px] text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded font-bold">Goal</span>
              </div>
              <p className="text-xs font-semibold text-brand-900 mt-0.5">
                {journey.segments[journey.segments.length - 1].to}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Sub-Tickets Breakdown */}
      <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-600" />
            <span>Integrated Multimodal Passes</span>
          </span>
          <span className="text-[10px] font-extrabold text-brand-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
            {journey.subTickets.length} Discrete Tickets
          </span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-600">
          {journey.subTickets.map((tkt, i) => (
            <div key={tkt.id} className="flex justify-between items-center bg-white p-1.5 rounded-lg border border-slate-100">
              <span>{i + 1}. {tkt.title} ({tkt.operator})</span>
              <span className="font-bold text-slate-900">₹{tkt.fareINR * (tkt.mode === 'metro' || tkt.mode === 'bus' ? passengers : 1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBookPass}
            className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-md shadow-brand-500/25 text-xs flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99]"
          >
            <Ticket className="w-4 h-4 text-amber-300" />
            <span>Generate {journey.subTickets.length} Multimodal Passes</span>
          </button>

          <button
            type="button"
            onClick={onStartTracking}
            className="py-2.5 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live GPS</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onSaveCommute}
          className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
        >
          <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
          <span>Save Route to Daily Commute Routine</span>
        </button>
      </div>

    </div>
  );
};
