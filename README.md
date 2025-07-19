# 🎨 Canvas Font Editor - Color Palette Generator

A React + TypeScript application that generates beautiful color palettes from uploaded images using multiple algorithms.

## ✨ Features

- **Image Upload & Validation**: Drag & drop image upload with size, format, and dimension validation
- **Server-Side Storage**: Images stored locally with automatic cleanup when browser session ends
- **Multiple Palette Algorithms**: 
  - **ColorThief**: Extracts dominant colors from uploaded images
  - **ColourLovers API**: Fetches beautiful curated palettes
- **Color Selection**: Click to select/deselect colors from any palette
- **Hex Code Display**: Shows hex codes for all colors with copy functionality
- **Bulk Copy**: Copy all selected hex codes at once (comma or newline separated)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd canvafonteditor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both:
- **React App**: http://localhost:3000
- **Backend Server**: http://localhost:3001

## 📁 Project Structure

```
canvafonteditor/
├── public/
│   └── uploads/          # Image storage folder
├── src/
│   ├── components/       # React components
│   │   ├── ImageUpload.tsx
│   │   ├── ColorSwatch.tsx
│   │   ├── Palette.tsx
│   │   └── SelectedColors.tsx
│   ├── services/         # API services
│   │   ├── colorThiefService.ts
│   │   ├── colourLoversService.ts
│   │   └── paletteService.ts
│   ├── utils/           # Utility functions
│   │   ├── imageValidation.ts
│   │   └── colorUtils.ts
│   ├── types/           # TypeScript interfaces
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── server.js            # Express backend server
└── package.json
```

## 🔧 How It Works

### Image Upload Process
1. User drags & drops or selects an image
2. Frontend validates file size, format, and dimensions
3. Valid image is uploaded to backend server
4. Image is stored in `public/uploads/` folder
5. Server returns image URL for display

### Palette Generation
1. **ColorThief**: Analyzes uploaded image to extract dominant colors
2. **ColourLovers**: Fetches a random beautiful palette from external API
3. Both palettes are displayed with 5 colors each

### Session Management
- Each browser session gets a unique session ID
- Images are tracked per session
- When user closes browser/tab, cleanup request is sent
- Files are automatically deleted from server
- Fallback cleanup runs every 30 minutes for orphaned files

## 🎯 Usage

1. **Upload Image**: Drag & drop or click to select an image
2. **View Palettes**: Two palettes will be generated automatically
3. **Select Colors**: Click on any color swatch to select it
4. **Copy Hex Codes**: 
   - Click individual hex codes to copy
   - Use "Copy All" buttons to copy all selected colors
5. **Reset**: Click "Upload New Image" to start over

## 📋 Image Requirements

- **File Size**: Maximum 10MB
- **Dimensions**: 100x100 to 4096x4096 pixels
- **Formats**: JPEG, PNG, WebP

## 🛠️ Development

### Available Scripts

- `npm start` - Start React development server only
- `npm run server` - Start backend server only
- `npm run dev` - Start both servers (recommended)
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend API Endpoints

- `POST /api/upload` - Upload image file
- `POST /api/cleanup-session` - Clean up session files
- `DELETE /api/cleanup` - Manual cleanup of old files
- `GET /api/health` - Health check

## 🔒 Security & Performance

- **File Validation**: Server-side and client-side validation
- **Automatic Cleanup**: Prevents disk space issues
- **CORS Enabled**: Secure cross-origin requests
- **Error Handling**: Graceful error messages for users
- **Fallback Mechanisms**: API failures don't break the app

## 🎨 Technologies Used

- **Frontend**: React 19, TypeScript, CSS3
- **Backend**: Node.js, Express, Multer
- **APIs**: ColourLovers API, ColorThief library
- **File Handling**: React Dropzone, FormData
- **Styling**: Modern CSS with gradients and animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Color Palette Generating! 🎨✨**
