import { PrismaClient } from '@prisma/client';
import { TARRANT_COUNTY_TRAP_LOCATIONS, TrapLocationData } from './tarrant-county-locations';
import { addWeeks, addDays, startOfYear, endOfYear, getWeek, getYear, format } from 'date-fns';

const prisma = new PrismaClient();

interface SeasonalPattern {
  month: number;
  averagePoolSize: number;
  positivityRate: number;
  dominantSpecies: string[];
  collectionMultiplier: number; // Number of collections relative to baseline
  weatherConditions: string[];
}

interface OutbreakScenario {
  name: string;
  startDate: Date;
  endDate: Date;
  affectedAreas: string[];
  elevatedPositivityRate: number;
  description: string;
}

/**
 * Seasonal patterns based on North Texas WNV surveillance data
 */
const SEASONAL_PATTERNS: SeasonalPattern[] = [
  {
    month: 1, // January - Low activity
    averagePoolSize: 12,
    positivityRate: 0.000,
    dominantSpecies: ['CULEX_PIPIENS'],
    collectionMultiplier: 0.1,
    weatherConditions: ['Cold', 'Frost']
  },
  {
    month: 2, // February - Minimal activity
    averagePoolSize: 8,
    positivityRate: 0.000,
    dominantSpecies: ['CULEX_PIPIENS'],
    collectionMultiplier: 0.1,
    weatherConditions: ['Cold', 'Variable']
  },
  {
    month: 3, // March - Early spring emergence
    averagePoolSize: 15,
    positivityRate: 0.001,
    dominantSpecies: ['CULEX_PIPIENS', 'CULEX_RESTUANS'],
    collectionMultiplier: 0.3,
    weatherConditions: ['Cool', 'Rainy']
  },
  {
    month: 4, // April - Increasing activity
    averagePoolSize: 22,
    positivityRate: 0.003,
    dominantSpecies: ['CULEX_PIPIENS', 'CULEX_RESTUANS', 'AEDES_VEXANS'],
    collectionMultiplier: 0.6,
    weatherConditions: ['Mild', 'Rainy', 'Warm']
  },
  {
    month: 5, // May - Spring activity
    averagePoolSize: 31,
    positivityRate: 0.008,
    dominantSpecies: ['CULEX_QUINQUEFASCIATUS', 'CULEX_PIPIENS', 'AEDES_VEXANS'],
    collectionMultiplier: 0.8,
    weatherConditions: ['Warm', 'Humid', 'Stormy']
  },
  {
    month: 6, // June - Early summer
    averagePoolSize: 42,
    positivityRate: 0.018,
    dominantSpecies: ['CULEX_QUINQUEFASCIATUS', 'CULEX_TARSALIS'],
    collectionMultiplier: 1.0,
    weatherConditions: ['Hot', 'Humid', 'Thunderstorms']
  },
  {
    month: 7, // July - Peak season
    averagePoolSize: 47,
    positivityRate: 0.024,
    dominantSpecies: ['CULEX_QUINQUEFASCIATUS', 'CULEX_TARSALIS'],
    collectionMultiplier: 1.2,
    weatherConditions: ['Hot', 'Humid', 'Severe storms']
  },
  {
    month: 8, // August - Continued high activity
    averagePoolSize: 52,
    positivityRate: 0.031,
    dominantSpecies: ['CULEX_QUINQUEFASCIATUS', 'CULEX_TARSALIS'],
    collectionMultiplier: 1.3,
    weatherConditions: ['Very hot', 'Humid', 'Drought conditions']
  },
  {
    month: 9, // September - Late summer
    averagePoolSize: 38,
    positivityRate: 0.022,
    dominantSpecies: ['CULEX_QUINQUEFASCIATUS', 'CULEX_PIPIENS'],
    collectionMultiplier: 1.0,
    weatherConditions: ['Hot', 'Variable humidity']
  },
  {
    month: 10, // October - Declining activity
    averagePoolSize: 28,
    positivityRate: 0.012,
    dominantSpecies: ['CULEX_QUINQUEFASCIATUS', 'CULEX_PIPIENS'],
    collectionMultiplier: 0.7,
    weatherConditions: ['Warm', 'Cool nights']
  },
  {
    month: 11, // November - Low activity
    averagePoolSize: 18,
    positivityRate: 0.004,
    dominantSpecies: ['CULEX_PIPIENS'],
    collectionMultiplier: 0.4,
    weatherConditions: ['Cool', 'Dry']
  },
  {
    month: 12, // December - Minimal activity
    averagePoolSize: 10,
    positivityRate: 0.001,
    dominantSpecies: ['CULEX_PIPIENS'],
    collectionMultiplier: 0.2,
    weatherConditions: ['Cold', 'Dry']
  }
];

/**
 * Historical outbreak scenarios for realistic data patterns
 */
const OUTBREAK_SCENARIOS: OutbreakScenario[] = [
  {
    name: 'SUMMER_2023_OUTBREAK',
    startDate: new Date('2023-07-15'),
    endDate: new Date('2023-08-30'),
    affectedAreas: ['North Richland Hills', 'Hurst', 'Bedford', 'Euless'],
    elevatedPositivityRate: 0.087, // 8.7% elevated rate
    description: 'Elevated WNV activity in northeast Tarrant County following heavy rains and hot temperatures'
  },
  {
    name: 'DROUGHT_CONDITIONS_2022',
    startDate: new Date('2022-06-01'),
    endDate: new Date('2022-09-15'),
    affectedAreas: ['Arlington', 'Grand Prairie', 'Mansfield'],
    elevatedPositivityRate: 0.045, // 4.5% elevated rate
    description: 'Concentrated WNV activity near permanent water sources during severe drought'
  },
  {
    name: 'EARLY_SEASON_2024',
    startDate: new Date('2024-05-15'),
    endDate: new Date('2024-06-30'),
    affectedAreas: ['Fort Worth', 'White Settlement', 'Benbrook'],
    elevatedPositivityRate: 0.032, // 3.2% elevated rate
    description: 'Unusually early WNV activity following wet spring conditions'
  }
];

/**
 * Generate realistic mosquito pool samples for a given date range
 */
async function generateMosquitoPoolData(
  startDate: Date,
  endDate: Date,
  laboratoryId: string,
  trapLocations: any[]
): Promise<void> {
  console.log(`Generating mosquito pool data from ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`);
  
  const currentDate = new Date(startDate);
  let totalSamples = 0;
  let positiveSamples = 0;

  while (currentDate <= endDate) {
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const week = getWeek(currentDate);
    
    // Get seasonal pattern for this month
    const seasonalPattern = SEASONAL_PATTERNS.find(p => p.month === month) || SEASONAL_PATTERNS[0];
    
    // Check if this date falls within an outbreak period
    const activeOutbreak = OUTBREAK_SCENARIOS.find(outbreak => 
      currentDate >= outbreak.startDate && currentDate <= outbreak.endDate
    );
    
    // Determine number of samples for this day (typically 2-3 collection days per week)
    const dayOfWeek = currentDate.getDay();
    const isCollectionDay = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Mon, Wed, Fri
    
    if (isCollectionDay && Math.random() < seasonalPattern.collectionMultiplier) {
      // Number of traps to collect from (varies by season and day)
      const baseTrapsPerDay = Math.floor(trapLocations.length * 0.15); // 15% of traps per collection day
      const seasonalMultiplier = seasonalPattern.collectionMultiplier;
      const trapsToCollect = Math.max(1, Math.floor(baseTrapsPerDay * seasonalMultiplier * (0.8 + Math.random() * 0.4)));
      
      // Randomly select traps for collection
      const selectedTraps = trapLocations
        .sort(() => Math.random() - 0.5)
        .slice(0, trapsToCollect);
      
      for (const trap of selectedTraps) {
        // Determine if this area is affected by outbreak
        const isOutbreakArea = activeOutbreak?.affectedAreas.some(area => 
          trap.city.includes(area) || trap.address.includes(area)
        ) || false;
        
        // Calculate positivity rate
        let positivityRate = seasonalPattern.positivityRate;
        if (isOutbreakArea && activeOutbreak) {
          positivityRate = activeOutbreak.elevatedPositivityRate;
        }
        
        // Add some natural variation
        positivityRate *= (0.7 + Math.random() * 0.6);
        
        // Generate pool size based on seasonal pattern and trap characteristics
        let poolSize = Math.floor(seasonalPattern.averagePoolSize * (0.6 + Math.random() * 0.8));
        
        // Adjust pool size based on habitat and water source
        if (trap.habitat === 'WETLAND' || trap.waterSource === 'LAKE') {
          poolSize *= 1.3;
        } else if (trap.habitat === 'URBAN' || trap.waterSource === 'STORM_DRAIN') {
          poolSize *= 0.8;
        }
        
        poolSize = Math.max(1, Math.min(100, poolSize));
        
        // Determine mosquito species based on season and location
        const dominantSpecies = seasonalPattern.dominantSpecies;
        const species = dominantSpecies[Math.floor(Math.random() * dominantSpecies.length)];
        
        // Determine test result
        const isPositive = Math.random() < positivityRate;
        let testResult = isPositive ? 'POSITIVE' : 'NEGATIVE';
        
        // Add some invalid/inconclusive results (realistic lab conditions)
        if (Math.random() < 0.02) { // 2% invalid rate
          testResult = Math.random() < 0.5 ? 'INVALID' : 'INCONCLUSIVE';
        }
        
        // Generate CT value for positive samples
        let ctValue = null;
        let internalControlCt = null;
        
        if (testResult === 'POSITIVE') {
          ctValue = 25 + Math.random() * 10; // CT values typically 25-35 for positives
          internalControlCt = 20 + Math.random() * 8; // Internal control 20-28
        } else if (testResult === 'NEGATIVE') {
          internalControlCt = 20 + Math.random() * 8;
        }
        
        // Generate pool ID
        const poolId = `${trap.trapId}-${format(currentDate, 'yyyyMMdd')}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
        
        // Pool condition based on collection date and weather
        const poolConditions = ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'];
        const conditionWeights = [0.4, 0.35, 0.2, 0.05]; // Most samples in good condition
        const poolCondition = weightedRandom(poolConditions, conditionWeights);
        
        // Weather conditions for the day
        const weatherConditions = seasonalPattern.weatherConditions;
        const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        // Generate environmental data
        const temperature = generateTemperature(month);
        const humidity = generateHumidity(month);
        
        // Generate collector names (realistic field staff)
        const collectors = [
          'Dr. Sarah Johnson',
          'Mike Rodriguez',
          'Emily Chen',
          'David Thompson',
          'Lisa Martinez',
          'James Wilson',
          'Maria Garcia',
          'Robert Lee',
          'Jennifer Davis',
          'Carlos Sanchez'
        ];
        const collectedBy = collectors[Math.floor(Math.random() * collectors.length)];
        
        try {
          // Create the mosquito pool sample
          await prisma.mosquitoPool.create({
            data: {
              poolId,
              trapLocationId: trap.id,
              collectionDate: new Date(currentDate),
              collectionWeek: week,
              collectionYear: year,
              collectedBy,
              mosquitoSpecies: species as any,
              poolSize,
              poolCondition: poolCondition as any,
              testResult: testResult as any,
              ctValue,
              internalControlCt,
              qcStatus: testResult === 'INVALID' ? 'FAIL' : 'PASS',
              temperature,
              humidity,
              weatherConditions: weather,
              collectionLatitude: trap.latitude + (Math.random() - 0.5) * 0.001, // Small GPS variation
              collectionLongitude: trap.longitude + (Math.random() - 0.5) * 0.001,
              laboratoryId,
              notes: generateSampleNotes(species, poolCondition, weather, isOutbreakArea)
            }
          });
          
          totalSamples++;
          if (isPositive) positiveSamples++;
          
        } catch (error) {
          console.error(`Error creating sample ${poolId}:`, error);
        }
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    
    // Progress update every 30 days
    if (totalSamples % 100 === 0) {
      console.log(`Generated ${totalSamples} samples so far (${positiveSamples} positive, ${((positiveSamples/totalSamples)*100).toFixed(1)}% rate)`);
    }
  }
  
  console.log(`✓ Generated ${totalSamples} mosquito pool samples (${positiveSamples} positive, ${((positiveSamples/totalSamples)*100).toFixed(1)}% positivity rate)`);
}

/**
 * Generate realistic weather data for North Texas
 */
async function generateWeatherData(startDate: Date, endDate: Date): Promise<void> {
  console.log('Generating weather data...');
  
  const currentDate = new Date(startDate);
  let weatherRecords = 0;
  
  // Tarrant County center coordinates
  const centerLat = 32.7556;
  const centerLng = -97.3308;
  
  while (currentDate <= endDate) {
    const month = currentDate.getMonth() + 1;
    
    // Generate realistic temperature for North Texas
    const { tempMax, tempMin, tempAvg } = generateDailyTemperature(month, currentDate);
    
    // Generate precipitation
    const precipitation = generatePrecipitation(month);
    
    // Generate humidity
    const humidityAvg = generateHumidity(month);
    const humidityMax = Math.min(100, humidityAvg + Math.random() * 15);
    const humidityMin = Math.max(0, humidityAvg - Math.random() * 20);
    
    // Generate wind
    const windSpeed = 5 + Math.random() * 25; // 5-30 km/h
    const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const windDirection = windDirections[Math.floor(Math.random() * windDirections.length)];
    
    // Generate barometric pressure
    const barometricPressure = 1013 + (Math.random() - 0.5) * 40; // 993-1033 hPa
    
    // Calculate degree days (base 10°C for mosquito development)
    const degreeDay = Math.max(0, tempAvg - 10);
    
    try {
      await prisma.weatherData.create({
        data: {
          date: new Date(currentDate),
          temperatureMax: tempMax,
          temperatureMin: tempMin,
          temperatureAvg: tempAvg,
          precipitation,
          humidityAvg,
          humidityMax,
          humidityMin,
          windSpeed,
          windDirection,
          barometricPressure,
          latitude: centerLat,
          longitude: centerLng,
          degreeDay,
          daysAboveThreshold: tempAvg > 15 ? 1 : 0,
          weatherStation: 'DFW_AIRPORT',
          dataSource: 'NOAA'
        }
      });
      
      weatherRecords++;
    } catch (error) {
      console.error(`Error creating weather record for ${format(currentDate, 'yyyy-MM-dd')}:`, error);
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log(`✓ Generated ${weatherRecords} weather records`);
}

/**
 * Generate PCR batches for testing samples
 */
async function generatePCRBatches(laboratoryId: string, equipmentId?: string): Promise<void> {
  console.log('Generating PCR batches...');
  
  // Get all pending samples
  const pendingSamples = await prisma.mosquitoPool.findMany({
    where: {
      laboratoryId,
      testResult: { in: ['POSITIVE', 'NEGATIVE', 'INCONCLUSIVE', 'INVALID'] },
      pcrBatchId: null
    },
    orderBy: { collectionDate: 'asc' }
  });
  
  console.log(`Found ${pendingSamples.length} samples to batch`);
  
  // Group samples into batches of 90 (96-well plate minus controls)
  const batchSize = 90;
  let batchCount = 0;
  
  for (let i = 0; i < pendingSamples.length; i += batchSize) {
    const batchSamples = pendingSamples.slice(i, i + batchSize);
    const batchDate = batchSamples[0].collectionDate;
    
    // Add 1-3 days for realistic lab processing time
    const processingDate = addDays(batchDate, 1 + Math.floor(Math.random() * 3));
    
    const batchId = `PCR-${format(processingDate, 'yyyyMMdd')}-${(batchCount + 1).toString().padStart(3, '0')}`;
    
    // Realistic technician names
    const technicians = [
      'Dr. Jennifer Walsh',
      'Michael Chen',
      'Sarah Rodriguez',
      'David Kim',
      'Lisa Thompson'
    ];
    const technician = technicians[Math.floor(Math.random() * technicians.length)];
    
    // PCR protocols
    const protocols = [
      'CDC ArboMAX Real-time RT-PCR',
      'TaqMan WNV Assay v2.1',
      'Custom WNV RT-qPCR Protocol'
    ];
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    
    try {
      const pcrBatch = await prisma.pCRBatch.create({
        data: {
          batchId,
          batchDate: processingDate,
          plateLayout: 'PLATE_96',
          technician,
          protocol,
          kitLotNumber: `LOT${Math.floor(Math.random() * 9999999).toString().padStart(7, '0')}`,
          equipmentId,
          thermalCycler: 'Applied Biosystems 7500 Fast',
          status: 'COMPLETED',
          completedAt: addDays(processingDate, 1),
          validatedAt: addDays(processingDate, 1),
          validatedBy: technician,
          positiveControls: [
            { well: 'H10', controlType: 'WNV_POSITIVE', expectedCt: 28.5 },
            { well: 'H11', controlType: 'WNV_POSITIVE_LOW', expectedCt: 32.1 }
          ],
          negativeControls: [
            { well: 'H12', controlType: 'WATER_NEGATIVE' }
          ],
          internalControls: [
            { well: 'H7', controlType: 'MS2_INTERNAL', expectedCtRange: { min: 20, max: 28 } },
            { well: 'H8', controlType: 'MS2_INTERNAL', expectedCtRange: { min: 20, max: 28 } },
            { well: 'H9', controlType: 'MS2_INTERNAL', expectedCtRange: { min: 20, max: 28 } }
          ],
          positiveControlCt: 28.5,
          internalControlRange: { min: 22.3, max: 26.8 },
          overallQcStatus: 'PASS',
          laboratoryId
        }
      });
      
      // Assign samples to this batch
      await prisma.mosquitoPool.updateMany({
        where: {
          id: { in: batchSamples.map(s => s.id) }
        },
        data: {
          pcrBatchId: pcrBatch.id
        }
      });
      
      batchCount++;
      
    } catch (error) {
      console.error(`Error creating PCR batch ${batchId}:`, error);
    }
  }
  
  console.log(`✓ Generated ${batchCount} PCR batches`);
}

/**
 * Main function to generate all demo data
 */
export async function generateDemoData(laboratoryId: string): Promise<void> {
  console.log('🚀 Starting demo data generation for West Nile Virus surveillance...');
  
  try {
    // 1. Create trap locations
    console.log('Creating trap locations...');
    const trapLocations = [];
    
    for (const location of TARRANT_COUNTY_TRAP_LOCATIONS) {
      try {
        const trapLocation = await prisma.trapLocation.create({
          data: {
            ...location,
            laboratoryId
          }
        });
        trapLocations.push(trapLocation);
      } catch (error) {
        // Handle duplicate trap IDs gracefully
        if (error instanceof Error && error.message.includes('Unique constraint')) {
          console.log(`Trap ${location.trapId} already exists, skipping...`);
          const existingTrap = await prisma.trapLocation.findUnique({
            where: { trapId: location.trapId }
          });
          if (existingTrap) {
            trapLocations.push(existingTrap);
          }
        } else {
          console.error(`Error creating trap ${location.trapId}:`, error);
        }
      }
    }
    
    console.log(`✓ Created/found ${trapLocations.length} trap locations`);
    
    // 2. Generate weather data for 3 years
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2024-12-31');
    await generateWeatherData(startDate, endDate);
    
    // 3. Generate mosquito pool samples for 3 years
    await generateMosquitoPoolData(startDate, endDate, laboratoryId, trapLocations);
    
    // 4. Find or create PCR equipment
    let equipment = await prisma.equipment.findFirst({
      where: {
        laboratoryId,
        equipmentType: 'ANALYZER'
      }
    });
    
    if (!equipment) {
      equipment = await prisma.equipment.create({
        data: {
          name: 'Applied Biosystems 7500 Fast Real-Time PCR System',
          model: '7500 Fast',
          serialNumber: `AB${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
          manufacturer: 'Applied Biosystems',
          equipmentType: 'ANALYZER',
          location: 'Molecular Biology Lab',
          status: 'ACTIVE',
          laboratoryId
        }
      });
    }
    
    // 5. Generate PCR batches
    await generatePCRBatches(laboratoryId, equipment.id);
    
    // 6. Generate surveillance alerts for outbreak periods
    console.log('Generating surveillance alerts...');
    let alertCount = 0;
    
    for (const scenario of OUTBREAK_SCENARIOS) {
      try {
        await prisma.surveillanceAlert.create({
          data: {
            alertType: 'ELEVATED_ACTIVITY',
            severity: scenario.elevatedPositivityRate > 0.05 ? 'HIGH' : 'MODERATE',
            title: `${scenario.name.replace(/_/g, ' ')} - Elevated WNV Activity`,
            description: scenario.description,
            affectedAreas: scenario.affectedAreas,
            startDate: scenario.startDate,
            endDate: scenario.endDate,
            publicHealthResponse: scenario.elevatedPositivityRate > 0.05 ? 'ADVISORY_ISSUED' : 'ENHANCED_SURVEILLANCE',
            positivityRate: scenario.elevatedPositivityRate,
            recommendedActions: [
              'Increase mosquito surveillance in affected areas',
              'Implement vector control measures',
              'Notify public health authorities',
              'Consider public health advisories'
            ],
            laboratoryId
          }
        });
        alertCount++;
      } catch (error) {
        console.error(`Error creating alert for ${scenario.name}:`, error);
      }
    }
    
    console.log(`✓ Generated ${alertCount} surveillance alerts`);
    
    // 7. Display summary statistics
    const stats = await prisma.mosquitoPool.groupBy({
      by: ['testResult'],
      where: { laboratoryId },
      _count: true
    });
    
    const totalSamples = stats.reduce((sum, stat) => sum + stat._count, 0);
    const positiveSamples = stats.find(s => s.testResult === 'POSITIVE')?._count || 0;
    const positivityRate = totalSamples > 0 ? (positiveSamples / totalSamples * 100).toFixed(2) : '0.00';
    
    console.log('\n🎉 Demo data generation completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • Trap locations: ${trapLocations.length}`);
    console.log(`   • Total samples: ${totalSamples}`);
    console.log(`   • Positive samples: ${positiveSamples}`);
    console.log(`   • Positivity rate: ${positivityRate}%`);
    console.log(`   • Weather records: ${await prisma.weatherData.count()}`);
    console.log(`   • PCR batches: ${await prisma.pCRBatch.count({ where: { laboratoryId } })}`);
    console.log(`   • Surveillance alerts: ${alertCount}`);
    
  } catch (error) {
    console.error('❌ Error generating demo data:', error);
    throw error;
  }
}

// Helper functions

function weightedRandom(items: string[], weights: number[]): string {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}

function generateTemperature(month: number): number {
  // Average temperatures for North Texas (Celsius)
  const avgTemps = [8, 11, 16, 21, 26, 31, 34, 34, 29, 23, 15, 9];
  const baseTemp = avgTemps[month - 1];
  return baseTemp + (Math.random() - 0.5) * 8; // ±4°C variation
}

function generateDailyTemperature(month: number, date: Date): { tempMax: number; tempMin: number; tempAvg: number } {
  const avgTemp = generateTemperature(month);
  const dailyRange = 8 + Math.random() * 8; // 8-16°C daily range
  
  const tempMax = avgTemp + dailyRange / 2;
  const tempMin = avgTemp - dailyRange / 2;
  const tempAvg = (tempMax + tempMin) / 2;
  
  return { tempMax, tempMin, tempAvg };
}

function generateHumidity(month: number): number {
  // Average humidity for North Texas
  const avgHumidity = [65, 60, 55, 60, 70, 75, 70, 65, 70, 65, 65, 70];
  const baseHumidity = avgHumidity[month - 1];
  return Math.max(0, Math.min(100, baseHumidity + (Math.random() - 0.5) * 20));
}

function generatePrecipitation(month: number): number {
  // Monthly precipitation patterns for North Texas (mm)
  const avgPrecip = [45, 50, 75, 85, 120, 90, 60, 50, 70, 85, 55, 45];
  const monthlyTotal = avgPrecip[month - 1];
  
  // Distribute monthly total across ~8 rainy days
  if (Math.random() < 0.25) { // 25% chance of rain on any day
    return Math.random() * (monthlyTotal / 8) * 2; // Variable daily amounts
  }
  return 0;
}

function generateSampleNotes(species: string, condition: string, weather: string, isOutbreakArea: boolean): string | null {
  const notes = [];
  
  if (species === 'MIXED') {
    notes.push('Multiple species present in pool');
  }
  
  if (condition === 'POOR' || condition === 'DEGRADED') {
    notes.push('Poor specimen condition - prolonged storage suspected');
  }
  
  if (weather.includes('storm') || weather.includes('rain')) {
    notes.push('Collected following precipitation event');
  }
  
  if (isOutbreakArea) {
    notes.push('Enhanced surveillance area');
  }
  
  // Add random operational notes occasionally
  if (Math.random() < 0.1) {
    const operationalNotes = [
      'GPS coordinates verified',
      'Trap maintenance performed',
      'High mosquito activity observed',
      'New trap location',
      'Backup collection performed',
      'Extended collection period'
    ];
    notes.push(operationalNotes[Math.floor(Math.random() * operationalNotes.length)]);
  }
  
  return notes.length > 0 ? notes.join('; ') : null;
}

export default generateDemoData;