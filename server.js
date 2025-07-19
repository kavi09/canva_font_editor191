const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000000);
    const ext = path.extname(file.originalname);
    cb(null, `image-${timestamp}-${random}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

console.log(`Server running on port ${PORT}`);
console.log(`Uploads directory: ${uploadsDir}`);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const sessionId = req.headers['x-session-id'];
    console.log(`File uploaded: ${req.file.filename}`);

    // Return the file path for the frontend to use
    res.json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// Analyze image endpoint (Google Vision simulation)
app.post('/api/analyze-image', async (req, res) => {
  try {
    console.log('Received analyze-image request');
    
    // Get image data from request body
    const imageData = req.body.image || req.body.imageData;
    console.log(`Image data received, length: ${imageData ? imageData.length : 0}`);
    
    if (!imageData) {
      console.error('No image data provided');
      return res.status(400).json({ error: 'No image data provided' });
    }
    
    // Generate a hash for the image to simulate analysis
    const imageHash = Math.floor(Math.random() * 2000000000);
    console.log(`Generated image hash: ${imageHash}`);
    
    // Simulate color analysis with realistic values
    const dominantColors = [
      { red: 220, green: 20, blue: 20, score: 0.9 },
      { red: 20, green: 20, blue: 20, score: 0.8 },
      { red: 255, green: 255, blue: 255, score: 0.7 },
      { red: 180, green: 30, blue: 30, score: 0.6 },
      { red: 40, green: 40, blue: 40, score: 0.5 }
    ];
    
    console.log('Generated colors:', dominantColors);
    
    // Generate three different palettes based on the dominant colors
    const palettes = [
      {
        id: 'dominant',
        name: 'Dominant Colors',
        colors: dominantColors.map(color => ({
          hex: `#${color.red.toString(16).padStart(2, '0')}${color.green.toString(16).padStart(2, '0')}${color.blue.toString(16).padStart(2, '0')}`,
          rgb: [color.red, color.green, color.blue],
          selected: false
        }))
      },
      {
        id: 'complementary',
        name: 'Complementary Palette',
        colors: dominantColors.map(color => {
          const complementary = {
            red: 255 - color.red,
            green: 255 - color.green,
            blue: 255 - color.blue
          };
          return {
            hex: `#${complementary.red.toString(16).padStart(2, '0')}${complementary.green.toString(16).padStart(2, '0')}${complementary.blue.toString(16).padStart(2, '0')}`,
            rgb: [complementary.red, complementary.green, complementary.blue],
            selected: false
          };
        })
      },
      {
        id: 'analogous',
        name: 'Analogous Palette',
        colors: dominantColors.map((color, index) => {
          const analogous = {
            red: Math.min(255, Math.max(0, color.red + (index * 30))),
            green: Math.min(255, Math.max(0, color.green + (index * 20))),
            blue: Math.min(255, Math.max(0, color.blue + (index * 25)))
          };
          return {
            hex: `#${analogous.red.toString(16).padStart(2, '0')}${analogous.green.toString(16).padStart(2, '0')}${analogous.blue.toString(16).padStart(2, '0')}`,
            rgb: [analogous.red, analogous.green, analogous.blue],
            selected: false
          };
        })
      }
    ];
    
    res.json({ palettes });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Cleanup session endpoint
app.post('/api/cleanup-session', (req, res) => {
  try {
    const sessionId = req.body.sessionId || req.headers['x-session-id'];
    
    if (sessionId) {
      // Clean up files associated with this session
      fs.readdir(uploadsDir, (err, files) => {
        if (err) {
          console.error('Error reading uploads directory:', err);
          return res.json({ success: false, error: 'Cleanup failed' });
        }
        
        files.forEach(file => {
          if (file.includes(sessionId)) {
            const filePath = path.join(uploadsDir, file);
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file ${file}:`, err);
              } else {
                console.log(`Cleaned up session file: ${file}`);
              }
            });
          }
        });
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ success: false, error: 'Cleanup failed' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Unified server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
}); 