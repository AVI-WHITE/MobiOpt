import React from 'react';
import { Journey } from '../../types';
import { calculatePassengerCost } from '../../services/optimizerEngine';
import { 
  X, 
  Sparkles, 
  Trophy, 
  Clock, 
  DollarSign, 
  Leaf, 
  Footprints, 
  ShieldCheck, 
  Luggage,
} from 'lucide-react';

interface JourneyComparisonProps {
  journeys: Journey[];
  passengers: number;
  onClose: () => void;
  onSelectJourney: (j: Journey) => void;
}

export const JourneyComparison: React.FC<JourneyComparisonProps> = ({
  journeys,
  passengers,
  onClose,
  onSelectJourney,
}) => {
  if (journeys.length === 0) return null;

  const minTime = Math.min(...journeys.map(j => j.totalDurationMinutes));
  const minCost = Math.min(...journeys.map(j => calculatePassengerCost(j, passengers).total));
  const maxEcoStars = Math.max(...journeys.map(j => j.ecoStars));
  const minWait = Math.min(...journeys.map(j => j.totalWaitMinutes));
  const minTransfers = Math.min(...journeys.map(j => j.transfersCount));
  const minWalk = Math.min(...journeys.map(j => j.walkingDistanceMeters));
  const maxReliability = Math.max(...journeys.map(j => j.reliabilityScore));
  const maxScore = Math.max(...journeys.map(j => j.mobiOptScore));

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-brand-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-extrabold text-slate-900">
                Multimodal Journey Comparison Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side Pareto evaluation across {journeys.length} complete routes for {passengers} {passengers === 1 ? 'traveller' : 'travellers'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto flex-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left font-bold text-slate-400 uppercase tracking-wider pb-3 w-1/4">
                  Evaluation Metric
                </th>
                {journeys.map((j) => (
                  <th key={j.id} className="text-center pb-3 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase mb-1 ${j.badgeColor}`}>
                      {j.badge}
                    </span>
                    <div className="font-extrabold text-sm text-slate-900">{j.title}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              
              {/* MobiOpt Score */}
              <tr className="bg-brand-50/50">
                <td className="py-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>MobiOpt AI Score</span>
                </td>
                {journeys.map((j) => {
                  const isBest = j.mobiOptScore === maxScore;
                  return (
                    <td key={j.id} className="py-3 text-center px-3 font-extrabold text-base text-brand-700">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl ${isBest ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-800'}`}>
                        {isBest && <Trophy className="w-3.5 h-3.5 text-amber-300" />}
                        <span>{j.mobiOptScore} / 100</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Travel Time */}
              <tr>
                <td className="py-3 font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Total Travel Time</span>
                  </div>
                </td>
                {journeys.map((j) => {
                  const isBest = j.totalDurationMinutes === minTime;
                  return (
                    <td key={j.id} className="py-3 text-center px-3 font-bold text-slate-900">
                      <span className={`px-2 py-0.5 rounded-md ${isBest ? 'bg-emerald-100 text-emerald-800 font-extrabold' : ''}`}>
                        {j.totalDurationMinutes} min
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Total Cost */}
              <tr>
                <td className="py-3 font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>Total Cost ({passengers} pax)</span>
                  </div>
                </td>
                {journeys.map((j) => {
                  const cost = calculatePassengerCost(j, passengers).total;
                  const isBest = cost === minCost;
                  return (
                    <td key={j.id} className="py-3 text-center px-3 font-bold text-slate-900">
                      <span className={`px-2 py-0.5 rounded-md ${isBest ? 'bg-emerald-100 text-emerald-800 font-extrabold' : ''}`}>
                        ₹{cost} {passengers > 1 && `(₹${Math.round(cost/passengers)}/p)`}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* 5-Star Eco Rating */}
              <tr>
                <td className="py-3 font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                    <span>5-Star Eco Rating</span>
                  </div>
                </td>
                {journeys.map((j) => {
                  const isBest = j.ecoStars === maxEcoStars;
                  return (
                    <td key={j.id} className="py-3 text-center px-3 font-bold text-slate-900">
                      <span className={`px-2 py-0.5 rounded-md flex items-center justify-center gap-1 ${isBest ? 'bg-emerald-100 text-emerald-900 font-extrabold' : ''}`}>
                        <span className="text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < j.ecoStars ? 'text-amber-500' : 'text-slate-300'}>★</span>
                          ))}
                        </span>
                        <span>({j.ecoStars}.0)</span>
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Luggage Suitability */}
              <tr>
                <td className="py-3 font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Luggage Suitability</span>
                  </div>
                </td>
                {journeys.map((j) => (
                  <td key={j.id} className="py-3 text-center px-3 font-bold text-slate-700">
                    <span className={`px-2 py-0.5 rounded-md ${j.luggageSuitability === 'excellent' ? 'bg-indigo-50 text-indigo-800 font-extrabold' : 'text-slate-500'}`}>
                      {j.luggageSuitability === 'excellent' ? '✓ High Luggage Friendly' : 'Moderate'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Waiting Time */}
              <tr>
                <td className="py-3 font-semibold text-slate-600">
                  <span>Waiting Range</span>
                </td>
                {journeys.map((j) => {
                  const isBest = j.totalWaitMinutes === minWait;
                  return (
                    <td key={j.id} className="py-3 text-center px-3 text-slate-700">
                      <span className={`px-2 py-0.5 rounded-md ${isBest ? 'bg-slate-100 font-bold' : ''}`}>
                        {j.totalWaitMinutes} min
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Transfers */}
              <tr>
                <td className="py-3 font-semibold text-slate-600">
                  <span>Number of Transfers</span>
                </td>
                {journeys.map((j) => {
                  const isBest = j.transfersCount === minTransfers;
                  return (
                    <td key={j.id} className="py-3 text-center px-3 text-slate-700">
                      <span className={`px-2 py-0.5 rounded-md ${isBest ? 'bg-slate-100 font-bold' : ''}`}>
                        {j.transfersCount}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Walking Distance */}
              <tr>
                <td className="py-3 font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Footprints className="w-3.5 h-3.5 text-slate-400" />
                    <span>Walking Distance</span>
                  </div>
                </td>
                {journeys.map((j) => {
                  const isBest = j.walkingDistanceMeters === minWalk;
                  return (
                    <td key={j.id} className="py-3 text-center px-3 text-slate-700">
                      <span className={`px-2 py-0.5 rounded-md ${isBest ? 'bg-amber-100 text-amber-900 font-bold' : ''}`}>
                        {j.walkingDistanceMeters} m
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Reliability */}
              <tr>
                <td className="py-3 font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Reliability Index</span>
                  </div>
                </td>
                {journeys.map((j) => {
                  const isBest = j.reliabilityScore === maxReliability;
                  return (
                    <td key={j.id} className="py-3 text-center px-3 font-bold text-slate-900">
                      <span className={`px-2 py-0.5 rounded-md ${isBest ? 'bg-indigo-100 text-indigo-900 font-extrabold' : ''}`}>
                        {j.reliabilityScore}%
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Select for Navigation */}
              <tr>
                <td className="py-4 font-bold text-slate-400 uppercase">
                  Select for Navigation
                </td>
                {journeys.map((j) => (
                  <td key={j.id} className="py-4 text-center px-3">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectJourney(j);
                        onClose();
                      }}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
                    >
                      View Journey
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">🏆 AI Recommendation:</span>
            <span className="font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              Balanced Journey (Auto ➔ DMRC Yellow Line ➔ Walk)
            </span>
          </div>
          <p className="text-slate-600 text-[11px]">
            “Best overall multi-objective trade-off between time, cost, 5-star eco rating, and reliability.”
          </p>
        </div>

      </div>
    </div>
  );
};
