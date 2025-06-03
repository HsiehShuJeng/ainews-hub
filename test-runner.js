#!/usr/bin/env node

// Simple test runner for frontend data validation
const fs = require('fs');
const path = require('path');

// Read and evaluate the data.js file
const dataPath = path.join(__dirname, 'spa', 'js', 'data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Create a mock module object
const mockModule = { exports: {} };

// Evaluate the data file in a safe context
const vm = require('vm');
const context = { module: mockModule, exports: mockModule.exports };
vm.createContext(context);

// Execute the modified data content
const modifiedContent = dataContent.replace('export const', 'module.exports =');
vm.runInContext(modifiedContent, context);

const llmData = mockModule.exports;

console.log('🧪 Running Frontend Data Tests...\n');

// Test 1: Veo3 model exists
function testVeo3Exists() {
  const veo3Model = llmData.models.find(model => model.id === 'google_veo_3');
  if (!veo3Model) {
    throw new Error('Veo3 model not found');
  }
  if (veo3Model.name !== 'Google Veo 3') {
    throw new Error(`Expected name 'Google Veo 3', got '${veo3Model.name}'`);
  }
  console.log('✅ Veo3 model exists and has correct name');
  return veo3Model;
}

// Test 2: Demo videos configuration
function testDemoVideos(veo3Model) {
  const demoVideos = veo3Model.details.demoVideos;
  if (!demoVideos || demoVideos.length !== 5) {
    throw new Error(`Expected 5 demo videos, got ${demoVideos?.length || 0}`);
  }
  console.log('✅ Veo3 has 5 demo videos configured');
  return demoVideos;
}

// Test 3: CloudFront URLs
function testCloudFrontUrls(demoVideos) {
  const cloudFrontPattern = /^https:\/\/d398xk2htm3kbk\.cloudfront\.net\//;
  
  demoVideos.forEach((video, index) => {
    if (!cloudFrontPattern.test(video.videoUrl)) {
      throw new Error(`Video ${index + 1} does not use CloudFront URL: ${video.videoUrl}`);
    }
    if (video.name !== `Veo 3 Demo ${index + 1}`) {
      throw new Error(`Video ${index + 1} has incorrect name: ${video.name}`);
    }
  });
  console.log('✅ All demo videos use CloudFront URLs');
}

// Test 4: URL encoding
function testUrlEncoding(demoVideos) {
  demoVideos.forEach((video, index) => {
    if (!video.videoUrl.includes('%5B') || !video.videoUrl.includes('%5D')) {
      throw new Error(`Video ${index + 1} missing URL encoding: ${video.videoUrl}`);
    }
    if (video.videoUrl.includes('[') || video.videoUrl.includes(']')) {
      throw new Error(`Video ${index + 1} has unencoded brackets: ${video.videoUrl}`);
    }
  });
  console.log('✅ All video URLs use proper URL encoding');
}

// Test 5: No S3 URLs
function testNoS3Urls(demoVideos) {
  demoVideos.forEach((video, index) => {
    if (video.videoUrl.includes('s3.amazonaws.com')) {
      throw new Error(`Video ${index + 1} uses direct S3 URL: ${video.videoUrl}`);
    }
  });
  console.log('✅ No direct S3 URLs found');
}

// Test 6: HTTPS protocol
function testHttps(demoVideos) {
  demoVideos.forEach((video, index) => {
    if (!video.videoUrl.startsWith('https://')) {
      throw new Error(`Video ${index + 1} does not use HTTPS: ${video.videoUrl}`);
    }
  });
  console.log('✅ All videos use HTTPS protocol');
}

// Test 7: Path structure
function testPathStructure(demoVideos) {
  demoVideos.forEach((video, index) => {
    if (!video.videoUrl.includes('/videos/')) {
      throw new Error(`Video ${index + 1} missing /videos/ path: ${video.videoUrl}`);
    }
    if (!video.videoUrl.endsWith('.mp4')) {
      throw new Error(`Video ${index + 1} not an MP4 file: ${video.videoUrl}`);
    }
  });
  console.log('✅ All videos use correct path structure');
}

// Run all tests
try {
  const veo3Model = testVeo3Exists();
  const demoVideos = testDemoVideos(veo3Model);
  testCloudFrontUrls(demoVideos);
  testUrlEncoding(demoVideos);
  testNoS3Urls(demoVideos);
  testHttps(demoVideos);
  testPathStructure(demoVideos);
  
  console.log('\n🎉 All tests passed! Video configuration is correct.');
  console.log('\n📋 Summary:');
  console.log(`   • ${demoVideos.length} Veo3 demo videos configured`);
  console.log(`   • CloudFront domain: d398xk2htm3kbk.cloudfront.net`);
  console.log(`   • URL encoding: Properly encoded brackets`);
  console.log(`   • Security: HTTPS enforced, no direct S3 access`);
  
} catch (error) {
  console.error(`❌ Test failed: ${error.message}`);
  process.exit(1);
} 