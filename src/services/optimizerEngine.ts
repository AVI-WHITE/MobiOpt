import { Journey, TravelGoal, FilterPreferences } from '../types';

export interface PriorityWeights {
  time: number;
  cost: number;
  co2: number;
  waiting: number;
  transfers: number;
  walking: number;
  reliability: number;
  comfort: number;
  luggage: number;
}

export const GOAL_WEIGHTS: Record<TravelGoal, PriorityWeights> = {
  balanced: {
    time: 0.22,
    cost: 0.18,
    co2: 0.18,
    waiting: 0.10,
    transfers: 0.10,
    walking: 0.06,
    reliability: 0.06,
    comfort: 0.05,
    luggage: 0.05,
  },
  fastest: {
    time: 0.52,
    waiting: 0.15,
    reliability: 0.15,
    transfers: 0.05,
    cost: 0.04,
    co2: 0.03,
    walking: 0.03,
    comfort: 0.02,
    luggage: 0.01,
  },
  cheapest: {
    cost: 0.58,
    time: 0.14,
    co2: 0.10,
    transfers: 0.05,
    walking: 0.05,
    waiting: 0.04,
    reliability: 0.02,
    comfort: 0.01,
    luggage: 0.01,
  },
  greenest: {
    co2: 0.58,
    time: 0.14,
    cost: 0.10,
    reliability: 0.06,
    waiting: 0.04,
    transfers: 0.03,
    walking: 0.03,
    comfort: 0.01,
    luggage: 0.01,
  },
  comfort: {
    comfort: 0.35,
    luggage: 0.25,
    transfers: 0.15,
    walking: 0.15,
    time: 0.05,
    reliability: 0.03,
    cost: 0.01,
    waiting: 0.01,
    co2: 0.00,
  },
  reliability: {
    reliability: 0.52,
    time: 0.15,
    waiting: 0.15,
    transfers: 0.06,
    comfort: 0.04,
    cost: 0.04,
    walking: 0.02,
    luggage: 0.01,
    co2: 0.01,
  },
};

/**
 * Calculates 5-Star visual Eco-Rating
 */
export function calculateEcoStars(co2Kg: number): { stars: number; label: string } {
  if (co2Kg <= 0.6) {
    return { stars: 5, label: '5.0 ★ Eco-Rating (Ultra Green)' };
  } else if (co2Kg <= 0.9) {
    return { stars: 4, label: '4.0 ★ Eco-Rating (High Green)' };
  } else if (co2Kg <= 1.3) {
    return { stars: 3, label: '3.0 ★ Eco-Rating (Moderate)' };
  } else if (co2Kg <= 1.8) {
    return { stars: 2, label: '2.0 ★ Eco-Rating (Standard)' };
  } else {
    return { stars: 1, label: '1.0 ★ Eco-Rating (High Carbon)' };
  }
}

/**
 * Calculates a dynamic MobiOpt Score (0-100) combining unified travel goal, luggage, and passengers
 */
export function calculateMobiOptScore(
  journey: Journey,
  preferences: FilterPreferences,
  passengers: number = 1
): number {
  const weights = GOAL_WEIGHTS[preferences.goal] || GOAL_WEIGHTS.balanced;

  // Normalized benchmarks
  const normTime = Math.max(30, Math.min(100, 100 - (journey.totalDurationMinutes - 20) * 1.3));
  const costPerPerson = calculatePassengerCost(journey, passengers).perPerson;
  const normCost = Math.max(30, Math.min(100, 100 - (costPerPerson - 20) * 0.28));
  
  const co2PerPerson = journey.totalCO2Kg / (journey.segments.some(s => s.mode === 'cab') ? passengers : 1);
  const normCO2 = Math.max(20, Math.min(100, 100 - (co2PerPerson - 0.2) * 35));
  const normWaiting = Math.max(40, Math.min(100, 100 - journey.totalWaitMinutes * 4));
  const normTransfers = Math.max(50, 100 - journey.transfersCount * 14);
  const normWalking = Math.max(35, Math.min(100, 100 - (journey.walkingDistanceMeters / 1500) * 65));
  
  const normReliability = journey.reliabilityScore;
  const normComfort = journey.comfortScore;

  // Luggage Feasibility Penalty / Bonus
  let normLuggage = 85;
  if (preferences.luggage === 'heavy' || preferences.luggage === 'medium') {
    if (journey.segments.some(s => s.mode === 'cab')) {
      normLuggage = 98;
    } else if (journey.transfersCount === 0) {
      normLuggage = 95;
    } else if (journey.walkingDistanceMeters > 600 || journey.segments.some(s => s.mode === 'bus')) {
      normLuggage = 45;
    } else {
      normLuggage = 80;
    }
  } else {
    normLuggage = 90;
  }

  // Delhi Air Pollution Sensitivity
  let aqiModifier = 0;
  if (preferences.avoidPollutionOpenAir) {
    const isProtectedAC = journey.segments.every(s => s.mode === 'metro' || s.mode === 'cab' || (s.mode === 'walk' && s.distanceMeters < 400));
    if (isProtectedAC) aqiModifier += 3;
    if (journey.walkingDistanceMeters > 700 || journey.segments.some(s => s.mode === 'auto')) aqiModifier -= 4;
  }

  const rawScore = 
    normTime * weights.time +
    normCost * weights.cost +
    normCO2 * weights.co2 +
    normWaiting * weights.waiting +
    normTransfers * weights.transfers +
    normWalking * weights.walking +
    normReliability * weights.reliability +
    normComfort * weights.comfort +
    normLuggage * weights.luggage +
    aqiModifier;

  return Math.round(Math.max(40, Math.min(99, rawScore)));
}

/**
 * Passenger-aware cost calculation
 */
export function calculatePassengerCost(journey: Journey, passengers: number): {
  total: number;
  perPerson: number;
  savingsNote?: string;
} {
  let totalCost = 0;

  for (const seg of journey.segments) {
    if (seg.mode === 'cab' || seg.mode === 'auto' || seg.mode === 'shared_cab') {
      totalCost += seg.costINR;
    } else if (seg.mode === 'bus' || seg.mode === 'metro' || seg.mode === 'train') {
      totalCost += seg.costINR * passengers;
    } else {
      totalCost += 0;
    }
  }

  const perPerson = Math.round(totalCost / passengers);
  let savingsNote = undefined;

  if (passengers >= 3 && journey.segments.some(s => s.mode === 'cab' || s.mode === 'auto')) {
    savingsNote = `Group ride saves ₹${Math.round(perPerson * 0.35)}/person via vehicle sharing!`;
  }

  return {
    total: Math.round(totalCost),
    perPerson,
    savingsNote
  };
}

/**
 * Re-scores and re-ranks journeys based on unified goal, luggage, and passenger count
 */
export function rankJourneys(
  journeys: Journey[],
  preferences: FilterPreferences,
  passengers: number
): Journey[] {
  return journeys
    .map(j => {
      const updatedScore = calculateMobiOptScore(j, preferences, passengers);
      const eco = calculateEcoStars(j.totalCO2Kg);
      return {
        ...j,
        mobiOptScore: updatedScore,
        ecoStars: eco.stars,
        ecoLabel: eco.label
      };
    })
    .sort((a, b) => {
      if (preferences.luggage === 'heavy') {
        if (a.luggageSuitability === 'excellent' && b.luggageSuitability !== 'excellent') return -1;
        if (b.luggageSuitability === 'excellent' && a.luggageSuitability !== 'excellent') return 1;
      }

      if (preferences.goal === 'fastest') return a.totalDurationMinutes - b.totalDurationMinutes;
      if (preferences.goal === 'cheapest') {
        const costA = calculatePassengerCost(a, passengers).total;
        const costB = calculatePassengerCost(b, passengers).total;
        return costA - costB;
      }
      if (preferences.goal === 'greenest') return a.totalCO2Kg - b.totalCO2Kg;
      return b.mobiOptScore - a.mobiOptScore;
    });
}
