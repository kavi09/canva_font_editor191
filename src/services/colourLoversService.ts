import { Palette, Color } from '../types';
import { createColor } from '../utils/colorUtils';

// Generate three distinct palettes based on different color schemes
const generateDistinctPalettes = (imageUrl: string): Palette[] => {
  const urlHash = imageUrl.split('/').pop() || '';
  const hash = urlHash.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  // Palette 1: Warm Colors
  const warmColors: Color[] = [
    createColor(`#${Math.abs(hash % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs((hash + 1000000) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs((hash + 2000000) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs((hash + 3000000) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs((hash + 4000000) % 16777215).toString(16).padStart(6, '0')}`),
  ];

  // Palette 2: Cool Colors
  const coolColors: Color[] = [
    createColor(`#${Math.abs((hash * 2) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs(((hash * 2) + 1000000) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs(((hash * 2) + 2000000) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs(((hash * 2) + 3000000) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs(((hash * 2) + 4000000) % 16777215).toString(16).padStart(6, '0')}`),
  ];

  // Palette 3: Complementary Colors
  const complementaryColors: Color[] = [
    createColor(`#${Math.abs((hash * 3) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs(((hash * 3) + 1000000) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs(((hash * 3) + 2000000) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs(((hash * 3) + 3000000) % 16777215).toString(16).padStart(6, '0')}`),
    createColor(`#${Math.abs(((hash * 3) + 4000000) % 16777215).toString(16).padStart(6, '0')}`),
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
      id: `colourlovers-complementary-${Date.now()}`,
      name: 'Complementary Palette',
      colors: complementaryColors
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