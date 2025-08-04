import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportDate } = body;

    // Calculate report period (previous week)
    const reportEndDate = reportDate ? new Date(reportDate) : new Date();
    const reportStartDate = new Date(reportEndDate);
    reportStartDate.setDate(reportEndDate.getDate() - 7);

    // Mock county configurations
    const countyConfigurations = [
      { countyName: 'Tarrant', countyCode: 'TARRANT' },
      { countyName: 'Dallas', countyCode: 'DALLAS' },
      { countyName: 'Denton', countyCode: 'DENTON' },
      { countyName: 'Collin', countyCode: 'COLLIN' },
      { countyName: 'Parker', countyCode: 'PARKER' },
      { countyName: 'Johnson', countyCode: 'JOHNSON' }
    ];

    // Generate mock reports for each county
    const reports: any[] = [];
    const distributionResults: any[] = [];

    for (const countyConfig of countyConfigurations) {
      try {
        // Mock metrics for each county
        const totalPools = Math.floor(Math.random() * 20) + 5;
        const positivePools = Math.floor(Math.random() * 3);
        const positivityRate = totalPools > 0 ? (positivePools / totalPools) * 100 : 0;

        // Simulate report generation
        const reportContent = {
          countyName: countyConfig.countyName,
          reportPeriod: {
            start: reportStartDate.toISOString(),
            end: reportEndDate.toISOString()
          },
          metrics: {
            totalPools,
            positivePools,
            positivityRate: parseFloat(positivityRate.toFixed(1)),
            speciesBreakdown: { 'Culex quinquefasciatus': totalPools * 0.7, 'Aedes aegypti': totalPools * 0.3 },
            geographicDistribution: {
              totalLocations: totalPools,
              positiveLocations: positivePools,
              coordinates: []
            }
          },
          narrative: `During the reporting period, ${totalPools} mosquito pools were tested for West Nile Virus. Of these, ${positivePools} pools tested positive, resulting in a positivity rate of ${positivityRate.toFixed(1)}%.`,
          recommendations: positivityRate > 15 ? 
            ['Implement enhanced vector control measures', 'Increase surveillance frequency'] :
            ['Continue routine surveillance', 'Maintain baseline monitoring']
        };

        // Simulate email distribution
        const distributionResult = await simulateEmailDistribution(
          countyConfig.countyName,
          [`${countyConfig.countyCode.toLowerCase()}@example.com`],
          reportContent
        );

        distributionResults.push({
          county: countyConfig.countyName,
          emailsSent: 1,
          status: distributionResult.success ? 'sent' : 'failed',
          error: distributionResult.error
        });

        reports.push({
          county: countyConfig.countyName,
          reportId: `report_${Date.now()}_${countyConfig.countyCode}`,
          metrics: reportContent.metrics
        });

      } catch (error) {
        console.error(`Error generating report for ${countyConfig.countyName}:`, error);
        distributionResults.push({
          county: countyConfig.countyName,
          emailsSent: 0,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        reportsGenerated: reports.length,
        distributionResults,
        reportPeriod: {
          start: reportStartDate.toISOString(),
          end: reportEndDate.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error generating weekly reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function simulateEmailDistribution(countyName: string, emails: string[], reportContent: any) {
  // Simulate email sending with random success/failure
  const success = Math.random() > 0.1; // 90% success rate

  if (success) {
    console.log(`Email sent to ${emails.join(', ')} for ${countyName} County`);
    return { success: true };
  } else {
    console.log(`Failed to send email for ${countyName} County`);
    return { success: false, error: 'Email service temporarily unavailable' };
  }
} 