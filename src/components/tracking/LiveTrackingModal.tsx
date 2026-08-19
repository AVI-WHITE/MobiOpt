import React, { useEffect, useState } from 'react';
import { Journey } from '../../types';
import { 
  X, 
  Navigation, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface LiveTrackingModalProps {
  journey: Journey;
  onClose: () => void;
  onSimulateDisruption?: () => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({
  journey,
  onClose,
  onSimulateDisruption,
}) => {
  const [progressPercent, setProgressPercent] = useState<number>(35);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(1);
  const [isDelayed, setIsDelayed] = useState<boolean>(false);

  // Smoothly increment live simulated progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 95) return 95;
        const next = prev + 2;
        if (next > 25 && next < 60) setActiveSegmentIndex(1); // auto
        if (next >= 60 && next < 90) setActiveSegmentIndex(2); // bus/metro
        if (next >= 90) setActiveSegmentIndex(3); // walk
        return next;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const currentSegment = journey.segments[activeSegmentIndex] || journey.segments[0];

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <h2 className="text-sm font-extrabold flex items-center gap-2">
                <span>Live Multimodal Trip Navigation</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  GPS Active
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Tracking: {journey.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Live Progress Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-600 animate-pulse" />
                Live En-Route Status
              </span>
              <span className="text-brand-600">{progressPercent}% Completed</span>
            </div>

            {/* Visual Multi-Segment Progress Bar */}
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-medium">
              <span>Origin: {journey.segments[0].from}</span>
              <span>Dest: {journey.segments[journey.segments.length - 1].to}</span>
            </div>
          </div>

          {/* Current Active Leg Information */}
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-extrabold text-indigo-900 uppercase tracking-wider">
                ● Active Transport Segment
              </span>
              <span className="font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md shadow-xs">
                ETA: 8 min
              </span>
            </div>

            <div className="text-base font-black text-slate-900 mt-1">
              {currentSegment.operator}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Approaching: <b>{currentSegment.to}</b>
            </div>

            <div className="mt-3 pt-2.5 border-t border-indigo-200/60 flex items-center justify-between text-xs text-slate-600">
              <span>Speed: <b>32 km/h</b></span>
              <span>Next Transfer: <b>Palasia Hub</b></span>
              <span>Traffic: <b className="text-emerald-700">Smooth</b></span>
            </div>
          </div>

          {/* Journey Segment Progress Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Journey Step Progression
            </h4>

            <div className="space-y-2">
              {journey.segments.map((seg, idx) => {
                const isCompleted = idx < activeSegmentIndex;
                const isActive = idx === activeSegmentIndex;
                const isUpcoming = idx > activeSegmentIndex;

                return (
                  <div
                    key={seg.id || idx}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                      isActive
                        ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20'
                        : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/40 text-slate-600'
                        : 'border-slate-200 bg-slate-50/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isActive ? (
                        <div className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                          ●
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                      )}

                      <div>
                        <div className={`font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                          {seg.operator}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {seg.from} ➔ {seg.to}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-semibold text-slate-700">{seg.durationMinutes} min</span>
                      <div className="text-[10px] text-slate-400">{seg.distanceMeters}m</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-600 font-medium">
            Next Stop Arrival: <b>08:44 AM</b>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition"
          >
            Close Tracking
          </button>
        </div>

      </div>
    </div>
  );
};
