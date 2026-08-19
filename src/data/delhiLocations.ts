import { LocationItem } from '../types';

export const DELHI_LOCATIONS: LocationItem[] = [
  {
    id: 'iit_delhi',
    name: 'IIT Delhi, Hauz Khas',
    address: 'Main Gate, Sri Aurobindo Marg, Hauz Khas, New Delhi (110016)',
    category: 'college',
    coordinates: [28.5450, 77.1926],
    popularTimes: 'Peak: 8:30 AM - 10:00 AM & 5:00 PM - 6:30 PM',
    nearbyStops: ['Hauz Khas Metro Interchange (Gate 2 - 350m)', 'IIT Flyover Bus Stop (150m)', 'SDA Market Auto Stand (200m)'],
    metroLine: 'Yellow & Magenta Lines'
  },
  {
    id: 'ndls_station',
    name: 'New Delhi Railway Station (NDLS)',
    address: 'Bhavbhuti Marg, Ajmeri Gate / Paharganj Side, New Delhi (110006)',
    category: 'station',
    coordinates: [28.6428, 77.2197],
    popularTimes: 'Busy 24/7 (Vande Bharat & Express Waves)',
    nearbyStops: ['New Delhi Metro Stn (Airport Express & Yellow Line)', 'Ajmeri Gate Auto Bay', 'NDLS Prepaid Taxi Kiosk'],
    metroLine: 'Yellow & Airport Express'
  },
  {
    id: 'connaught_place',
    name: 'Connaught Place (Rajiv Chowk)',
    address: 'Inner Circle / Block B, CP, New Delhi (110001)',
    category: 'commercial',
    coordinates: [28.6328, 77.2195],
    popularTimes: 'Peak: 12:00 PM - 9:30 PM',
    nearbyStops: ['Rajiv Chowk Metro Gate 7 (50m)', 'Palika Bazar Transit Bay', 'Barakhamba Road Bus Stop (300m)'],
    metroLine: 'Yellow & Blue Lines'
  },
  {
    id: 'igi_airport',
    name: 'IGI Airport Terminal 3 (DEL)',
    address: 'Departure Ramp, Terminal 3, New Delhi (110037)',
    category: 'airport',
    coordinates: [28.5562, 77.0999],
    popularTimes: 'Flight waves: 5:30 AM - 9:00 AM & 8:00 PM - 1:00 AM',
    nearbyStops: ['Airport T3 Express Metro (Direct Link)', 'Pillar 14 Prepaid Taxi Bay', 'DTC Airport Express Shuttle'],
    metroLine: 'Orange (Airport Express)'
  },
  {
    id: 'cyber_city',
    name: 'Cyber City, DLF Phase 2 (Gurugram)',
    address: 'Building 10 / Cyber Hub, DLF Phase 2, Gurugram (122002)',
    category: 'commercial',
    coordinates: [28.4950, 77.0890],
    popularTimes: 'Peak: 9:00 AM - 11:30 AM & 6:00 PM - 9:00 PM',
    nearbyStops: ['Cyber City Rapid Metro (Direct)', 'Sikanderpur Interchange (1.8km)', 'NH-48 EV Cab Pickup'],
    metroLine: 'Rapid Metro Gurugram'
  },
  {
    id: 'kashmere_gate',
    name: 'Kashmere Gate ISBT Multimodal Hub',
    address: 'Lothian Road, Inter State Bus Terminal, Old Delhi (110006)',
    category: 'transit_hub',
    coordinates: [28.6675, 77.2285],
    popularTimes: 'Peak: 6:00 AM - 10:00 PM (Interstate Buses)',
    nearbyStops: ['Kashmere Gate Triple Interchange (Red/Yellow/Violet)', 'ISBT Interstate Bus Terminus (50m)'],
    metroLine: 'Red, Yellow & Violet Lines'
  },
  {
    id: 'chandni_chowk',
    name: 'Chandni Chowk / Red Fort',
    address: 'Netaji Subhash Marg, Old Delhi (110006)',
    category: 'food',
    coordinates: [28.6505, 77.2303],
    popularTimes: 'Peak: 11:00 AM - 8:30 PM',
    nearbyStops: ['Chandni Chowk Metro Gate 1', 'Lal Quila Metro (250m)', 'Pedestrian Heritage Plaza E-Rickshaws'],
    metroLine: 'Yellow Line'
  },
  {
    id: 'noida_sec_62',
    name: 'Noida Sector 62 (Electronic City)',
    address: 'Electronic City Metro Corridor, Sector 62, Noida (201309)',
    category: 'commercial',
    coordinates: [28.6271, 77.3725],
    popularTimes: 'Peak: 8:30 AM - 10:30 AM & 5:30 PM - 8:00 PM',
    nearbyStops: ['Noida Electronic City Metro (100m)', 'Fortis Hospital Bus Bay (250m)'],
    metroLine: 'Blue Line Extension'
  },
  {
    id: 'saket',
    name: 'Saket District Centre / Select Citywalk',
    address: 'Press Enclave Road, Sector 6, Pushp Vihar, New Delhi',
    category: 'commercial',
    coordinates: [28.5284, 77.2185],
    popularTimes: 'Peak: 1:00 PM - 9:30 PM',
    nearbyStops: ['Malviya Nagar Metro (800m)', 'Saket Metro Stn (900m)', 'Citywalk Auto & Cab Bay'],
    metroLine: 'Yellow Line'
  }
];
