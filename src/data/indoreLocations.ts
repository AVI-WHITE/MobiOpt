import { LocationItem } from '../types';

export const INDORE_LOCATIONS: LocationItem[] = [
  {
    id: 'sgsits',
    name: 'SGSITS, Indore',
    address: '23 Sir M. Visvesvaraya Marg, Vallabh Nagar, Indore (452003)',
    category: 'college',
    coordinates: [22.7244, 75.8753],
    popularTimes: 'Peak: 8:30 AM - 10:30 AM & 4:30 PM - 6:00 PM',
    nearbyStops: ['Vallabh Nagar Bus Stop (250m)', 'Janjeerwala Square Auto Stand (400m)', 'Palasia Metro Stn (1.2km)']
  },
  {
    id: 'railway_station',
    name: 'Indore Railway Station',
    address: 'Station Road, Chhoti Gwaltoli, Indore (452001)',
    category: 'station',
    coordinates: [22.7177, 75.8682],
    popularTimes: 'Busy 24/7 (Train Arrival Waves)',
    nearbyStops: ['Sarwate Central Bus Stand (180m)', 'Platform 1 Taxi Stand', 'Indore Railway Metro Stn (200m)']
  },
  {
    id: '56_dukan',
    name: '56 Dukan (Chappan Dukan)',
    address: 'New Palasia, Near Treasure Island Mall, Indore',
    category: 'food',
    coordinates: [22.7258, 75.8825],
    popularTimes: 'Peak: 6:00 PM - 11:00 PM',
    nearbyStops: ['TI Mall Bus Stop (300m)', 'Palasia Auto Stand (450m)']
  },
  {
    id: 'vijay_nagar',
    name: 'Vijay Nagar Square',
    address: 'AB Road, Scheme 54 PU-4, Indore (452010)',
    category: 'commercial',
    coordinates: [22.7533, 75.8937],
    popularTimes: 'Peak: 9:00 AM - 11:00 AM & 6:00 PM - 9:00 PM',
    nearbyStops: ['Vijay Nagar BRTS Station (50m)', 'C21 Mall E-Rickshaw Bay', 'Vijay Nagar Metro Stn (100m)']
  },
  {
    id: 'rajwada',
    name: 'Rajwada Palace',
    address: 'MG Road, Khajuri Bazar, Old Indore (452002)',
    category: 'transit_hub',
    coordinates: [22.7186, 75.8553],
    popularTimes: 'Peak: 12:00 PM - 8:30 PM',
    nearbyStops: ['Rajwada City Bus Terminal (100m)', 'Sarafa Bazar E-Rickshaw stand (250m)']
  },
  {
    id: 'airport',
    name: 'Devi Ahilya Bai Holkar Airport (IDR)',
    address: 'Dep. Terminal, VIP Road, Indore (452005)',
    category: 'airport',
    coordinates: [22.7218, 75.8011],
    popularTimes: 'Flight waves: 6:00 AM - 9:00 AM & 7:00 PM - 10:00 PM',
    nearbyStops: ['Airport Prepaid Cab Kiosk', 'Aerodrome City Bus Stop (400m)']
  },
  {
    id: 'palasia',
    name: 'Palasia Square (Industry House)',
    address: 'Old Palasia, AB Road / MG Road Junction, Indore',
    category: 'commercial',
    coordinates: [22.7231, 75.8885],
    popularTimes: 'Peak: 9:00 AM - 11:30 AM & 5:30 PM - 8:30 PM',
    nearbyStops: ['Industry House BRTS Stop (100m)', 'Palasia Metro Viaduct (200m)']
  },
  {
    id: 'bhawarkua',
    name: 'Bhawarkua Square (University Gate)',
    address: 'BRTS Corridor, AB Road, Holkar Science College side, Indore',
    category: 'transit_hub',
    coordinates: [22.6922, 75.8661],
    popularTimes: 'Peak: 8:00 AM - 11:00 AM & 4:00 PM - 7:30 PM',
    nearbyStops: ['Bhawarkua iBus Station', 'DAVV Student Shuttle Bay']
  }
];
