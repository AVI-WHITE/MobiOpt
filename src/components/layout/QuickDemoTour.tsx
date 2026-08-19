import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Sparkles, 
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickDemoTourProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onClose: () => void;
  onRunStepAction: (step: number) => void;
}

export const DEMO_STEPS_INFO = [
  {
    step: 1,
    title: '1. Delhi NCR Context & Luggage Input',
    subtitle: 'IIT Delhi ➔ NDLS Railway Station (2 Passengers • 🧳 1 Trolley)',
    description: 'User enters origin, destination, 2 passengers, and selects "1 Medium Trolley" luggage. The system loads DMRC timetable feeds and live Delhi AQI telemetry.',
    judgeHighlight: 'Notice how luggage selection automatically adapts suitability—penalizing steep stairs or crowded non-AC buses while favoring elevator-equipped DMRC stations.',
  },
  {
    step: 2,
    title: '2. Multimodal Transit Graph Construction',
    subtitle: '24-Path Combinatorial Evaluation across DMRC, DTC & Cabs',
    description: 'MobiOpt constructs dynamic routes across walking, DMRC Yellow/Magenta Lines, DTC Electric AC buses, CNG autos, and BluSmart EV cabs simultaneously.',
    judgeHighlight: 'Evaluates entire end-to-end complete journeys with realistic arrival ETA windows and wait time ranges.',
  },
  {
    step: 3,
    title: '3. 5-Star Eco Rating & Pareto Ranking',
    subtitle: '⭐⭐⭐⭐⭐ 5.0 Eco Stars & MobiOpt Scores',
    description: 'Journeys are ranked with standardized 5-Star Eco-Ratings (5.0 ★ Ultra Green to 1.0 ★ High Carbon) instead of confusing raw percentages.',
    judgeHighlight: '5.0 ★ Ultra Green uses 100% solar-assisted underground rail grid, saving over 80% carbon compared to a private petrol cab.',
  },
  {
    step: 4,
    title: '4. AI Recommended Journey Inspection',
    subtitle: 'Auto ➔ DMRC Yellow Line ➔ Walk (36 min • ₹75 • 5.0 ★ Eco Rating)',
    description: 'Optimal balance of speed and pocket-friendliness. Direct elevator concourse access at Hauz Khas Gate 2 with 94% reliability.',
    judgeHighlight: 'MobiOpt Score: 94/100. 100% air-conditioned underground transit protecting commuters from Delhi outdoor pollution.',
  },
  {
    step: 5,
    title: '5. Segment Arrival ETAs & Wait Ranges',
    subtitle: 'Live Departure Windows & Headway Confidence',
    description: 'Every segment displays exact arrival windows (09:03 – 09:06 AM) and wait ranges (Wait: 2–4 min) reflecting DMRC peak frequency.',
    judgeHighlight: 'Provides commuters with realistic confidence intervals rather than misleading single-second estimates.',
  },
  {
    step: 6,
    title: '6. Inspected Route Sub-Legs & Breakup Points',
    subtitle: 'Transfer Breakup Nodes Isolated to Inspected Route',
    description: 'The map isolates and highlights the transfer breakup points and sub-legs exclusively for the active inspected route without map clutter.',
    judgeHighlight: 'Clean visual hierarchy showing exactly where modal transfers occur.',
  },
  {
    step: 7,
    title: '7. Simulated Real-Time DMRC Disruption',
    subtitle: '⚠️ Live Delay: Yellow Line Track Signal Maintenance (+20m at Green Park)',
    description: 'A sudden signal fault on the Yellow Line corridor delays central northbound trains by 20 minutes.',
    judgeHighlight: 'Demonstrates why static route planners fail in dynamic real-world metropolitan transit conditions.',
  },
  {
    step: 8,
    title: '8. Autonomous Real-Time Re-Optimization',
    subtitle: '⚡ AI Dynamically Reroutes: Magenta + Violet Line Express',
    description: 'MobiOpt instantly calculates a dynamic bypass via Magenta Line (Kalkaji) and Violet Line (Mandi House) to reach NDLS in 38 min.',
    judgeHighlight: 'Saves 12 minutes and completely avoids the Green Park-AIIMS track bottleneck!',
  },
  {
    step: 9,
    title: '9. Commuter Confirms Dynamic Alternative',
    subtitle: 'Map & Journey Graph Dynamically Updated',
    description: 'Commuter accepts the new journey with 1 click. Map polylines and step cards update immediately.',
    judgeHighlight: 'Dynamic resilience: Mobility as a self-healing intelligent service.',
  },
  {
    step: 10,
    title: '10. Segmented Sub-Passes & Multi-Ticket Booking',
    subtitle: 'DMRC QR Token • DTC Bus Pass • Auto OTP • Luggage Porter Voucher',
    description: 'Issues discrete, validated tickets for every leg with digital AFC turnstile QR tokens, driver OTPs, and optional NDLS luggage porter assistance!',
    judgeHighlight: 'End-to-end unified mobility orchestration ready for Smart India Hackathon implementation!',
  },
];

export const QuickDemoTour: React.FC<QuickDemoTourProps> = ({
  currentStep,
  setCurrentStep,
  onClose,
  onRunStepAction,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const stepInfo = DEMO_STEPS_INFO[currentStep - 1] || DEMO_STEPS_INFO[0];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentStep < 10) {
          const next = currentStep + 1;
          setCurrentStep(next);
          onRunStepAction(next);
        } else {
          setIsPlaying(false);
          confetti({ particleCount: 100, spread: 80 });
        }
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStep]);

  const handleNext = () => {
    if (currentStep < 10) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onRunStepAction(next);
      if (next === 10) confetti({ particleCount: 90, spread: 75 });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onRunStepAction(prev);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2500] max-w-2xl w-[94%] bg-slate-950/95 backdrop-blur-md text-white rounded-3xl p-5 shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-5 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-brand-600 text-white">
            <Award className="w-4 h-4 text-amber-300" />
          </span>
          <div>
            <span className="font-extrabold text-xs tracking-wider uppercase text-brand-300">
              SIH Delhi NCR Judge Pitch Walkthrough
            </span>
            <span className="text-[11px] text-slate-400 ml-2 font-mono">
              Step {currentStep} of 10
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-amber-400" />}
            <span>{isPlaying ? 'Pause Tour' : 'Auto-Play'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Info Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-white flex items-center gap-1.5">
            <span className="text-brand-400">{stepInfo.title}</span>
          </h3>
          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            {stepInfo.subtitle}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {stepInfo.description}
        </p>

        {/* Pitch Highlight */}
        <div className="bg-brand-900/40 border border-brand-500/30 rounded-xl p-2.5 text-[11px] text-brand-200 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
          <span>
            <b>Judge Pitch Point:</b> {stepInfo.judgeHighlight}
          </span>
        </div>
      </div>

      {/* Progress Dots & Nav Controls */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        
        {/* Step Indicator Dots */}
        <div className="flex items-center gap-1.5">
          {DEMO_STEPS_INFO.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => {
                setCurrentStep(s.step);
                onRunStepAction(s.step);
              }}
              title={s.title}
              className={`h-2 rounded-full transition-all ${
                s.step === currentStep
                  ? 'w-6 bg-brand-500'
                  : s.step < currentStep
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Next / Previous Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep <= 1}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-brand-500/30 transition flex items-center gap-1"
          >
            <span>{currentStep === 10 ? 'Finish Tour 🏆' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
