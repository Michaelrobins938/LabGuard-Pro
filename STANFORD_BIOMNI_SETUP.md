
# 🧬 Stanford Biomni Integration Setup Guide

## Overview

This guide will help you integrate your LabGuard Pro platform with the **real Stanford Biomni AI system** from [https://github.com/snap-stanford/Biomni](https://github.com/snap-stanford/Biomni).

## What is Stanford Biomni?

Stanford Biomni is a general-purpose biomedical AI agent that can:
- **Complete bioinformatics analysis in 35 minutes** vs 3 weeks for human experts (800x faster)
- **Design cloning experiments** validated as equivalent to 5+ year expert work
- **Access 150+ tools, 59 databases, and 106 software packages**
- **Process 200,000 token context windows** for comprehensive analysis
- **Generate novel hypotheses** from complex biomedical data

## Prerequisites

1. **Stanford Biomni API Access**
   - Visit [biomni.stanford.edu](https://biomni.stanford.edu)
   - Register for API access
   - Obtain your API key

2. **Environment Setup**
   - Node.js 18+ and npm/yarn
   - PostgreSQL database
   - Redis (optional, for caching)

## Step 1: Environment Configuration

Create or update your `.env.local` file:

```bash
# Stanford Biomni AI Integration
NEXT_PUBLIC_BIOMNI_API_URL="https://biomni.stanford.edu/api"
BIOMNI_API_KEY="your-stanford-biomni-api-key"

# Optional: Demo Mode (when API key not available)
NEXT_PUBLIC_BIOMNI_DEMO_MODE="false"
NEXT_PUBLIC_BIOMNI_VERSION="1.0"

# Other required environment variables...
DATABASE_URL="postgresql://username:password@localhost:5432/labguard_pro"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 2: Install Dependencies

```bash
# Install project dependencies
npm install

# Or if using yarn
yarn install
```

## Step 3: Database Setup

```bash
# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

## Step 4: Start Development Server

```bash
# Start the development server
npm run dev

# Or if using yarn
yarn dev
```

## Step 5: Test the Integration

1. **Visit the Demo Page**
   ```
   http://localhost:3000/stanford-biomni-demo
   ```

2. **Check API Status**
   - Click "Check Status" to verify Stanford Biomni connectivity
   - Click "View Tools" to see available capabilities

3. **Test Task Execution**
   - Try the example tasks:
     - CRISPR screen planning
     - scRNA-seq analysis
     - ADMET prediction

## API Endpoints

### Frontend API Routes

- `POST /api/stanford-biomni` - Execute Stanford Biomni tasks
- `GET /api/stanford-biomni?action=status` - Check API status
- `GET /api/stanford-biomni?action=tools` - Get available tools

### Request Examples

#### Execute a Task
```bash
curl -X POST http://localhost:3000/api/stanford-biomni \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute",
    "task": "Plan a CRISPR screen to identify genes that regulate T cell exhaustion"
  }'
```

#### Check Status
```bash
curl "http://localhost:3000/api/stanford-biomni?action=status"
```

#### Get Available Tools
```bash
curl "http://localhost:3000/api/stanford-biomni?action=tools"
```

## Available Actions

### 1. Initialize Agent
```json
{
  "action": "initialize",
  "dataPath": "./data",
  "llm": "claude-sonnet-4-20250514"
}
```

### 2. Execute Task
```json
{
  "action": "execute",
  "task": "Your biomedical research task description"
}
```

### 3. Genomic Analysis
```json
{
  "action": "analyze_genomic",
  "dataPath": "/path/to/data",
  "analysisType": "scRNA-seq annotation"
}
```

### 4. Protocol Design
```json
{
  "action": "design_protocol",
  "protocolType": "CRISPR gene editing",
  "parameters": {
    "organism": "E. coli",
    "target": "specific gene"
  }
}
```

### 5. Literature Review
```json
{
  "action": "literature_review",
  "topic": "COVID-19 vaccine development",
  "scope": "comprehensive"
}
```

### 6. Hypothesis Generation
```json
{
  "action": "generate_hypothesis",
  "dataPath": "/path/to/data",
  "researchArea": "cancer immunotherapy"
}
```

## Example Tasks

### Bioinformatics Analysis
```
"Plan a CRISPR screen to identify genes that regulate T cell exhaustion, generate 32 genes that maximize the perturbation effect."
```

### Single-Cell Analysis
```
"Perform scRNA-seq annotation at [PATH] and generate meaningful hypothesis"
```

### Drug Discovery
```
"Predict ADMET properties for this compound: CC(C)CC1=CC=C(C=C1)C(C)C(=O)O"
```

### Protocol Design
```
"Design a detailed protocol for CRISPR gene editing in E. coli with safety validation"
```

## Error Handling

The integration includes comprehensive error handling:

- **API Key Validation**: Checks for valid Stanford Biomni API key
- **Network Errors**: Handles connection issues gracefully
- **Timeout Handling**: 10-minute timeout for long-running tasks
- **Rate Limiting**: Respects Stanford Biomni API rate limits

## Monitoring and Logging

- All API calls are logged with timestamps
- Execution times are tracked
- Error messages are detailed and actionable
- Status monitoring is available

## Security Considerations

1. **API Key Security**
   - Store API keys in environment variables only
   - Never commit API keys to version control
   - Use different keys for development and production

2. **Data Privacy**
   - Stanford Biomni processes data according to their privacy policy
   - Sensitive data should be reviewed before submission

3. **Rate Limiting**
   - Respect Stanford Biomni API rate limits
   - Implement appropriate backoff strategies

## Troubleshooting

### Common Issues

1. **API Key Not Configured**
   ```
   Error: Stanford Biomni API key not configured
   Solution: Add BIOMNI_API_KEY to your .env.local file
   ```

2. **Connection Failed**
   ```
   Error: Failed to connect to Stanford Biomni API
   Solution: Check your internet connection and API endpoint
   ```

3. **Task Execution Failed**
   ```
   Error: Task execution failed
   Solution: Verify task format and check Stanford Biomni documentation
   ```

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG="app:*"
```

## Production Deployment

1. **Environment Variables**
   - Set production API keys
   - Configure proper database URLs
   - Set up monitoring and logging

2. **Security**
   - Use HTTPS in production
   - Implement proper authentication
   - Set up rate limiting

3. **Monitoring**
   - Monitor API response times
   - Track error rates
   - Set up alerts for failures

## Support

- **Stanford Biomni Documentation**: [https://github.com/snap-stanford/Biomni](https://github.com/snap-stanford/Biomni)
- **Web Interface**: [biomni.stanford.edu](https://biomni.stanford.edu)
- **API Status**: Check `/api/stanford-biomni?action=status`

## License

This integration is based on Stanford Biomni, which is Apache 2.0 licensed. However, certain integrated tools, databases, or software may carry more restrictive commercial licenses. Review each component carefully before any commercial use.

---

**Note**: This integration provides real access to Stanford's Biomni AI system. Make sure you have proper API access and understand the terms of service before using in production. 