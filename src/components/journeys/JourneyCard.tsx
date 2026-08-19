import React from 'react';
import { Journey, TransportMode } from '../../types';
import { calculatePassengerCost } from '../../services/optimizerEngine';
import { 
  Clock, 
  Footprints, 
  ArrowRight, 
  Check, 
  Plus, 
  ChevronRight, 
  TrendingDown, 
  AlertTriangle,
  Luggage,
  Star
} from 'lucide-react';

interface JourneyCardProps {
  journey: Journey;
  isSelected: boolean;
  onSelect: () => void;
  isCompared: boolean;
  onToggleCompare: (e: React.MouseEvent) => void;
  passengers: number;
  isSimulatingDelay?: boolean;
}

const MODE_ICONS: Record<TransportMode, string> = {
  walk: '🚶',
  bicycle: '🚲',
  auto: '🛺',
  cab: '🚖',
  bus: '🚌',
  metro: '🚇',
  train: '🚆',
  shared_cab: '🚐',
  park_and_ride: '🅿️',
  e_rickshaw: '🛺',
};

const MODE_BG_COLORS: Record<TransportMode, string> = {
  walk: 'bg-amber-100 text-amber-900 border-amber-300',
  bicycle: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  auto: 'bg-orange-100 text-orange-900 border-orange-300',
  cab: 'bg-orange-200 text-orange-950 border-orange-400',
  bus: 'bg-blue-100 text-blue-900 border-blue-300',
  metro: 'bg-amber-100 text-amber-950 border-amber-400',
  train: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  shared_cab: 'bg-sky-100 text-sky-900 border-sky-300',
  park_and_ride: 'bg-slate-100 text-slate-900 border-slate-300',
  e_rickshaw: 'bg-teal-100 text-teal-900 border-teal-300',
};

export const JourneyCard: React.FC<JourneyCardProps> = ({
  journey,
  isSelected,
  onSelect,
  isCompared,
  onToggleCompare,
  passengers,
  isSimulatingDelay,
}) => {
  const { total: totalCost, perPerson: costPerPerson, savingsNote } = calculatePassengerCost(journey, passengers);

  // Check if affected by Yellow Line signal delay simulation
  const hasDelayDisruption = isSimulatingDelay && journey.segments.some(s => s.mode === 'metro') && !journey.isAlternative;

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-2xl p-4 lg:p-5 transition-all duration-200 cursor-pointer border ${
        isSelected
          ? 'border-brand-600 shadow-elevated ring-2 ring-brand-500/20'
          : 'border-slate-200/90 hover:border-brand-300 hover:shadow-card-hover'
      } ${hasDelayDisruption ? 'bg-rose-50/30 border-rose-300' : ''}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        
        {/* Category Badge + 5-Star Eco Rating */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-sm ${journey.badgeColor}`}>
            {journey.badge}
          </span>

          {/* 5-Star Eco Rating Badge */}
          <div className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <span className="text-emerald-700 font-bold">Eco:</span>
            <div className="flex items-center text-amber-500 text-[11px]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < journey.ecoStars ? 'text-amber-500 font-bold' : 'text-slate-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] text-emerald-800 font-bold">({journey.ecoStars}.0)</span>
          </div>

          {journey.isAlternative && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              ✓ Saves 12 min
            </span>
          )}
        </div>

        {/* MobiOpt Score */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">MobiOpt Score</div>
            <div className="text-lg font-black text-slate-900 leading-none mt-0.5">
              <span className="text-brand-600">{journey.mobiOptScore}</span>
              <span className="text-slate-400 text-xs font-normal">/100</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleCompare}
            title={isCompared ? 'Remove from Comparison' : 'Add to Compare (up to 3)'}
            className={`p-1.5 rounded-xl border transition-all flex items-center justify-center ${
              isCompared
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
          >
            {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Multimodal Flow Ribbon */}
      <div className="flex items-center gap-1.5 flex-wrap my-3">
        {journey.segments.map((seg, idx) => (
          <React.Fragment key={seg.id || idx}>
            <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 shadow-subtle ${MODE_BG_COLORS[seg.mode] || 'bg-slate-100'}`}>
              <span>{MODE_ICONS[seg.mode]}</span>
              <span className="capitalize">{seg.mode}</span>
              <span className="text-[10px] opacity-75 font-medium">({seg.durationMinutes}m)</span>
            </div>
            {idx < journey.segments.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100 my-3 text-left">
        
        {/* Duration & Estimated Arrival Window */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Travel Time
          </div>
          <div className="text-base font-black text-slate-900 mt-0.5">
            {hasDelayDisruption ? (
              <span className="text-rose-600 line-through mr-1 text-xs">
                {journey.totalDurationMinutes}m
              </span>
            ) : null}
            <span className={hasDelayDisruption ? 'text-rose-600 font-extrabold' : ''}>
              {hasDelayDisruption ? `${journey.totalDurationMinutes + 20} min` : `${journey.totalDurationMinutes} min`}
            </span>
          </div>
          <div className="text-[10px] font-semibold text-brand-600 mt-0.5">
            {journey.segments[0].etaRange.departureWindow.split('–')[0]} ➔ {journey.segments[journey.segments.length - 1].etaRange.arrivalWindow}
          </div>
        </div>

        {/* Cost */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase">
            {passengers > 1 ? `Total Cost (${passengers}p)` : 'Total Fare'}
          </div>
          <div className="text-base font-black text-slate-900 mt-0.5 flex items-baseline gap-1">
            <span>₹{totalCost}</span>
            {passengers > 1 && (
              <span className="text-[11px] text-slate-500 font-semibold">
                (₹{costPerPerson}/p)
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {journey.subTickets.length} Sub-Tickets
          </div>
        </div>

        {/* Wait Range & Frequency */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase">
            Wait Time Range
          </div>
          <div className="text-sm font-black text-slate-800 mt-0.5">
            {journey.totalWaitMinutes} min
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 truncate">
            {journey.waitRangeSummary.split('(')[0]}
          </div>
        </div>

      </div>

      {/* Secondary Meta Tags: Luggage Suitability, Transfers, Walking */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Luggage Tag */}
          <span className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-md text-[10px] ${
            journey.luggageSuitability === 'excellent' 
              ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' 
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            <Luggage className="w-3 h-3 text-indigo-600" />
            <span>{journey.luggageSuitability === 'excellent' ? 'Luggage Friendly' : 'Moderate Luggage'}</span>
          </span>

          <span>•</span>
          <span><b>{journey.transfersCount}</b> transfers</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Footprints className="w-3 h-3 text-slate-400" />
            <b>{journey.walkingDistanceMeters}m</b>
          </span>
          <span>•</span>
          <span className="text-slate-700 font-semibold">
            <b>{journey.reliabilityScore}%</b> reliability
          </span>
        </div>

        <div className="flex items-center gap-1 font-bold text-brand-600 text-xs group-hover:translate-x-1 transition-transform">
          <span>Inspect</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Group Savings Callout */}
      {savingsNote && (
        <div className="mt-2.5 py-1 px-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>{savingsNote}</span>
        </div>
      )}

      {/* Disruption Alert Warning */}
      {hasDelayDisruption && (
        <div className="mt-2.5 py-1.5 px-2.5 bg-rose-100 border border-rose-300 rounded-lg text-[11px] font-bold text-rose-900 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>DMRC Yellow Line Signal Maintenance (+20 min delay). AI suggests alternative route above.</span>
        </div>
      )}

    </div>
  );
};
