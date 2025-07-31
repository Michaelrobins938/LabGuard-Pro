#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class LabGuardCLI {
  constructor() {
    this.agentsPath = path.join(__dirname, '..', 'agents');
    this.logsPath = path.join(__dirname, '..', 'logs');
  }

  // Parse command line arguments
  parseArgs() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (!command) {
      this.showHelp();
      process.exit(1);
    }

    if (command === 'check-calibration') {
      return this.parseCalibrationArgs(args.slice(1));
    } else if (command === '--help' || command === '-h') {
      this.showHelp();
      process.exit(0);
    } else {
      console.error(`❌ Unknown command: ${command}`);
      this.showHelp();
      process.exit(1);
    }
  }

  parseCalibrationArgs(args) {
    const params = {};
    
    for (let i = 0; i < args.length; i += 2) {
      const flag = args[i];
      const value = args[i + 1];
      
      if (!value) {
        console.error(`❌ Missing value for flag: ${flag}`);
        process.exit(1);
      }

      switch (flag) {
        case '--device':
          params.device = value;
          break;
        case '--last':
          params.last_calibrated = value;
          break;
        case '--tolerance':
          params.tolerance = parseInt(value, 10);
          break;
        default:
          console.error(`❌ Unknown flag: ${flag}`);
          process.exit(1);
      }
    }

    // Validate required parameters
    if (!params.device) {
      console.error('❌ Missing required parameter: --device');
      process.exit(1);
    }
    if (!params.last_calibrated) {
      console.error('❌ Missing required parameter: --last');
      process.exit(1);
    }
    if (!params.tolerance) {
      params.tolerance = 30; // Default tolerance
    }

    return params;
  }

  // Load and execute the YAML agent
  async executeAgent(agentName, inputs) {
    const agentPath = path.join(this.agentsPath, `${agentName}.yaml`);
    
    if (!fs.existsSync(agentPath)) {
      throw new Error(`Agent not found: ${agentPath}`);
    }

    const agentYaml = fs.readFileSync(agentPath, 'utf8');
    const agent = yaml.load(agentYaml);
    
    return this.executeAgentLogic(agent, inputs);
  }

  // Execute the agent logic
  executeAgentLogic(agent, inputs) {
    // Parse date
    const lastCalibrated = new Date(inputs.last_calibrated);
    if (isNaN(lastCalibrated.getTime())) {
      throw new Error(`Invalid date format: ${inputs.last_calibrated}`);
    }

    // Calculate days since calibration
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = Math.abs(today - lastCalibrated);
    const daysSinceCalibration = Math.ceil(diffTime / oneDay);

    // Evaluate status
    const tolerance = inputs.tolerance || 30;
    let status, recommendation;

    if (daysSinceCalibration > tolerance) {
      status = 'FAIL';
      recommendation = 'Recalibrate';
    } else {
      status = 'PASS';
      recommendation = 'Up to date';
    }

    // Format result
    const result = {
      device: inputs.device,
      status,
      days_overdue: daysSinceCalibration,
      recommendation,
      tolerance,
      timestamp: new Date().toISOString(),
      message: status === 'PASS' 
        ? `${inputs.device} was calibrated ${daysSinceCalibration} days ago. Within tolerance.`
        : `${inputs.device} was calibrated ${daysSinceCalibration} days ago. Tolerance is ${tolerance}. Recommend recalibration.`
    };

    return result;
  }

  // Display formatted output
  displayResult(result) {
    const icon = result.status === 'PASS' ? '✅' : '⚠️';
    const color = result.status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log(`${color}${icon} ${result.status}: ${result.message}${reset}`);
    
    // Additional details
    console.log(`\n📊 Details:`);
    console.log(`   Device: ${result.device}`);
    console.log(`   Days since calibration: ${result.days_overdue}`);
    console.log(`   Tolerance: ${result.tolerance} days`);
    console.log(`   Recommendation: ${result.recommendation}`);
    console.log(`   Timestamp: ${result.timestamp}`);
  }

  // Log results to file
  logResult(result) {
    const logFile = path.join(this.logsPath, 'audit-results.json');
    const logs = fs.existsSync(logFile) 
      ? JSON.parse(fs.readFileSync(logFile, 'utf8')) 
      : [];
    
    logs.push(result);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  }

  // Show help
  showHelp() {
    console.log(`
🧪 LabGuard-Pro CLI - Equipment Calibration Validation

Usage:
  labguard check-calibration [options]

Options:
  --device <name>        Equipment device name (required)
  --last <date>          Last calibration date in YYYY-MM-DD format (required)
  --tolerance <days>     Tolerance period in days (default: 30)

Examples:
  labguard check-calibration --device "Microscope" --last "2025-01-15" --tolerance 30
  labguard check-calibration --device "Incubator" --last "2025-01-01"

Output:
  ✅ PASS: Device was calibrated X days ago. Within tolerance.
  ⚠️ FAIL: Device was calibrated X days ago. Tolerance is Y. Recommend recalibration.

Results are logged to logs/audit-results.json
    `);
  }

  // Main execution
  async run() {
    try {
      const params = this.parseArgs();
      const result = await this.executeAgent('calibration-audit', params);
      
      this.displayResult(result);
      this.logResult(result);
      
      // Exit with appropriate code
      process.exit(result.status === 'PASS' ? 0 : 1);
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  const cli = new LabGuardCLI();
  cli.run();
}

module.exports = LabGuardCLI; 