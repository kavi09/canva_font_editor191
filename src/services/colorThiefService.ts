import ColorThief from 'colorthief';
import { Palette, Color } from '../types';
import { createColor } from '../utils/colorUtils';

export const generateColorThiefPalette = async (imageUrl: string): Promise<Palette> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 5);
        
        const colors: Color[] = palette.map(([r, g, b]) => {
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          return createColor(hex);
        });

        resolve({
          id: `colorthief-${Date.now()}`,
          name: 'ColorThief Palette',
          colors
        });
      } catch (error) {
        console.error('ColorThief error:', error);
        reject(new Error('Unable to extract colors from this image. Please try a different image or check if the image format is supported.'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for color analysis. Please ensure the image is accessible and try again.'));
    };

    img.src = imageUrl;
  });
}; 