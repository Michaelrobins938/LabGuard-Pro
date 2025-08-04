import { HabitatType, WaterSourceType } from '@prisma/client';

export interface TrapLocationData {
  trapId: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  zipCode: string;
  county: string;
  state: string;
  habitat: HabitatType;
  waterSource: WaterSourceType;
  isActive: boolean;
  installDate?: Date;
  notes?: string;
}

/**
 * Realistic trap locations across Tarrant County, Texas
 * Based on actual geographic areas and mosquito surveillance best practices
 */
export const TARRANT_COUNTY_TRAP_LOCATIONS: TrapLocationData[] = [
  // Arlington locations
  {
    trapId: 'ARL001',
    latitude: 32.7357,
    longitude: -97.1081,
    address: '1776 E Lamar Blvd',
    city: 'Arlington',
    zipCode: '76006',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-03-15'),
    notes: 'Near Johnson Creek, high mosquito activity during summer months'
  },
  {
    trapId: 'ARL002',
    latitude: 32.7015,
    longitude: -97.1384,
    address: '2100 W Park Row Dr',
    city: 'Arlington',
    zipCode: '76013',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'POND',
    isActive: true,
    installDate: new Date('2022-03-20'),
    notes: 'Near Veterans Park pond, diverse mosquito species'
  },
  {
    trapId: 'ARL003',
    latitude: 32.7558,
    longitude: -97.0671,
    address: '1200 Stadium Dr',
    city: 'Arlington',
    zipCode: '76011',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-04-01'),
    notes: 'Entertainment district, storm water management area'
  },
  {
    trapId: 'ARL004',
    latitude: 32.6596,
    longitude: -97.1398,
    address: '2801 W Division St',
    city: 'Arlington',
    zipCode: '76012',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'INDUSTRIAL',
    waterSource: 'RETENTION_POND',
    isActive: true,
    installDate: new Date('2022-04-10'),
    notes: 'Industrial area with water retention features'
  },

  // Fort Worth locations
  {
    trapId: 'FTW001',
    latitude: 32.7555,
    longitude: -97.3308,
    address: '200 E Weatherford St',
    city: 'Fort Worth',
    zipCode: '76102',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'FOUNTAIN',
    isActive: true,
    installDate: new Date('2022-02-28'),
    notes: 'Downtown area, decorative fountains nearby'
  },
  {
    trapId: 'FTW002',
    latitude: 32.8207,
    longitude: -97.3959,
    address: '6251 Oakmont Trail',
    city: 'Fort Worth',
    zipCode: '76132',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-03-05'),
    notes: 'Residential area with efficient storm drainage'
  },
  {
    trapId: 'FTW003',
    latitude: 32.7336,
    longitude: -97.4411,
    address: '3400 Hulen St',
    city: 'Fort Worth',
    zipCode: '76107',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'COMMERCIAL',
    waterSource: 'IRRIGATION',
    isActive: true,
    installDate: new Date('2022-03-12'),
    notes: 'Commercial district with landscape irrigation systems'
  },
  {
    trapId: 'FTW004',
    latitude: 32.6861,
    longitude: -97.2461,
    address: '4001 S Freeway',
    city: 'Fort Worth',
    zipCode: '76115',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'INDUSTRIAL',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-03-18'),
    notes: 'Near Trinity River, industrial complex'
  },
  {
    trapId: 'FTW005',
    latitude: 32.8624,
    longitude: -97.2908,
    address: '8200 NE Loop 820',
    city: 'Fort Worth',
    zipCode: '76180',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'LAKE',
    isActive: true,
    installDate: new Date('2022-04-02'),
    notes: 'Near Eagle Mountain Lake, seasonal high activity'
  },

  // Grand Prairie locations
  {
    trapId: 'GP001',
    latitude: 32.7459,
    longitude: -96.9978,
    address: '300 W Main St',
    city: 'Grand Prairie',
    zipCode: '75050',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-04-15'),
    notes: 'City center, urban development area'
  },
  {
    trapId: 'GP002',
    latitude: 32.7073,
    longitude: -97.0284,
    address: '2500 Arkansas Ln',
    city: 'Grand Prairie',
    zipCode: '75052',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'PARK',
    waterSource: 'POND',
    isActive: true,
    installDate: new Date('2022-04-20'),
    notes: 'Lynn Creek Park, recreational water features'
  },
  {
    trapId: 'GP003',
    latitude: 32.6984,
    longitude: -96.9653,
    address: '1234 Belt Line Rd',
    city: 'Grand Prairie',
    zipCode: '75051',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'COMMERCIAL',
    waterSource: 'IRRIGATION',
    isActive: true,
    installDate: new Date('2022-05-01'),
    notes: 'Shopping center area with landscape watering'
  },

  // Irving locations
  {
    trapId: 'IRV001',
    latitude: 32.8140,
    longitude: -96.9489,
    address: '825 W Irving Blvd',
    city: 'Irving',
    zipCode: '75060',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-05-10'),
    notes: 'Near Elm Fork Trinity River'
  },
  {
    trapId: 'IRV002',
    latitude: 32.8729,
    longitude: -96.9847,
    address: '5201 N MacArthur Blvd',
    city: 'Irving',
    zipCode: '75038',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'COMMERCIAL',
    waterSource: 'RETENTION_POND',
    isActive: true,
    installDate: new Date('2022-05-15'),
    notes: 'Business district with water management features'
  },

  // Euless locations
  {
    trapId: 'EUL001',
    latitude: 32.8371,
    longitude: -97.0820,
    address: '201 N Ector Dr',
    city: 'Euless',
    zipCode: '76039',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-05-20'),
    notes: 'City hall area, urban drainage systems'
  },
  {
    trapId: 'EUL002',
    latitude: 32.8507,
    longitude: -97.0648,
    address: '800 W Euless Blvd',
    city: 'Euless',
    zipCode: '76040',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'PARK',
    waterSource: 'POND',
    isActive: true,
    installDate: new Date('2022-05-25'),
    notes: 'Bob Eden Park, recreational pond'
  },

  // Bedford locations
  {
    trapId: 'BED001',
    latitude: 32.8441,
    longitude: -97.1431,
    address: '2000 Forest Ridge Dr',
    city: 'Bedford',
    zipCode: '76021',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-06-01'),
    notes: 'Residential area with mature trees'
  },
  {
    trapId: 'BED002',
    latitude: 32.8298,
    longitude: -97.1534,
    address: '1600 Airport Fwy',
    city: 'Bedford',
    zipCode: '76022',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'COMMERCIAL',
    waterSource: 'IRRIGATION',
    isActive: true,
    installDate: new Date('2022-06-05'),
    notes: 'Commercial corridor with landscaping'
  },

  // Hurst locations
  {
    trapId: 'HUR001',
    latitude: 32.8234,
    longitude: -97.1706,
    address: '1505 Karla Dr',
    city: 'Hurst',
    zipCode: '76053',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-06-10'),
    notes: 'Residential subdivision'
  },
  {
    trapId: 'HUR002',
    latitude: 32.8464,
    longitude: -97.1856,
    address: '700 W Pipeline Rd',
    city: 'Hurst',
    zipCode: '76054',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'PARK',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-06-15'),
    notes: 'Near Big Bear Creek, wetland habitat'
  },

  // Mansfield locations
  {
    trapId: 'MAN001',
    latitude: 32.5632,
    longitude: -97.1417,
    address: '1200 E Broad St',
    city: 'Mansfield',
    zipCode: '76063',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-06-20'),
    notes: 'Historic downtown area'
  },
  {
    trapId: 'MAN002',
    latitude: 32.5896,
    longitude: -97.1089,
    address: '2200 Country Club Dr',
    city: 'Mansfield',
    zipCode: '76063',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'PARK',
    waterSource: 'POND',
    isActive: true,
    installDate: new Date('2022-06-25'),
    notes: 'Mansfield National Golf Club area'
  },

  // Burleson locations
  {
    trapId: 'BUR001',
    latitude: 32.5421,
    longitude: -97.3209,
    address: '141 W Ellison St',
    city: 'Burleson',
    zipCode: '76028',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-07-01'),
    notes: 'Near Brushy Creek'
  },
  {
    trapId: 'BUR002',
    latitude: 32.5693,
    longitude: -97.2931,
    address: '1160 SW Wilshire Blvd',
    city: 'Burleson',
    zipCode: '76028',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'COMMERCIAL',
    waterSource: 'RETENTION_POND',
    isActive: true,
    installDate: new Date('2022-07-05'),
    notes: 'Shopping center with water features'
  },

  // Weatherford locations
  {
    trapId: 'WEA001',
    latitude: 32.7593,
    longitude: -97.7973,
    address: '212 W Church St',
    city: 'Weatherford',
    zipCode: '76086',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-07-10'),
    notes: 'Historic courthouse square'
  },
  {
    trapId: 'WEA002',
    latitude: 32.7123,
    longitude: -97.8234,
    address: '2000 Fort Worth Hwy',
    city: 'Weatherford',
    zipCode: '76086',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-07-15'),
    notes: 'Near Clear Fork Trinity River'
  },

  // Southlake locations
  {
    trapId: 'SOU001',
    latitude: 32.9412,
    longitude: -97.1342,
    address: '1400 Main St',
    city: 'Southlake',
    zipCode: '76092',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'COMMERCIAL',
    waterSource: 'FOUNTAIN',
    isActive: true,
    installDate: new Date('2022-07-20'),
    notes: 'Town Square, upscale shopping area'
  },
  {
    trapId: 'SOU002',
    latitude: 32.9341,
    longitude: -97.1567,
    address: '300 Kirkwood Blvd',
    city: 'Southlake',
    zipCode: '76092',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'PARK',
    waterSource: 'LAKE',
    isActive: true,
    installDate: new Date('2022-07-25'),
    notes: 'Near Grapevine Lake, recreational area'
  },

  // Grapevine locations
  {
    trapId: 'GRA001',
    latitude: 32.9342,
    longitude: -97.0778,
    address: '200 S Main St',
    city: 'Grapevine',
    zipCode: '76051',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-08-01'),
    notes: 'Historic downtown, near Denton Creek'
  },
  {
    trapId: 'GRA002',
    latitude: 32.9023,
    longitude: -97.0456,
    address: '1800 E Northwest Hwy',
    city: 'Grapevine',
    zipCode: '76051',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'PARK',
    waterSource: 'LAKE',
    isActive: true,
    installDate: new Date('2022-08-05'),
    notes: 'Grapevine Lake area, high seasonal activity'
  },

  // Colleyville locations
  {
    trapId: 'COL001',
    latitude: 32.8809,
    longitude: -97.1550,
    address: '5300 Riverwalk Dr',
    city: 'Colleyville',
    zipCode: '76034',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-08-10'),
    notes: 'Affluent residential area near creek'
  },
  {
    trapId: 'COL002',
    latitude: 32.9067,
    longitude: -97.1423,
    address: '6801 Colleyville Blvd',
    city: 'Colleyville',
    zipCode: '76034',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'COMMERCIAL',
    waterSource: 'IRRIGATION',
    isActive: true,
    installDate: new Date('2022-08-15'),
    notes: 'Shopping center with extensive landscaping'
  },

  // Keller locations
  {
    trapId: 'KEL001',
    latitude: 32.9343,
    longitude: -97.2512,
    address: '1100 Bear Creek Pkwy',
    city: 'Keller',
    zipCode: '76248',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-08-20'),
    notes: 'Near Bear Creek, family neighborhood'
  },
  {
    trapId: 'KEL002',
    latitude: 32.9145,
    longitude: -97.2298,
    address: '1200 Johnson Rd',
    city: 'Keller',
    zipCode: '76248',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'PARK',
    waterSource: 'POND',
    isActive: true,
    installDate: new Date('2022-08-25'),
    notes: 'Bear Creek Park, recreational facilities'
  },

  // North Richland Hills locations
  {
    trapId: 'NRH001',
    latitude: 32.8342,
    longitude: -97.2289,
    address: '7301 NE Loop 820',
    city: 'North Richland Hills',
    zipCode: '76180',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-09-01'),
    notes: 'Commercial corridor near highway'
  },
  {
    trapId: 'NRH002',
    latitude: 32.8623,
    longitude: -97.2134,
    address: '9000 Boulevard 26',
    city: 'North Richland Hills',
    zipCode: '76180',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'PARK',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-09-05'),
    notes: 'NRH2O Family Water Park area'
  },

  // Richland Hills locations
  {
    trapId: 'RH001',
    latitude: 32.8151,
    longitude: -97.2267,
    address: '3700 Rufe Snow Dr',
    city: 'Richland Hills',
    zipCode: '76118',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-09-10'),
    notes: 'Residential area with older housing stock'
  },

  // Haltom City locations
  {
    trapId: 'HAL001',
    latitude: 32.8007,
    longitude: -97.2692,
    address: '5024 Broadway Ave',
    city: 'Haltom City',
    zipCode: '76117',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-09-15'),
    notes: 'Urban area with mixed commercial/residential'
  },

  // Watauga locations
  {
    trapId: 'WAT001',
    latitude: 32.8579,
    longitude: -97.2545,
    address: '7109 Whitley Rd',
    city: 'Watauga',
    zipCode: '76148',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-09-20'),
    notes: 'Near Fossil Creek, suburban development'
  },

  // White Settlement locations
  {
    trapId: 'WS001',
    latitude: 32.7593,
    longitude: -97.4523,
    address: '214 Meadow Park Dr',
    city: 'White Settlement',
    zipCode: '76108',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-09-25'),
    notes: 'Residential community west of Fort Worth'
  },

  // Crowley locations
  {
    trapId: 'CRO001',
    latitude: 32.5793,
    longitude: -97.3623,
    address: '111 N Crowley Rd',
    city: 'Crowley',
    zipCode: '76036',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'URBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-10-01'),
    notes: 'Small town center, agricultural surroundings'
  },

  // Forest Hill locations
  {
    trapId: 'FH001',
    latitude: 32.6718,
    longitude: -97.2692,
    address: '6300 Forest Hill Dr',
    city: 'Forest Hill',
    zipCode: '76119',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'STORM_DRAIN',
    isActive: true,
    installDate: new Date('2022-10-05'),
    notes: 'Residential area south of Fort Worth'
  },

  // Kennedale locations
  {
    trapId: 'KEN001',
    latitude: 32.6468,
    longitude: -97.2231,
    address: '405 Municipal Dr',
    city: 'Kennedale',
    zipCode: '76060',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'SUBURBAN',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-10-10'),
    notes: 'Near Village Creek, mixed development'
  },

  // Rural/County locations
  {
    trapId: 'TC001',
    latitude: 32.9876,
    longitude: -97.4532,
    address: 'County Road 3955',
    city: 'Reno',
    zipCode: '76020',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'RURAL',
    waterSource: 'POND',
    isActive: true,
    installDate: new Date('2022-10-15'),
    notes: 'Rural area, livestock pond'
  },
  {
    trapId: 'TC002',
    latitude: 32.5123,
    longitude: -97.5234,
    address: 'County Road 917',
    city: 'Aledo',
    zipCode: '76008',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'RURAL',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-10-20'),
    notes: 'Agricultural area near creek'
  },
  {
    trapId: 'TC003',
    latitude: 32.8234,
    longitude: -97.5987,
    address: 'County Road 4876',
    city: 'Springtown',
    zipCode: '76082',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'RURAL',
    waterSource: 'POND',
    isActive: true,
    installDate: new Date('2022-10-25'),
    notes: 'Rural subdivision with stock tanks'
  },

  // Additional strategic locations for comprehensive coverage
  {
    trapId: 'TC004',
    latitude: 32.7234,
    longitude: -97.0987,
    address: 'Trinity River Access Point',
    city: 'Arlington',
    zipCode: '76010',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'WETLAND',
    waterSource: 'CREEK',
    isActive: true,
    installDate: new Date('2022-11-01'),
    notes: 'Trinity River floodplain, high biodiversity'
  },
  {
    trapId: 'TC005',
    latitude: 32.6789,
    longitude: -97.4123,
    address: 'Benbrook Lake Dam',
    city: 'Benbrook',
    zipCode: '76126',
    county: 'Tarrant',
    state: 'TX',
    habitat: 'WETLAND',
    waterSource: 'LAKE',
    isActive: true,
    installDate: new Date('2022-11-05'),
    notes: 'Corps of Engineers property, seasonal monitoring'
  }
];

/**
 * Get trap locations by city
 */
export function getTrapLocationsByCity(city: string): TrapLocationData[] {
  return TARRANT_COUNTY_TRAP_LOCATIONS.filter(
    location => location.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Get trap locations by habitat type
 */
export function getTrapLocationsByHabitat(habitat: HabitatType): TrapLocationData[] {
  return TARRANT_COUNTY_TRAP_LOCATIONS.filter(
    location => location.habitat === habitat
  );
}

/**
 * Get trap locations by water source
 */
export function getTrapLocationsByWaterSource(waterSource: WaterSourceType): TrapLocationData[] {
  return TARRANT_COUNTY_TRAP_LOCATIONS.filter(
    location => location.waterSource === waterSource
  );
}

/**
 * Get trap locations within a radius of a point (in kilometers)
 */
export function getTrapLocationsWithinRadius(
  centerLat: number,
  centerLng: number,
  radiusKm: number
): TrapLocationData[] {
  return TARRANT_COUNTY_TRAP_LOCATIONS.filter(location => {
    const distance = calculateDistance(centerLat, centerLng, location.latitude, location.longitude);
    return distance <= radiusKm;
  });
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export default TARRANT_COUNTY_TRAP_LOCATIONS;