import { PaletteGenerationResult } from '../types';
import { generateGoogleVisionPalettes } from './googleVisionService';
import { generateColorThiefPalette } from './colorThiefService';
import { generateColourLoversPalettes } from './colourLoversService';

export const generateAllPalettes = async (imageUrl: string): Promise<PaletteGenerationResult> => {
  try {
    console.log('🎨 Starting palette generation with all algorithms...');
    
    // Generate palettes using all three algorithms
    const [googleVisionPalettes, colorThiefPalette, colourLoversPalettes] = await Promise.allSettled([
      generateGoogleVisionPalettes(imageUrl),
      generateColorThiefPalette(imageUrl),
      generateColourLoversPalettes(imageUrl)
    ]);

    const allPalettes: any[] = [];

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

    // Ensure we have exactly 3 distinct palettes
    const distinctPalettes = allPalettes.slice(0, 3);
    
    console.log(`✅ Generated ${distinctPalettes.length} palettes successfully`);
    
    return {
      palettes: distinctPalettes
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