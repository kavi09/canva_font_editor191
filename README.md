# Color Palette Generator

A React-based web application that generates color palettes from uploaded images using AI-powered color analysis.

## Features

- **Image Upload**: Drag and drop or click to upload images (JPEG, PNG, WebP)
- **AI Color Analysis**: Uses simulated Google Vision AI to extract dominant colors
- **Multiple Palettes**: Generates three different palette types:
  - Dominant Colors
  - Complementary Palette
  - Analogous Palette
- **Color Selection**: Click colors to select/deselect them
- **Copy Hex Codes**: Click on color hex codes to copy to clipboard
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, TypeScript, CSS3
- **Backend**: Node.js, Express.js
- **File Upload**: Multer
- **Image Processing**: Canvas API for base64 conversion

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kavi09/canva_font_editor191.git
cd canva_font_editor191
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start:
- Backend server on port 3001
- React development server on port 3000

## Development

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

## Available Scripts

- `npm start` - Start React development server
- `npm run server` - Start backend server only
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build for production
- `npm test` - Run tests

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload` - Upload image file
- `POST /api/analyze-image` - Analyze image and generate palettes
- `POST /api/cleanup-session` - Clean up session files

## Project Structure

```
src/
├── components/          # React components
│   ├── ImageUpload.tsx
│   ├── Palette.tsx
│   ├── ColorSwatch.tsx
│   └── SelectedColors.tsx
├── services/           # API services
│   ├── paletteService.ts
│   └── googleVisionService.ts
├── utils/             # Utility functions
│   ├── colorUtils.ts
│   └── imageValidation.ts
├── types/             # TypeScript type definitions
│   └── index.ts
└── config.ts          # Configuration
```

## Environment Variables

- `REACT_APP_BACKEND_URL` - Backend server URL (default: http://localhost:3001)
- `PORT` - Backend server port (default: 3001)

## License

MIT
