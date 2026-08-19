import React, { useState, useEffect } from 'react';
import { Sparkles, Network, Cpu, CheckCircle2 } from 'lucide-react';

interface OptimizationLoaderProps {
  onComplete: () => void;
}

export const OptimizationLoader: React.FC<OptimizationLoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  const STAGES = [
    'Constructing multimodal transit graph across Delhi NCR coordinates...',
    'Ingesting DMRC Metro & DTC Bus schedules and live feeds...',
    'Evaluating 24 candidate multimodal route combinations...',
    'Computing multi-objective Pareto scoring across Time, Cost & CO₂...',
    'Finalizing optimal journey recommendations...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated AI Brain Icon */}
        <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-brand-600/20 animate-ping"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-7 h-7 text-amber-300 animate-spin" />
          </div>
        </div>

        <h3 className="text-base font-black text-slate-900 mb-1">
          MobiOpt Optimizing Your Route...
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Searching complete journeys across 6 transport modes
        </p>

        {/* Current Pipeline Stage */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-brand-700 mb-4 min-h-[44px] flex items-center justify-center">
          {STAGES[stage]}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>Multimodal Graph</span>
          <span>Pareto Scoring</span>
        </div>

      </div>
    </div>
  );
};
