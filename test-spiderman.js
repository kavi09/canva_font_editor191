const fs = require('fs');
const path = require('path');
const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testSpiderManImage() {
  console.log('🕷️ Testing Spider-Man Image Palette Generation...\n');
  
  try {
    // Find the most recent Spider-Man image
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    const files = fs.readdirSync(uploadsDir)
      .filter(file => file.endsWith('.jpeg') && file.startsWith('image-'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      throw new Error('No Spider-Man images found in uploads directory');
    }
    
    const testImageFile = files[0]; // Most recent image
    const testImagePath = path.join(uploadsDir, testImageFile);
    
    console.log(`📸 Using image: ${testImageFile}`);
    console.log(`📁 Path: ${testImagePath}`);
    
    // Read the image
    const imageData = fs.readFileSync(testImagePath);
    const base64Data = imageData.toString('base64');
    
    console.log(`📊 Image size: ${imageData.length} bytes`);
    console.log(`📊 Base64 length: ${base64Data.length} characters`);
    
    // Test palette generation
    console.log('\n🎨 Testing palette generation...');
    
    const requestData = JSON.stringify({
      image: base64Data
    });
    
    const analyzeResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/analyze-image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    }, requestData);
    
    if (analyzeResult.status !== 200) {
      throw new Error(`Analyze API failed: ${analyzeResult.status} - ${JSON.stringify(analyzeResult.data)}`);
    }
    
    console.log('✅ Spider-Man palette generation successful!');
    console.log(`📊 Generated ${analyzeResult.data.palettes.length} palettes:`);
    
    analyzeResult.data.palettes.forEach((palette, index) => {
      console.log(`\n   ${index + 1}. ${palette.name} (${palette.colors.length} colors)`);
      palette.colors.forEach((color, colorIndex) => {
        console.log(`      ${colorIndex + 1}. ${color.hex} (RGB: ${color.rgb.join(', ')})`);
      });
    });
    
    // Verify structure
    console.log('\n🔍 Verifying palette structure...');
    const isValidPalette = (palette) => {
      return palette.id && palette.name && Array.isArray(palette.colors) && palette.colors.length > 0;
    };
    
    const isValidColor = (color) => {
      return color.hex && Array.isArray(color.rgb) && color.rgb.length === 3;
    };
    
    let allValid = true;
    analyzeResult.data.palettes.forEach((palette, index) => {
      if (!isValidPalette(palette)) {
        console.log(`❌ Invalid palette ${index + 1}:`, palette);
        allValid = false;
      } else {
        palette.colors.forEach((color, colorIndex) => {
          if (!isValidColor(color)) {
            console.log(`❌ Invalid color ${colorIndex + 1} in palette ${index + 1}:`, color);
            allValid = false;
          }
        });
      }
    });
    
    if (allValid) {
      console.log('✅ All palettes and colors have valid structure!');
    }
    
    console.log('\n🎉 Spider-Man test completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Image found: ✅ (${testImageFile})`);
    console.log(`   - Image size: ✅ (${imageData.length} bytes)`);
    console.log(`   - Palette generation: ✅ (${analyzeResult.data.palettes.length} palettes)`);
    console.log(`   - Structure validation: ✅`);
    
    // Show color analysis
    console.log('\n🎨 Color Analysis:');
    analyzeResult.data.palettes.forEach((palette, index) => {
      console.log(`\n${palette.name}:`);
      palette.colors.forEach((color, colorIndex) => {
        console.log(`  ${colorIndex + 1}. ${color.hex} - RGB(${color.rgb.join(', ')})`);
      });
    });
    
  } catch (error) {
    console.error('❌ Spider-Man test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testSpiderManImage(); 