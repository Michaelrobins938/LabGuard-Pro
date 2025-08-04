import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { samples, metrics } = body;

    // Mock AI analysis for development/testing
    const analysis = await performSurveillanceAnalysis(samples || [], metrics || {});

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error performing surveillance analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function performSurveillanceAnalysis(samples: any[], metrics: any) {
  // Mock geographic clustering analysis
  const positiveSamples = samples.filter((s: any) => s.result === 'positive');
  const clusters = detectGeographicClusters(positiveSamples);
  
  // Mock temporal pattern analysis
  const temporalPatterns = analyzeTemporalPatterns(samples);
  
  // Generate AI narrative
  const narrative = generateReportNarrative(metrics);
  
  // Calculate risk assessment
  const riskAssessment = calculateRiskAssessment(metrics, clusters, temporalPatterns);

  return {
    geographic_clusters: clusters,
    temporal_patterns: temporalPatterns,
    report_narrative: narrative,
    risk_assessment: riskAssessment,
    recommendations: generateAIRecommendations(metrics, clusters, temporalPatterns)
  };
}

function detectGeographicClusters(samples: any[]) {
  if (samples.length < 2) {
    return { clusters: [], cluster_count: 0 };
  }

  // Mock clustering algorithm
  const clusters = [
    {
      cluster_id: 1,
      sample_count: Math.min(samples.length, 3),
      center_lat: 32.7767,
      center_lng: -96.7970,
      radius_km: 2.5,
      risk_level: 'medium',
      samples: samples.slice(0, 3).map((s: any, i: number) => ({
        pool_id: s.poolId || `POOL_${i + 1}`,
        latitude: s.latitude || 32.7767 + (Math.random() - 0.5) * 0.01,
        longitude: s.longitude || -96.7970 + (Math.random() - 0.5) * 0.01
      }))
    }
  ];

  return {
    clusters,
    cluster_count: clusters.length,
    total_positive_samples: samples.length
  };
}

function analyzeTemporalPatterns(samples: any[]) {
  if (samples.length < 4) {
    return { anomalies: [], trend: 'insufficient_data' };
  }

  // Mock temporal analysis
  const anomalies = [
    {
      week: 32,
      positive_count: 5,
      expected_count: 2.1,
      z_score: 2.8,
      type: 'spike'
    }
  ];

  return {
    anomalies,
    trend: 'increasing',
    weekly_average: 2.3,
    trend_direction: 'upward'
  };
}

function generateReportNarrative(metrics: any) {
  const totalPools = metrics.totalPools || 0;
  const positivePools = metrics.positivePools || 0;
  const positivityRate = metrics.positivityRate || 0;

  let narrative = `During the reporting period, ${totalPools} mosquito pools were tested for West Nile Virus. `;
  narrative += `Of these, ${positivePools} pools tested positive, resulting in a positivity rate of ${positivityRate.toFixed(1)}%. `;

  if (positivityRate > 15) {
    narrative += "The elevated positivity rate suggests increased viral circulation. Enhanced surveillance and vector control measures are recommended.";
  } else if (positivityRate > 5) {
    narrative += "Moderate viral activity detected. Continue routine surveillance protocols.";
  } else {
    narrative += "Low viral activity observed. Maintain standard surveillance practices.";
  }

  return narrative;
}

function calculateRiskAssessment(metrics: any, clusters: any, temporalPatterns: any) {
  let riskScore = 0;
  const factors: string[] = [];

  // Positivity rate factor
  const positivityRate = metrics.positivityRate || 0;
  if (positivityRate > 15) {
    riskScore += 40;
    factors.push('High positivity rate');
  } else if (positivityRate > 5) {
    riskScore += 20;
    factors.push('Moderate positivity rate');
  }

  // Geographic clustering factor
  if (clusters.cluster_count > 0) {
    riskScore += 30;
    factors.push('Geographic clustering detected');
  }

  // Temporal anomalies factor
  if (temporalPatterns.anomalies && temporalPatterns.anomalies.length > 0) {
    riskScore += 25;
    factors.push('Temporal anomalies detected');
  }

  // Trend factor
  if (temporalPatterns.trend === 'increasing') {
    riskScore += 15;
    factors.push('Upward trend in cases');
  }

  const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    contributing_factors: factors,
    recommendations: generateRiskRecommendations(riskLevel, factors)
  };
}

function generateRiskRecommendations(riskLevel: string, factors: string[]) {
  const recommendations: string[] = [];

  if (riskLevel === 'high') {
    recommendations.push('Implement immediate vector control measures');
    recommendations.push('Increase surveillance frequency to daily');
    recommendations.push('Consider public health advisories');
    recommendations.push('Deploy additional mosquito traps in cluster areas');
  } else if (riskLevel === 'medium') {
    recommendations.push('Enhance vector control in affected areas');
    recommendations.push('Increase surveillance to 3x per week');
    recommendations.push('Monitor for increasing trends');
  } else {
    recommendations.push('Maintain routine surveillance protocols');
    recommendations.push('Continue baseline monitoring');
  }

  return recommendations;
}

function generateAIRecommendations(metrics: any, clusters: any, temporalPatterns: any) {
  const recommendations: Array<{
    type: string;
    priority: string;
    action: string;
    details: string;
  }> = [];

  // Geographic recommendations
  if (clusters.cluster_count > 0) {
    recommendations.push({
      type: 'geographic',
      priority: 'high',
      action: 'Target vector control in cluster areas',
      details: `${clusters.cluster_count} geographic clusters detected requiring focused intervention`
    });
  }

  // Temporal recommendations
  if (temporalPatterns.anomalies && temporalPatterns.anomalies.length > 0) {
    recommendations.push({
      type: 'temporal',
      priority: 'medium',
      action: 'Investigate temporal anomalies',
      details: `${temporalPatterns.anomalies.length} temporal anomalies detected requiring investigation`
    });
  }

  // Positivity rate recommendations
  const positivityRate = metrics.positivityRate || 0;
  if (positivityRate > 15) {
    recommendations.push({
      type: 'surveillance',
      priority: 'critical',
      action: 'Implement enhanced surveillance',
      details: 'High positivity rate requires immediate response measures'
    });
  }

  return recommendations;
} 