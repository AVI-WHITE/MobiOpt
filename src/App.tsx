import React, { useState, useEffect } from 'react';
import { 
  Journey, 
  LocationItem, 
  FilterPreferences, 
} from './types';
import { DELHI_LOCATIONS } from './data/delhiLocations';
import { PRIMARY_DEMO_JOURNEYS, ALTERNATIVE_REOPTIMIZED_JOURNEY } from './data/sampleJourneys';
import { rankJourneys } from './services/optimizerEngine';

import { TopNav } from './components/layout/TopNav';
import { SearchPanel } from './components/search/SearchPanel';
import { OptimizationLoader } from './components/search/OptimizationLoader';
import { MapView } from './components/map/MapView';
import { JourneyCard } from './components/journeys/JourneyCard';
import { JourneyDetails } from './components/details/JourneyDetails';
import { JourneyComparison } from './components/comparison/JourneyComparison';
import { BookingModal } from './components/booking/BookingModal';
import { LiveTrackingModal } from './components/tracking/LiveTrackingModal';
import { DailyCommuteModal } from './components/commute/DailyCommuteModal';


import { 
  Sparkles, 
  AlertCircle, 
  Scale, 
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('plan');

  // Search & Filter State for Delhi NCR
  const [origin, setOrigin] = useState<LocationItem>(DELHI_LOCATIONS[0]); // IIT Delhi
  const [destination, setDestination] = useState<LocationItem>(DELHI_LOCATIONS[1]); // NDLS Station
  const [date, setDate] = useState<string>('Today');
  const [time, setTime] = useState<string>('08:30 AM');
  const [passengers, setPassengers] = useState<number>(2);

  const [preferences, setPreferences] = useState<FilterPreferences>({
    goal: 'balanced',
    luggage: 'none',
    maxBudgetINR: 250,
    maxWalkingMeters: 1200,
    avoidTolls: false,
    avoidMultipleTransfers: false,
    preferPublicTransit: true,
    preferPrivateTransit: false,
    avoidPollutionOpenAir: true,
  });

  // Journeys State
  const [journeys, setJourneys] = useState<Journey[]>(PRIMARY_DEMO_JOURNEYS);
  const [selectedJourney, setSelectedJourney] = useState<Journey>(PRIMARY_DEMO_JOURNEYS[0]);
  const [comparisonList, setComparisonList] = useState<Journey[]>([]);

  // Simulation & Modal States
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSimulatingDelay, setIsSimulatingDelay] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [showLiveTrackingModal, setShowLiveTrackingModal] = useState<boolean>(false);
  const [showDailyCommuteModal, setShowDailyCommuteModal] = useState<boolean>(false);

  // Re-rank journeys dynamically when goal, luggage, preferences or passengers change
  useEffect(() => {
    let currentPool = isSimulatingDelay 
      ? [ALTERNATIVE_REOPTIMIZED_JOURNEY, ...PRIMARY_DEMO_JOURNEYS]
      : PRIMARY_DEMO_JOURNEYS;

    const ranked = rankJourneys(currentPool, preferences, passengers);
    setJourneys(ranked);
  }, [preferences, passengers, isSimulatingDelay]);

  // Handle Search Trigger with AI Optimization sequence
  const handleSearch = () => {
    setIsSearching(true);
  };

  const handleOptimizationComplete = () => {
    setIsSearching(false);
    const ranked = rankJourneys(PRIMARY_DEMO_JOURNEYS, preferences, passengers);
    setJourneys(ranked);
    setSelectedJourney(ranked[0]);
    confetti({ particleCount: 60, spread: 60 });
  };

  // Toggle journey in comparison matrix (up to 3)
  const handleToggleCompare = (journey: Journey, e: React.MouseEvent) => {
    e.stopPropagation();
    setComparisonList((prev) => {
      const exists = prev.some(j => j.id === journey.id);
      if (exists) {
        return prev.filter(j => j.id !== journey.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 journeys simultaneously.');
          return prev;
        }
        return [...prev, journey];
      }
    });
  };

  // Trigger DMRC Signal Delay Simulation
  const handleSimulateDelay = () => {
    const nextState = !isSimulatingDelay;
    setIsSimulatingDelay(nextState);

    if (nextState) {
      setJourneys([ALTERNATIVE_REOPTIMIZED_JOURNEY, ...PRIMARY_DEMO_JOURNEYS]);
    } else {
      setJourneys(PRIMARY_DEMO_JOURNEYS);
      setSelectedJourney(PRIMARY_DEMO_JOURNEYS[0]);
    }
  };

  // Accept Re-Optimized Alternative Journey
  const handleAcceptAlternative = () => {
    setSelectedJourney(ALTERNATIVE_REOPTIMIZED_JOURNEY);
    setIsSimulatingDelay(false);
    confetti({ particleCount: 75, spread: 75 });
  };



  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={comparisonList.length}
        onOpenCompare={() => {
          if (comparisonList.length === 0) {
            setComparisonList(journeys.slice(0, 3));
          }
          setShowCompareModal(true);
        }}
        onOpenDailyCommute={() => setShowDailyCommuteModal(true)}
        onOpenBookings={() => setShowBookingModal(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-6 flex flex-col">
        
        {/* Prominent Unified Journey Search & Goal Panel */}
        <SearchPanel
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          passengers={passengers}
          setPassengers={setPassengers}
          preferences={preferences}
          setPreferences={setPreferences}
          onSearch={handleSearch}
          isSearching={isSearching}
        />

        {/* 3-Part Responsive Layout: Left: Map | Center: Journey Cards | Right: Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
          
          {/* LEFT: Interactive Delhi Map (5 cols) */}
          <div className="lg:col-span-5 flex flex-col min-h-[480px] lg:min-h-[620px]">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-brand-600" />
                Delhi Multimodal Map
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Breakup nodes isolated to inspected route
              </span>
            </div>
            <div className="flex-1">
              <MapView
                selectedJourney={selectedJourney}
                allJourneys={journeys}
                origin={origin}
                destination={destination}
                isSimulatingDelay={isSimulatingDelay}
                liveTrackingActive={showLiveTrackingModal}
              />
            </div>
          </div>

          {/* CENTER: Journey Alternatives & Ranking (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-3.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            
            {/* Header: Total Alternatives & Compare Trigger */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-subtle">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  {journeys.length} Complete Multimodal Routes
                </span>
                <span className="text-[11px] text-slate-500">
                  Sorted for: <b className="capitalize text-brand-600">{preferences.goal} Goal</b> {preferences.luggage !== 'none' && `• 🧳 Luggage Adjusted`}
                </span>
              </div>

              {comparisonList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCompareModal(true)}
                  className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-xl text-xs flex items-center gap-1 border border-brand-200 transition"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare ({comparisonList.length})</span>
                </button>
              )}
            </div>

            {/* Delay Simulation Notification Banner in List */}
            {isSimulatingDelay && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3.5 shadow-sm text-xs space-y-2">
                <div className="flex items-center justify-between text-rose-900 font-extrabold">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Dynamic Recalculation Triggered
                  </span>
                  <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-bold">
                    +20m DMRC Track Delay
                  </span>
                </div>
                <p className="text-rose-800 text-[11px]">
                  Yellow Line track signal maintenance between Green Park & AIIMS. MobiOpt rerouted top recommendation to Magenta + Violet Line Express.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAcceptAlternative}
                    className="flex-1 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Accept Re-Optimized Route (Saves 12m)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Journey Cards Stream */}
            <div className="space-y-3">
              {journeys.map((journey) => (
                <JourneyCard
                  key={journey.id}
                  journey={journey}
                  isSelected={selectedJourney.id === journey.id}
                  onSelect={() => setSelectedJourney(journey)}
                  isCompared={comparisonList.some(j => j.id === journey.id)}
                  onToggleCompare={(e) => handleToggleCompare(journey, e)}
                  passengers={passengers}
                  isSimulatingDelay={isSimulatingDelay}
                />
              ))}
            </div>

          </div>

          {/* RIGHT: Journey Details & Step-by-Step Timeline (3 cols) */}
          <div className="lg:col-span-3 flex flex-col min-h-[500px]">
            <JourneyDetails
              journey={selectedJourney}
              passengers={passengers}
              isSimulatingDelay={isSimulatingDelay}
              onSimulateDelay={handleSimulateDelay}
              onAcceptAlternative={handleAcceptAlternative}
              onBookPass={() => setShowBookingModal(true)}
              onStartTracking={() => setShowLiveTrackingModal(true)}
              onSaveCommute={() => {
                alert('Route saved to your Delhi Daily Commute routines!');
                setShowDailyCommuteModal(true);
              }}
              onClose={() => {}}
            />
          </div>

        </div>

      </main>

      {/* Footer Branding */}
      <footer className="mt-8 border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <span>MobiOpt — Multimodal Mobility Optimizer (Delhi NCR Edition)</span>
          </div>
          <div className="text-[11px] text-slate-500">
            DMRC, DTC & Unified Mobility Orchestration
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      
      {/* 1. AI Optimization Loading Overlay */}
      {isSearching && (
        <OptimizationLoader onComplete={handleOptimizationComplete} />
      )}

      {/* 2. Journey Comparison Matrix Modal */}
      {showCompareModal && (
        <JourneyComparison
          journeys={comparisonList.length > 0 ? comparisonList : journeys.slice(0, 3)}
          passengers={passengers}
          onClose={() => setShowCompareModal(false)}
          onSelectJourney={(j) => {
            setSelectedJourney(j);
            setShowCompareModal(false);
          }}
        />
      )}

      {/* 3. Unified Multimodal Sub-Tickets & Pass Modal */}
      {showBookingModal && (
        <BookingModal
          journey={selectedJourney}
          passengers={passengers}
          onClose={() => setShowBookingModal(false)}
          onStartTracking={() => setShowLiveTrackingModal(true)}
        />
      )}

      {/* 4. Live GPS Tracking Modal */}
      {showLiveTrackingModal && (
        <LiveTrackingModal
          journey={selectedJourney}
          onClose={() => setShowLiveTrackingModal(false)}
        />
      )}

      {/* 5. Daily Commute Modal */}
      {showDailyCommuteModal && (
        <DailyCommuteModal
          onClose={() => setShowDailyCommuteModal(false)}
          onApplyAlternative={() => {
            setSelectedJourney(ALTERNATIVE_REOPTIMIZED_JOURNEY);
            setShowDailyCommuteModal(false);
          }}
        />
      )}



    </div>
  );
}
export default App;
