import { Palette, Color } from '../types';
import { createColor } from '../utils/colorUtils';
import { getBackendUrl } from '../config';

// Function to convert RGB to Hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Function to generate complementary colors
const generateComplementaryColors = (dominantColors: Color[]): Color[] => {
  return dominantColors.map(color => {
    const [r, g, b] = color.rgb;
    const complementary = createColor(rgbToHex(255 - r, 255 - g, 255 - b));
    return complementary;
  });
};

// Function to generate analogous colors
const generateAnalogousColors = (dominantColors: Color[]): Color[] => {
  return dominantColors.map(color => {
    const [r, g, b] = color.rgb;
    // Shift hue by 30 degrees for analogous colors
    const analogous = createColor(rgbToHex(
      Math.min(255, Math.max(0, r + 30)),
      Math.min(255, Math.max(0, g + 30)),
      Math.min(255, Math.max(0, b + 30))
    ));
    return analogous;
  });
};

export const generateGoogleVisionPalettes = async (imageUrl: string): Promise<Palette[]> => {
  try {
    console.log('Starting Google Vision analysis for:', imageUrl);
    
    // Get dynamic backend URL
    const backendUrl = await getBackendUrl();
    
    // Convert image URL to base64 for Google Vision API
    console.log('Fetching image from:', imageUrl);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    console.log('Image blob size:', blob.size, 'bytes');
    
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        console.log('Base64 conversion completed, length:', result.length);
        resolve(result);
      };
      reader.readAsDataURL(blob);
    });

    // Remove data URL prefix
    const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    console.log('Image converted to base64, length:', base64Data.length);

    // Call our backend endpoint that uses Google Vision
    console.log('Calling backend analyze-image endpoint...');
    const visionResponse = await fetch(`${backendUrl}/api/analyze-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Data
      })
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      throw new Error(`Backend API error: ${visionResponse.status} ${visionResponse.statusText} - ${errorText}`);
    }

    const visionData = await visionResponse.json();
    console.log('Backend response received:', visionData);
    
    if (!visionData.palettes || visionData.palettes.length === 0) {
      throw new Error('No palettes generated from the image');
    }

    console.log('Generated palettes:', visionData.palettes);
    return visionData.palettes;

  } catch (error) {
    console.error('Google Vision error:', error);
    throw new Error(`Unable to analyze image colors: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 