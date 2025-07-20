import { PaletteGenerationResult, Color, Palette } from '../types';
import { generateGoogleVisionPalettes } from './googleVisionService';
import { generateColorThiefPalette } from './colorThiefService';
import { generateColourLoversPalettes } from './colourLoversService';

// Helper function to check if two colors are similar (within threshold)
const areColorsSimilar = (color1: Color, color2: Color, threshold: number = 25): boolean => {
  const [r1, g1, b1] = color1.rgb;
  const [r2, g2, b2] = color2.rgb;
  
  const distance = Math.sqrt(
    Math.pow(r1 - r2, 2) + 
    Math.pow(g1 - g2, 2) + 
    Math.pow(b1 - b2, 2)
  );
  
  return distance < threshold;
};

// Helper function to collect all unique colors from all palettes
const collectAllUniqueColors = (palettes: Palette[]): Color[] => {
  const allColors: Color[] = [];
  
  for (const palette of palettes) {
    for (const color of palette.colors) {
      const isDuplicate = allColors.some(existingColor => 
        areColorsSimilar(color, existingColor)
      );
      
      if (!isDuplicate) {
        allColors.push(color);
      }
    }
  }
  
  return allColors;
};

// Helper function to create 3 palettes with exactly 5 unique colors each
const createThreePalettes = (allColors: Color[]): Palette[] => {
  if (allColors.length < 15) {
    console.warn(`Only ${allColors.length} unique colors available, need 15`);
    // Generate additional colors if needed
    while (allColors.length < 15) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      
      const newColor: Color = {
        hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
        rgb: [r, g, b],
        selected: false
      };
      
      const isDuplicate = allColors.some(existingColor => 
        areColorsSimilar(newColor, existingColor)
      );
      
      if (!isDuplicate) {
        allColors.push(newColor);
      }
    }
  }
  
  // Take exactly 15 colors
  const selectedColors = allColors.slice(0, 15);
  
  // Create 3 palettes with 5 colors each
  return [
    {
      id: 'palette-1',
      name: 'Palette 1',
      colors: selectedColors.slice(0, 5)
    },
    {
      id: 'palette-2', 
      name: 'Palette 2',
      colors: selectedColors.slice(5, 10)
    },
    {
      id: 'palette-3',
      name: 'Palette 3', 
      colors: selectedColors.slice(10, 15)
    }
  ];
};

export const generateAllPalettes = async (imageUrl: string): Promise<PaletteGenerationResult> => {
  try {
    console.log('🎨 Starting palette generation with all algorithms...');
    
    // Generate palettes using all three algorithms
    const [googleVisionPalettes, colorThiefPalette, colourLoversPalettes] = await Promise.allSettled([
      generateGoogleVisionPalettes(imageUrl),
      generateColorThiefPalette(imageUrl),
      generateColourLoversPalettes(imageUrl)
    ]);

    const allPalettes: Palette[] = [];

    // Add Google Vision palettes (should return 3 palettes)
    if (googleVisionPalettes.status === 'fulfilled') {
      allPalettes.push(...googleVisionPalettes.value);
    } else {
      console.error('Google Vision failed:', googleVisionPalettes.reason);
    }

    // Add ColorThief palette (single palette)
    if (colorThiefPalette.status === 'fulfilled') {
      allPalettes.push(colorThiefPalette.value);
    } else {
      console.error('ColorThief failed:', colorThiefPalette.reason);
    }

    // Add ColourLovers palettes (should return 3 palettes)
    if (colourLoversPalettes.status === 'fulfilled') {
      allPalettes.push(...colourLoversPalettes.value);
    } else {
      console.error('ColourLovers failed:', colourLoversPalettes.reason);
    }

    // Collect all unique colors from all palettes
    const allUniqueColors = collectAllUniqueColors(allPalettes);
    console.log(`📊 Found ${allUniqueColors.length} unique colors from all algorithms`);
    
    // Create exactly 3 palettes with 5 unique colors each
    const finalPalettes = createThreePalettes(allUniqueColors);
    
    console.log(`✅ Generated 3 palettes with exactly 5 unique colors each (15 total unique colors)`);
    
    return {
      palettes: finalPalettes
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate palettes';
    console.error('❌ Palette generation error:', errorMessage);
    return {
      palettes: [],
      error: errorMessage
    };
  }
}; 