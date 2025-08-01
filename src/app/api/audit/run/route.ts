import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AuditRequest {
  device: string;
  last_calibrated: string;
  tolerance: number;
}

interface AuditResult {
  device: string;
  status: 'PASS' | 'FAIL';
  days_overdue: number;
  recommendation: string;
  tolerance: number;
  timestamp: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AuditRequest = await request.json();

    // Validate input
    if (!body.device || !body.last_calibrated || !body.tolerance) {
      return NextResponse.json(
        { error: 'Missing required fields: device, last_calibrated, tolerance' },
        { status: 400 }
      );
    }

    // Validate date format
    const lastCalibrated = new Date(body.last_calibrated);
    if (isNaN(lastCalibrated.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate tolerance
    if (body.tolerance <= 0) {
      return NextResponse.json(
        { error: 'Tolerance must be a positive number' },
        { status: 400 }
      );
    }

    // Execute calibration audit logic
    const result = await executeCalibrationAudit(body);

    // Log the result
    await logAuditResult(result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function executeCalibrationAudit(input: AuditRequest): Promise<AuditResult> {
  // Calculate days since calibration
  const today = new Date();
  const lastCalibrated = new Date(input.last_calibrated);
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffTime = Math.abs(today.getTime() - lastCalibrated.getTime());
  const daysSinceCalibration = Math.ceil(diffTime / oneDay);

  // Evaluate status
  let status: 'PASS' | 'FAIL';
  let recommendation: string;

  if (daysSinceCalibration > input.tolerance) {
    status = 'FAIL';
    recommendation = 'Recalibrate';
  } else {
    status = 'PASS';
    recommendation = 'Up to date';
  }

  // Format result
  const result: AuditResult = {
    device: input.device,
    status,
    days_overdue: daysSinceCalibration,
    recommendation,
    tolerance: input.tolerance,
    timestamp: new Date().toISOString(),
    message: status === 'PASS' 
      ? `${input.device} was calibrated ${daysSinceCalibration} days ago. Within tolerance.`
      : `${input.device} was calibrated ${daysSinceCalibration} days ago. Tolerance is ${input.tolerance}. Recommend recalibration.`
  };

  return result;
}

async function logAuditResult(result: AuditResult): Promise<void> {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logsDir, 'audit-results.json');

    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Read existing logs or create new array
    let logs: AuditResult[] = [];
    if (fs.existsSync(logFile)) {
      try {
        const fileContent = fs.readFileSync(logFile, 'utf8');
        logs = JSON.parse(fileContent);
      } catch (parseError) {
        console.warn('Failed to parse existing log file, starting fresh');
        logs = [];
      }
    }

    // Add new result
    logs.push(result);

    // Write back to file
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Failed to log audit result:', error);
    // Don't throw - logging failure shouldn't break the API
  }
} 