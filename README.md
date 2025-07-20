# 🎨 Canva Font Editor - Color Palette Generator

A modern web application that generates beautiful color palettes from uploaded images using multiple algorithms.

## 🚀 Features

- **Image Upload**: Support for JPEG, PNG, and WebP formats
- **Multiple Algorithms**: Google Vision, ColorThief, and ColourLovers
- **Unique Colors**: Exactly 15 unique colors across 3 palettes
- **Session Management**: Automatic file cleanup on browser close
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Copy to Clipboard**: Easy hex code copying for design tools

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/kavi09/canva_font_editor191.git
cd canva_font_editor191

# Install dependencies
npm install

# Build and start the unified server
npm run dev
```

## 🌐 Usage

### **Unified Server Architecture**
The application uses a **single server** that serves both frontend and backend:

- **URL**: `http://localhost:3000`
- **Frontend**: React app served from `/`
- **Backend API**: Express routes served from `/api/*`
- **File Uploads**: Static files served from `/uploads/*`

### **Available Scripts**

```bash
# Development (build + start unified server)
npm run dev

# Start unified server only (requires build)
npm run server

# Build for production
npm run build

# Run tests
npm test
```

### **No Separate URLs Needed**
- ❌ **Old way**: Frontend on port 3000, Backend on port 5000
- ✅ **Current way**: Everything on port 3000 (unified)

## 📁 Project Structure

```
canva_font_editor191/
├── src/
│   ├── components/          # React components
│   ├── services/           # Palette generation algorithms
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static files
├── server.js              # Unified Express server
├── tests/                 # Comprehensive test suite
└── package.json           # Dependencies and scripts
```

## 🎯 Key Features

### **Image Validation**
- **Formats**: JPEG, PNG, WebP only
- **Size**: Maximum 10MB
- **Dimensions**: 100x100 to 4096x4096 pixels
- **Real-time validation** with user-friendly messages

### **Palette Generation**
- **3 Algorithms**: Google Vision, ColorThief, ColourLovers
- **15 Unique Colors**: Exactly 5 colors per palette
- **No Duplicates**: Smart color similarity detection
- **Fallback System**: Random colors if services fail

### **Session Management**
- **Automatic Cleanup**: Files deleted when browser closes
- **Time-based Cleanup**: Files older than 5 hours deleted
- **Session Isolation**: Each browser session has unique files
- **Memory Efficient**: No memory leaks

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test categories
node tests/run-all-tests.js
```

### **Test Coverage**
- ✅ Image validation (formats, sizes, dimensions)
- ✅ Palette generation (success, failure, fallback)
- ✅ Server API (upload, cleanup, endpoints)
- ✅ User experience (messages, accessibility)

## 🔧 Configuration

### **Environment Variables**
```bash
# Optional: Custom backend URL (defaults to localhost:3000)
REACT_APP_BACKEND_URL=http://localhost:3000
```

### **Server Configuration**
- **Port**: 3000 (unified frontend + backend)
- **File Upload**: 10MB limit
- **Cleanup**: 5-hour file retention
- **CORS**: Enabled for cross-origin requests

## 🚀 Deployment

### **Production Build**
```bash
# Build optimized production files
npm run build

# Start production server
npm run server
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "server"]
```

## 📊 Performance

### **File Upload**
- Small files (<1MB): <2 seconds
- Medium files (1-5MB): <5 seconds
- Large files (5-10MB): <10 seconds

### **Palette Generation**
- Single algorithm: <3 seconds
- All algorithms: <8 seconds
- Fallback generation: <2 seconds

## 🛡️ Security

- **File Validation**: Type, size, and dimension checks
- **Session Isolation**: Cross-session file protection
- **Path Traversal**: Prevention of directory traversal attacks
- **CORS**: Proper cross-origin request handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**🎨 Generate beautiful color palettes from your images!**
