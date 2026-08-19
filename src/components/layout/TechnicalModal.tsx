import React from 'react';
import { 
  X, 
  Cpu, 
  Layers, 
  GitMerge, 
  Sparkles, 
  ShieldCheck, 
  ArrowDown, 
  CheckCircle2, 
  Network,
  Zap,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface TechnicalModalProps {
  onClose: () => void;
}

export const TechnicalModal: React.FC<TechnicalModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-600 text-white">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>How MobiOpt AI Works — Technical Architecture</span>
                <span className="text-[10px] bg-brand-500/20 text-brand-300 border border-brand-400/30 px-2 py-0.5 rounded-full font-bold">
                  SIH Presentation Guide
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                End-to-end multimodal graph construction & Pareto frontier scoring engine
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
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          {/* Core Product Principle */}
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4">
            <div className="font-extrabold text-sm text-brand-950 mb-1">
              💡 Core Product Principle: “Finding a route ≠ Finding the best journey.”
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Standard navigation tools calculate single-mode paths from A to B. MobiOpt constructs a <b>multimodal dynamic graph</b> evaluating entire journeys across walking, buses, metro, autos, cabs, and shared rides—optimizing for time, monetary cost, carbon footprint, reliability, and passenger group dynamics simultaneously.
            </p>
          </div>

          {/* Architecture Pipeline Flow */}
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <span>Multi-Stage AI Optimization Pipeline</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  step: '01',
                  title: 'User Intent & Constraint Ingestion',
                  desc: 'Ingests origin, destination, time, passenger party size (1 to 6+), budget constraints, max walking distance, and priority weightings (Balanced, Fastest, Cheapest, Greenest, Comfort, Reliability).',
                  tag: 'Input Layer'
                },
                {
                  step: '02',
                  title: 'Multimodal Data Integration & Graph Construction',
                  desc: 'Harmonizes GTFS transit schedules (AICTSL buses), Indore Metro timetable feeds, live road traffic telemetry, ride-hailing partner APIs (Uber, Ola, Rapido), and pedestrian routing networks into a unified time-expanded graph.',
                  tag: 'Data Layer'
                },
                {
                  step: '03',
                  title: 'Multi-Objective Pareto Journey Search',
                  desc: 'Generates 20+ candidate multimodal path combinations. Applies multi-objective Pareto optimization across 8 dimensions: travel time, monetary cost, CO₂ emissions, wait time, transfer penalty, walking distance, comfort, and reliability.',
                  tag: 'AI Optimization'
                },
                {
                  step: '04',
                  title: 'Dynamic Real-Time Re-Optimization Engine',
                  desc: 'Monitors active trip legs for traffic spikes, bus delays, or missed transfers. Automatically computes dynamic alternative transfers (e.g. switching from delayed Bus #11 to Indore Metro at Palasia to save 5 minutes).',
                  tag: 'Adaptive Engine'
                },
                {
                  step: '05',
                  title: 'Unified Booking & Smart Pass Generation',
                  desc: 'Aggregates multimodal legs into a single digital QR boarding pass with simulated deep-link partner handoffs and real-time GPS progression.',
                  tag: 'Orchestration'
                },
              ].map((pipe) => (
                <div key={pipe.step} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 hover:border-brand-300 transition">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-600 text-white font-extrabold text-xs">
                    {pipe.step}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{pipe.title}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {pipe.tag}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                      {pipe.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Scoring Formulation */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
            <span className="text-[10px] font-extrabold text-brand-300 uppercase tracking-wider">
              Mathematical Scoring Formula
            </span>
            <div className="font-mono text-xs bg-slate-800/90 p-3 rounded-xl border border-slate-700 text-amber-300 overflow-x-auto">
              MobiOpt Score = Σ (w_i × NormalizedMetric_i)<br/>
              where w_i ∈ &#123;Time, Cost, CO₂, Wait, Transfers, Walk, Reliability, Comfort&#125;
            </div>
            <p className="text-[11px] text-slate-400">
              Weights dynamically adapt to user intent (e.g. "I am late" boosts Time weight to 55%; "Save money" prioritizes Cost weight to 60%; Group travel scales vehicle splitting).
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            Team <b>LORD OF THE STRINGS</b> • SGSITS, Indore
          </div>
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
