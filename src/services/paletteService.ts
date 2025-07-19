import { PaletteGenerationResult } from '../types';
import { generateGoogleVisionPalettes } from './googleVisionService';

export const generateAllPalettes = async (imageUrl: string): Promise<PaletteGenerationResult> => {
  try {
    const palettes = await generateGoogleVisionPalettes(imageUrl);
    
    return {
      palettes
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate palettes';
    return {
      palettes: [],
      error: errorMessage
    };
  }
}; 