import React, { useState } from 'react';
import { LocationItem, TravelGoal, FilterPreferences, LuggageType } from '../../types';
import { DELHI_LOCATIONS } from '../../data/delhiLocations';
import { 
  ArrowRightLeft, 
  Clock, 
  Users, 
  SlidersHorizontal, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Zap,
  DollarSign,
  Leaf,
  Armchair,
  ShieldCheck,
  Luggage,
  Wind
} from 'lucide-react';

interface SearchPanelProps {
  origin: LocationItem;
  setOrigin: (loc: LocationItem) => void;
  destination: LocationItem;
  setDestination: (loc: LocationItem) => void;
  date: string;
  setDate: (d: string) => void;
  time: string;
  setTime: (t: string) => void;
  passengers: number;
  setPassengers: (p: number) => void;
  preferences: FilterPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<FilterPreferences>>;
  onSearch: () => void;
  isSearching: boolean;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  time,
  setTime,
  passengers,
  setPassengers,
  preferences,
  setPreferences,
  onSearch,
  isSearching,
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleGoalChange = (goal: TravelGoal) => {
    setPreferences(prev => ({ ...prev, goal }));
  };

  const handleLuggageChange = (luggage: LuggageType) => {
    setPreferences(prev => ({ ...prev, luggage }));
  };

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 shadow-elevated border border-slate-200/80 mb-5 transition-all">
      
      {/* Delhi AQI Context Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold flex items-center gap-1.5 border border-amber-300">
            <Wind className="w-3.5 h-3.5 text-amber-700" />
            <span>Delhi AQI: 285 (Poor)</span>
          </span>
          <span className="text-slate-500 font-medium hidden sm:inline">
            • DMRC AC Underground & DTC Electric AC recommended
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-slate-700 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={preferences.avoidPollutionOpenAir}
              onChange={(e) => setPreferences(p => ({ ...p, avoidPollutionOpenAir: e.target.checked }))}
              className="rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
            />
            <span>Prioritize Clean AC Cabins</span>
          </label>
        </div>
      </div>

      {/* Origin, Destination, Time, Passengers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Origin Field */}
        <div className="md:col-span-3.5 relative">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Starting Location (Delhi NCR)
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
            <select
              value={origin.id}
              onChange={(e) => {
                const found = DELHI_LOCATIONS.find(l => l.id === e.target.value);
                if (found) setOrigin(found);
              }}
              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition truncate"
            >
              {DELHI_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} disabled={loc.id === destination.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="hidden md:flex md:col-span-1 justify-center pt-5">
          <button
            type="button"
            onClick={handleSwapLocations}
            title="Swap Origin and Destination"
            className="p-2 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 border border-slate-200 hover:border-brand-300 transition shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Field */}
        <div className="md:col-span-3.5 relative">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Destination (Delhi NCR)
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 w-3 h-3 rounded-full bg-brand-600 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
            <select
              value={destination.id}
              onChange={(e) => {
                const found = DELHI_LOCATIONS.find(l => l.id === e.target.value);
                if (found) setDestination(found);
              }}
              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition truncate"
            >
              {DELHI_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} disabled={loc.id === origin.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Departure Window */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Departure Window
          </label>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
              placeholder="08:30 AM"
            />
          </div>
        </div>

        {/* Passenger Counter */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Travellers</span>
            {passengers >= 3 && (
              <span className="text-[9px] text-brand-600 font-bold bg-brand-50 px-1 rounded">Group Split</span>
            )}
          </label>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5">
            <button
              type="button"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              disabled={passengers <= 1}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs disabled:opacity-40 hover:bg-slate-100 transition"
            >
              -
            </button>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-600" />
              {passengers} {passengers === 1 ? 'Person' : 'People'}
            </span>
            <button
              type="button"
              onClick={() => setPassengers(Math.min(6, passengers + 1))}
              disabled={passengers >= 6}
              className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs disabled:opacity-40 hover:bg-slate-100 transition"
            >
              +
            </button>
          </div>
        </div>

      </div>

      {/* Luggage Row */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Luggage className="w-3.5 h-3.5 text-brand-600" />
            Luggage Baggage:
          </span>

          {[
            { id: 'none', label: '🎒 No Bags' },
            { id: 'small', label: '💼 Cabin Bag' },
            { id: 'medium', label: '🧳 1 Trolley' },
            { id: 'heavy', label: '📦 Heavy (2+ Bags)' },
          ].map((l) => {
            const isSelected = preferences.luggage === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => handleLuggageChange(l.id as LuggageType)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>

        {preferences.luggage === 'heavy' && (
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
            ✓ Favoring Elevator Metro & Direct AC Cabs
          </span>
        )}
      </div>

      {/* Unified Travel Goal & Primary Search Trigger (Unified Priority + Intent) */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        
        {/* Unified Travel Goals */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Travel Goal:
          </span>

          {[
            { id: 'balanced', label: '⚖️ Balanced (Recommended)', icon: Sparkles },
            { id: 'fastest', label: '⚡ Catching Train (Fastest)', icon: Zap },
            { id: 'cheapest', label: '💰 Budget Saver (Cheapest)', icon: DollarSign },
            { id: 'greenest', label: '🌱 100% Eco Green', icon: Leaf },
            { id: 'comfort', label: '🛋️ Max AC Comfort & Family', icon: Armchair },
            { id: 'reliability', label: '🛡️ Avoid Delay Gridlock', icon: ShieldCheck },
          ].map((p) => {
            const isSelected = preferences.goal === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleGoalChange(p.id as TravelGoal)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30 ring-2 ring-brand-500/20'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={onSearch}
            disabled={isSearching}
            className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-700 hover:to-indigo-800 text-white text-xs font-extrabold tracking-wide uppercase shadow-md shadow-brand-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isSearching ? 'animate-spin' : ''}`} />
            <span>{isSearching ? 'Optimizing...' : 'Find Best Journeys'}</span>
          </button>
        </div>

      </div>

      {/* Advanced Preferences */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-xl">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Maximum Budget</span>
              <span className="font-bold text-brand-600">₹{preferences.maxBudgetINR}</span>
            </div>
            <input
              type="range"
              min="30"
              max="500"
              step="10"
              value={preferences.maxBudgetINR}
              onChange={(e) => setPreferences(p => ({ ...p, maxBudgetINR: Number(e.target.value) }))}
              className="w-full accent-brand-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Max Walking Distance</span>
              <span className="font-bold text-brand-600">{preferences.maxWalkingMeters} m</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={preferences.maxWalkingMeters}
              onChange={(e) => setPreferences(p => ({ ...p, maxWalkingMeters: Number(e.target.value) }))}
              className="w-full accent-brand-600 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2 justify-center text-xs font-medium text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.avoidMultipleTransfers}
                onChange={(e) => setPreferences(p => ({ ...p, avoidMultipleTransfers: e.target.checked }))}
                className="rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
              />
              <span>Avoid Multi-level Metro Interchanges</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.preferPublicTransit}
                onChange={(e) => setPreferences(p => ({ ...p, preferPublicTransit: e.target.checked }))}
                className="rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
              />
              <span>Prefer DMRC Underground Metro</span>
            </label>
          </div>
        </div>
      )}

    </div>
  );
};
