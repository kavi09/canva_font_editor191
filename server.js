const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Changed back to 3000 for unified server

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from build directory if it exists, otherwise serve from public
const buildPath = path.join(__dirname, 'build');
const publicPath = path.join(__dirname, 'public');

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  console.log('✅ Serving from build directory');
} else {
  app.use(express.static(publicPath));
  console.log('⚠️ Build directory not found, serving from public directory');
}

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to clean up old files (older than 5 hours)
const cleanupOldFiles = () => {
  const fiveHoursAgo = Date.now() - (5 * 60 * 60 * 1000); // 5 hours in milliseconds
  
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return;
    }
    
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for ${file}:`, err);
          return;
        }
        
        // Check if file is older than 5 hours
        if (stats.mtime.getTime() < fiveHoursAgo) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting old file ${file}:`, err);
            } else {
              console.log(`🗑️ Cleaned up old file: ${file} (older than 5 hours)`);
            }
          });
        }
      });
    });
  });
};

// Run cleanup every hour
setInterval(cleanupOldFiles, 60 * 60 * 1000); // Every hour
// Also run cleanup on startup
cleanupOldFiles();

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
    
    console.log('Sending palettes response:', palettes.length, 'palettes');
    res.json({ palettes });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Cleanup session endpoint
app.post('/api/cleanup-session', (req, res) => {
  try {
    // Get session ID from multiple possible sources
    let sessionId = req.body.sessionId || req.headers['x-session-id'];
    
    // If no session ID in body, try to parse from FormData
    if (!sessionId && req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      // For sendBeacon requests, session ID might be in FormData
      console.log('📥 Received FormData cleanup request');
    }
    
    console.log(`Cleanup request received for session: ${sessionId}`);
    
    if (sessionId) {
      // Clean up files associated with this session
      fs.readdir(uploadsDir, (err, files) => {
        if (err) {
          console.error('Error reading uploads directory:', err);
          return res.json({ success: false, error: 'Cleanup failed' });
        }
        
        let deletedCount = 0;
        let totalFiles = files.length;
        
        console.log(`🔍 Checking ${totalFiles} files for session: ${sessionId}`);
        
        files.forEach(file => {
          // Check if filename contains the session ID
          if (file.includes(sessionId)) {
            const filePath = path.join(uploadsDir, file);
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file ${file}:`, err);
              } else {
                console.log(`🗑️ Cleaned up session file: ${file}`);
                deletedCount++;
              }
            });
          }
        });
        
        console.log(`Session cleanup completed. Deleted ${deletedCount} files out of ${totalFiles} total files.`);
        res.json({ success: true, message: `Cleanup completed. Deleted ${deletedCount} files.` });
      });
    } else {
      console.log('⚠️ No session ID provided for cleanup');
      res.json({ success: false, message: 'No session ID provided' });
    }
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ success: false, error: 'Cleanup failed' });
  }
});

// Manual cleanup endpoint for testing
app.post('/api/cleanup-all', (req, res) => {
  try {
    console.log('Manual cleanup request received');
    cleanupOldFiles();
    res.json({ success: true, message: 'Manual cleanup initiated' });
  } catch (error) {
    console.error('Manual cleanup error:', error);
    res.status(500).json({ success: false, error: 'Manual cleanup failed' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = fs.existsSync(buildPath) 
    ? path.join(buildPath, 'index.html')
    : path.join(publicPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'React app not built. Run "npm run build" first.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Unified server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🌐 Frontend & API: http://localhost:${PORT}`);
  console.log(`🔧 API Endpoints: http://localhost:${PORT}/api`);
  console.log(`🗑️ Auto-cleanup: Files older than 5 hours will be deleted automatically`);
}); 