import React, { useState } from 'react';
import { SAMPLE_COMMUTE_ROUTINE } from '../../data/sampleJourneys';
import { 
  X, 
  Clock, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Pause, 
  Play, 
  Edit2, 
  Bell, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface DailyCommuteModalProps {
  onClose: () => void;
  onApplyAlternative: () => void;
}

export const DailyCommuteModal: React.FC<DailyCommuteModalProps> = ({
  onClose,
  onApplyAlternative,
}) => {
  const [commute, setCommute] = useState(SAMPLE_COMMUTE_ROUTINE);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleActive = () => {
    setCommute(prev => ({ ...prev, active: !prev.active }));
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Daily Commute AI Monitor
              </h2>
              <p className="text-[11px] text-slate-500">
                Autonomous morning traffic watch & proactive departure nudges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* Active Routine Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full uppercase">
                  Active Schedule
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                  {commute.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleToggleActive}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                  commute.active
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {commute.active ? <Check className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{commute.active ? 'Monitoring Active' : 'Paused'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{commute.origin}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="font-bold text-slate-900">{commute.destination}</span>
            </div>

            <div className="flex items-center gap-4 text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {commute.weekdays}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Target Departure: {commute.departureTime}
              </span>
            </div>
          </div>

          {/* Today's Live Disruption Detection Callout */}
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-rose-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Today's Traffic Alert on Usual Routine</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-2.5 rounded-xl border border-rose-200">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Usual Routine</span>
                <span className="font-black text-slate-800">{commute.baselineDurationMinutes} min • ₹{commute.baselineCostINR}</span>
              </div>
              <div>
                <span className="text-rose-600 text-[10px] uppercase font-bold block">Traffic Impact</span>
                <span className="font-black text-rose-700">+{commute.todayTrafficDelayMinutes} min Gridlock</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-rose-900">
              <p className="font-semibold">
                🚨 MobiOpt Morning Nudge: Leave at <b>{commute.recommendedDeparture}</b> or switch to rapid transit.
              </p>
            </div>
          </div>

          {/* AI Recommended Alternative for Today */}
          <div className="bg-gradient-to-br from-indigo-50 to-brand-50 border border-brand-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
                MobiOpt Smart Alternative for Today
              </span>
              <span className="text-[10px] font-extrabold bg-brand-600 text-white px-2 py-0.5 rounded-full">
                Saves 12 min
              </span>
            </div>

            <div className="text-xs font-bold text-slate-900">
              {commute.alternativeJourneyTitle}
            </div>
            <div className="text-slate-600 text-[11px]">
              Expected Duration: <b>{commute.alternativeDurationMinutes} min</b> • Total: <b>₹{commute.alternativeCostINR}</b>
            </div>

            <button
              type="button"
              onClick={() => {
                onApplyAlternative();
                onClose();
              }}
              className="w-full py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Optimize Today's Commute Now</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsSaved(true)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            {isSaved ? '✓ Routine Saved' : 'Save Routine Settings'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-black transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
