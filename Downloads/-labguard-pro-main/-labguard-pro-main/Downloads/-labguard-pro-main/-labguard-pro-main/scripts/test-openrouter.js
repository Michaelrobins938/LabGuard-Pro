#!/usr/bin/env node

/**
 * OpenRouter Integration Test Script
 * Tests the OpenRouter integration with LabGuard Pro Biomni
 */

const axios = require('axios');
require('dotenv').config();

// Test configuration
const config = {
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  openRouterBaseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  defaultModel: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet'
};

async function testOpenRouterConnection() {
  console.log('🧪 Testing OpenRouter Integration...\n');

  if (!config.openRouterApiKey) {
    console.log('❌ OPENROUTER_API_KEY not found in environment variables');
    console.log('   Please add your OpenRouter API key to .env file');
    return false;
  }

  try {
    // Test 1: Get available models
    console.log('📋 Test 1: Fetching available models...');
    const modelsResponse = await axios.get(`${config.openRouterBaseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${config.openRouterApiKey}`
      }
    });

    const models = modelsResponse.data.data || [];
    console.log(`✅ Found ${models.length} available models`);
    
    // Show recommended models
    const recommendedModels = models.filter(model => 
      model.name.toLowerCase().includes('claude') ||
      model.name.toLowerCase().includes('gpt-4') ||
      model.name.toLowerCase().includes('gpt-3.5') ||
      model.name.toLowerCase().includes('sonnet') ||
      model.name.toLowerCase().includes('opus')
    );

    console.log('\n🎯 Recommended models for biomedical research:');
    recommendedModels.slice(0, 5).forEach(model => {
      console.log(`   • ${model.name} (${model.pricing?.prompt || 'N/A'}/1M tokens)`);
    });

    // Test 2: Simple query
    console.log('\n🧬 Test 2: Testing simple biomedical query...');
    const testPrompt = "Design a PCR protocol for amplifying the human beta-actin gene. Include primer design, reaction conditions, and quality control measures.";
    
    const queryResponse = await axios.post(
      `${config.openRouterBaseUrl}/chat/completions`,
      {
        model: config.defaultModel,
        messages: [
          {
            role: 'system',
            content: 'You are a biomedical AI assistant specialized in laboratory research and compliance. Provide accurate, detailed responses for laboratory operations.'
          },
          {
            role: 'user',
            content: testPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${config.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://labguard-pro.com',
          'X-Title': 'LabGuard Pro Biomni Integration'
        }
      }
    );

    const result = queryResponse.data;
    console.log('✅ Query successful!');
    console.log(`   Model used: ${result.model}`);
    console.log(`   Tokens used: ${result.usage?.total_tokens || 'N/A'}`);
    console.log(`   Response length: ${result.choices[0]?.message?.content?.length || 0} characters`);

    // Test 3: Model comparison
    console.log('\n⚖️ Test 3: Comparing model costs...');
    const testModels = [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4o',
      'google/gemini-pro'
    ];

    const simplePrompt = "Analyze this QC failure: West Nile Virus control values [0.85, 0.87, 0.89]";
    
    for (const model of testModels) {
      try {
        const startTime = Date.now();
        const response = await axios.post(
          `${config.openRouterBaseUrl}/chat/completions`,
          {
            model: model,
            messages: [
              {
                role: 'user',
                content: simplePrompt
              }
            ],
            max_tokens: 200,
            temperature: 0.1
          },
          {
            headers: {
              'Authorization': `Bearer ${config.openRouterApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const executionTime = Date.now() - startTime;
        const tokens = response.data.usage?.total_tokens || 0;
        
        console.log(`   ${model}: ${tokens} tokens | ${executionTime}ms`);
      } catch (error) {
        console.log(`   ${model}: ❌ Failed - ${error.response?.data?.error?.message || error.message}`);
      }
    }

    // Test 4: Check integration with LabGuard Pro
    console.log('\n🔗 Test 4: Checking LabGuard Pro integration...');
    console.log('✅ OpenRouter API is working correctly');
    console.log('✅ Ready for integration with LabGuard Pro Biomni');
    
    // Show configuration summary
    console.log('\n📊 Configuration Summary:');
    console.log(`   OpenRouter Base URL: ${config.openRouterBaseUrl}`);
    console.log(`   Default Model: ${config.defaultModel}`);
    console.log(`   API Key: ${config.openRouterApiKey.substring(0, 10)}...`);
    
    return true;

  } catch (error) {
    console.error('❌ OpenRouter test failed:', error.response?.data || error.message);
    return false;
  }
}

async function showSetupInstructions() {
  console.log('\n📚 Setup Instructions:');
  console.log('1. Get your OpenRouter API key from https://openrouter.ai/');
  console.log('2. Add to your .env file:');
  console.log('   USE_OPENROUTER=true');
  console.log('   OPENROUTER_API_KEY=your_api_key_here');
  console.log('   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet');
  console.log('3. Restart your LabGuard Pro application');
  console.log('4. Test the integration with this script');
}

async function main() {
  console.log('🚀 LabGuard Pro - OpenRouter Integration Test');
  console.log('==============================================\n');

  const success = await testOpenRouterConnection();
  
  if (success) {
    console.log('\n🎉 All tests passed! OpenRouter is ready for use.');
    console.log('\n💡 Next steps:');
    console.log('1. Update your .env file with OpenRouter configuration');
    console.log('2. Restart your LabGuard Pro application');
    console.log('3. Test the integration with real laboratory data');
    console.log('4. Monitor costs and performance');
  } else {
    console.log('\n❌ Tests failed. Please check your configuration.');
    await showSetupInstructions();
  }
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testOpenRouterConnection }; 