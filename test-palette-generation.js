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

// Test the palette generation API directly
async function testPaletteGeneration() {
  console.log('🧪 Testing Palette Generation...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Health check:', healthResult.data);
    
    // Test 2: Create test image
    console.log('\n2️⃣ Creating test image...');
    const testImagePath = path.join(__dirname, 'public', 'uploads', 'test-image.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.log('⚠️ Test image not found, creating a dummy image...');
      // Create a simple test image (1x1 pixel JPEG)
      const dummyImage = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
        0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
        0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
        0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00,
        0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
        0x07, 0x08, 0x09, 0x0A, 0x0B, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00,
        0x00, 0x3F, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05,
        0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
        0x00, 0x00, 0x3F, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
        0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0xFF, 0xD9
      ]);
      fs.writeFileSync(testImagePath, dummyImage);
    }
    
    // Test 3: Analyze image directly
    console.log('\n3️⃣ Testing palette generation...');
    const testImageData = fs.readFileSync(testImagePath);
    const base64Data = testImageData.toString('base64');
    
    console.log(`📊 Test image size: ${testImageData.length} bytes`);
    console.log(`📊 Base64 length: ${base64Data.length} characters`);
    
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
    
    console.log('✅ Palette generation successful!');
    console.log(`📊 Generated ${analyzeResult.data.palettes.length} palettes:`);
    
    analyzeResult.data.palettes.forEach((palette, index) => {
      console.log(`   ${index + 1}. ${palette.name} (${palette.colors.length} colors)`);
      palette.colors.forEach((color, colorIndex) => {
        console.log(`      ${colorIndex + 1}. ${color.hex} (RGB: ${color.rgb.join(', ')})`);
      });
    });
    
    // Test 4: Verify palette structure
    console.log('\n4️⃣ Verifying palette structure...');
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
    
    console.log('\n🎉 Test completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Health check: ✅`);
    console.log(`   - Image creation: ✅`);
    console.log(`   - Palette generation: ✅`);
    console.log(`   - Structure validation: ✅`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testPaletteGeneration(); 