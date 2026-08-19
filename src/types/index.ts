export type TransportMode = 
  | 'walk' 
  | 'bicycle' 
  | 'auto' 
  | 'cab' 
  | 'bus' 
  | 'metro' 
  | 'train' 
  | 'shared_cab' 
  | 'park_and_ride'
  | 'e_rickshaw';

// Unified Smart Travel Goal (combining priority + intent)
export type TravelGoal = 
  | 'balanced'    // Balanced: Optimal balance of time, cost & comfort
  | 'fastest'     // Catching Train / Fastest
  | 'cheapest'    // Student Budget Saver
  | 'greenest'    // 100% Eco Green
  | 'comfort'     // Max AC Comfort & Family
  | 'reliability';// Avoid Delays & Gridlock

export type LuggageType = 
  | 'none'       // Backpack / Handbag only
  | 'small'      // Cabin Bag / Laptop Trolley
  | 'medium'     // 1 Medium Suitcase
  | 'heavy';     // 2+ Large Trolleys / Family Baggage

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  category: 'station' | 'college' | 'commercial' | 'transit_hub' | 'airport' | 'residential' | 'food';
  coordinates: [number, number]; // [lat, lng]
  popularTimes?: string;
  nearbyStops?: string[];
  metroLine?: string;
}

export interface SegmentETARange {
  departureWindow: string; // e.g. "08:12 – 08:14 AM"
  arrivalWindow: string;   // e.g. "08:34 – 08:37 AM"
  waitRange: string;       // e.g. "2 – 4 min"
  frequencyMin: number;    // headway in minutes
}

export interface SubTicket {
  id: string;
  mode: TransportMode;
  operator: string;
  title: string;
  ticketType: 'metro_qr' | 'bus_pass' | 'cab_otp' | 'porter_voucher' | 'e_rickshaw_token';
  fareINR: number;
  status: 'confirmed' | 'valid' | 'boarding';
  qrCodeData?: string;
  otp?: string;
  vehicleOrGate?: string;
  platformOrBay?: string;
  luggageAllowance?: string;
  instructions?: string;
}

export interface JourneySegment {
  id: string;
  mode: TransportMode;
  from: string;
  to: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  pathCoords: [number, number][];
  distanceMeters: number;
  durationMinutes: number;
  costINR: number;
  co2Kg: number;
  waitingMinutes: number;
  etaRange: SegmentETARange;
  operator: string;
  lineCode?: string;
  platformOrGate?: string;
  instructions?: string;
  reliabilityScore: number; // 0-100
  comfortScore: number;     // 0-100
  luggageSuitability: 'excellent' | 'moderate' | 'difficult';
  crowdLevel: 'low' | 'moderate' | 'high';
  status?: 'scheduled' | 'delayed' | 'in_transit' | 'completed';
  disruptionReason?: string;
}

export interface ScoreBreakdown {
  timeScore: number;
  costScore: number;
  co2Score: number;
  waitingScore: number;
  transfersScore: number;
  walkingScore: number;
  reliabilityScore: number;
  comfortScore: number;
  luggageScore: number;
}

export interface Journey {
  id: string;
  title: string;
  subtitle: string;
  category: 'recommended' | 'fastest' | 'cheapest' | 'greenest' | 'comfortable' | 'reliable' | 'alternative';
  badge: string;
  badgeColor: string;
  segments: JourneySegment[];
  totalDurationMinutes: number;
  totalCostINR: number; // Base cost for 1 person
  totalCO2Kg: number;
  ecoStars: number;      // 1 to 5 stars
  ecoLabel: string;      // e.g. "5.0 ★ Ultra Green"
  totalWaitMinutes: number;
  waitRangeSummary: string;
  transfersCount: number;
  walkingDistanceMeters: number;
  reliabilityScore: number; // 0-100
  comfortScore: number;     // 0-100
  luggageSuitability: 'excellent' | 'moderate' | 'difficult';
  luggageWarning?: string;
  aqiSuitability: 'optimal' | 'moderate' | 'sensitive';
  mobiOptScore: number;     // 0-100 computed dynamic score
  scoreBreakdown: ScoreBreakdown;
  subTickets: SubTicket[];
  summary: string;
  isAlternative?: boolean;
  highlightText?: string;
}

export interface FilterPreferences {
  goal: TravelGoal;
  luggage: LuggageType;
  maxBudgetINR: number;
  maxWalkingMeters: number;
  avoidTolls: boolean;
  avoidMultipleTransfers: boolean;
  preferPublicTransit: boolean;
  preferPrivateTransit: boolean;
  avoidPollutionOpenAir: boolean;
}

export interface DelaySimulation {
  active: boolean;
  affectedSegmentId: string;
  delayMinutes: number;
  message: string;
  originalJourneyId: string;
  alternativeJourney: Journey;
}

export interface DailyCommuteRoutine {
  id: string;
  name: string;
  origin: string;
  destination: string;
  departureTime: string;
  weekdays: string;
  baselineDurationMinutes: number;
  baselineCostINR: number;
  todayTrafficDelayMinutes: number;
  recommendedDeparture: string;
  alternativeJourneyTitle: string;
  alternativeDurationMinutes: number;
  alternativeCostINR: number;
  active: boolean;
}
