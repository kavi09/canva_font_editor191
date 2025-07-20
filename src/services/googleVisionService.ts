import { Palette } from '../types';

// Function to extract colors from image using Canvas API
const extractColorsFromImage = (imageUrl: string): Promise<number[][]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample pixels and collect colors
        const colors: { [key: string]: number } = {};
        const step = Math.max(1, Math.floor(data.length / 4 / 1000)); // Sample every nth pixel
        
        for (let i = 0; i < data.length; i += step * 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Skip transparent pixels
          if (a < 128) continue;
          
          // Quantize colors to reduce noise
          const quantizedR = Math.floor(r / 16) * 16;
          const quantizedG = Math.floor(g / 16) * 16;
          const quantizedB = Math.floor(b / 16) * 16;
          
          const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
          colors[colorKey] = (colors[colorKey] || 0) + 1;
        }

        // Sort by frequency and get top colors
        const sortedColors = Object.entries(colors)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 15)
          .map(([colorKey]) => colorKey.split(',').map(Number));

        resolve(sortedColors);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for color analysis'));
    };

    img.src = imageUrl;
  });
};

// Function to generate complementary colors
const generateComplementaryColors = (colors: number[][]): number[][] => {
  return colors.map(([r, g, b]) => [
    Math.min(255, Math.max(0, 255 - r)),
    Math.min(255, Math.max(0, 255 - g)),
    Math.min(255, Math.max(0, 255 - b))
  ]);
};

// Function to generate analogous colors
const generateAnalogousColors = (colors: number[][]): number[][] => {
  return colors.map(([r, g, b], index) => [
    Math.min(255, Math.max(0, r + (index * 30))),
    Math.min(255, Math.max(0, g + (index * 20))),
    Math.min(255, Math.max(0, b + (index * 25)))
  ]);
};

export const generateGoogleVisionPalettes = async (imageUrl: string): Promise<Palette[]> => {
  try {
    console.log('Starting Google Vision analysis for:', imageUrl);
    
    // Extract colors from the image
    const dominantColors = await extractColorsFromImage(imageUrl);
    console.log('Extracted dominant colors:', dominantColors.length);
    
    if (dominantColors.length === 0) {
      throw new Error('No colors could be extracted from the image');
    }

    // Take top 5 colors for each palette
    const topColors = dominantColors.slice(0, 5);
    
    // Generate three different palettes
    const palettes: Palette[] = [
      {
        id: 'dominant',
        name: 'Dominant Colors',
        colors: topColors.map(([r, g, b]) => ({
          hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
          rgb: [r, g, b],
          selected: false
        }))
      },
      {
        id: 'complementary',
        name: 'Complementary Palette',
        colors: generateComplementaryColors(topColors).map(([r, g, b]) => ({
          hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
          rgb: [r, g, b],
          selected: false
        }))
      },
      {
        id: 'analogous',
        name: 'Analogous Palette',
        colors: generateAnalogousColors(topColors).map(([r, g, b]) => ({
          hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
          rgb: [r, g, b],
          selected: false
        }))
      }
    ];

    console.log('Generated palettes:', palettes.length, 'palettes with', palettes[0].colors.length, 'colors each');
    return palettes;

  } catch (error) {
    console.error('Google Vision error:', error);
    throw new Error(`Unable to analyze image colors: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 