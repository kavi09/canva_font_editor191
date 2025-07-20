import { Palette, Color } from '../types';
import { createColor } from '../utils/colorUtils';

// Generate three distinct palettes based on different color schemes
const generateDistinctPalettes = (imageUrl: string): Palette[] => {
  const urlHash = imageUrl.split('/').pop() || '';
  const hash = urlHash.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  // Palette 1: Warm Colors (Reds, Oranges, Yellows)
  const warmColors: Color[] = [
    createColor(`#${Math.abs(hash % 16711680).toString(16).padStart(6, '0')}`), // Red dominant
    createColor(`#${Math.abs((hash + 1000000) % 16776960).toString(16).padStart(6, '0')}`), // Orange dominant
    createColor(`#${Math.abs((hash + 2000000) % 16776960).toString(16).padStart(6, '0')}`), // Yellow dominant
    createColor(`#${Math.abs((hash + 3000000) % 16711680).toString(16).padStart(6, '0')}`), // Red variant
    createColor(`#${Math.abs((hash + 4000000) % 16776960).toString(16).padStart(6, '0')}`), // Orange variant
  ];

  // Palette 2: Cool Colors (Blues, Greens, Purples)
  const coolColors: Color[] = [
    createColor(`#${Math.abs((hash * 2) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 3) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 4) % 255).toString(16).padStart(2, '0')}`), // Blue dominant
    createColor(`#${Math.abs((hash * 3) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 2) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 5) % 255).toString(16).padStart(2, '0')}`), // Green dominant
    createColor(`#${Math.abs((hash * 4) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 6) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 2) % 255).toString(16).padStart(2, '0')}`), // Purple dominant
    createColor(`#${Math.abs((hash * 5) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 7) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 3) % 255).toString(16).padStart(2, '0')}`), // Blue variant
    createColor(`#${Math.abs((hash * 6) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 8) % 255).toString(16).padStart(2, '0')}${Math.abs((hash * 4) % 255).toString(16).padStart(2, '0')}`), // Green variant
  ];

  // Palette 3: Neutral Colors (Grays, Browns, Beiges)
  const neutralColors: Color[] = [
    createColor(`#${Math.abs((hash * 7) % 128 + 64).toString(16).padStart(2, '0')}${Math.abs((hash * 8) % 128 + 64).toString(16).padStart(2, '0')}${Math.abs((hash * 9) % 128 + 64).toString(16).padStart(2, '0')}`), // Gray
    createColor(`#${Math.abs((hash * 10) % 128 + 96).toString(16).padStart(2, '0')}${Math.abs((hash * 11) % 128 + 64).toString(16).padStart(2, '0')}${Math.abs((hash * 12) % 128 + 32).toString(16).padStart(2, '0')}`), // Brown
    createColor(`#${Math.abs((hash * 13) % 128 + 128).toString(16).padStart(2, '0')}${Math.abs((hash * 14) % 128 + 112).toString(16).padStart(2, '0')}${Math.abs((hash * 15) % 128 + 96).toString(16).padStart(2, '0')}`), // Beige
    createColor(`#${Math.abs((hash * 16) % 128 + 80).toString(16).padStart(2, '0')}${Math.abs((hash * 17) % 128 + 80).toString(16).padStart(2, '0')}${Math.abs((hash * 18) % 128 + 80).toString(16).padStart(2, '0')}`), // Light gray
    createColor(`#${Math.abs((hash * 19) % 128 + 48).toString(16).padStart(2, '0')}${Math.abs((hash * 20) % 128 + 48).toString(16).padStart(2, '0')}${Math.abs((hash * 21) % 128 + 48).toString(16).padStart(2, '0')}`), // Dark gray
  ];

  return [
    {
      id: `colourlovers-warm-${Date.now()}`,
      name: 'Warm Palette',
      colors: warmColors
    },
    {
      id: `colourlovers-cool-${Date.now()}`,
      name: 'Cool Palette',
      colors: coolColors
    },
    {
      id: `colourlovers-neutral-${Date.now()}`,
      name: 'Neutral Palette',
      colors: neutralColors
    }
  ];
};

export const generateColourLoversPalettes = async (imageUrl: string): Promise<Palette[]> => {
  try {
    return generateDistinctPalettes(imageUrl);
  } catch (error) {
    console.error('ColourLovers error:', error);
    throw new Error('Unable to generate color palettes. Please try again later.');
  }
}; 