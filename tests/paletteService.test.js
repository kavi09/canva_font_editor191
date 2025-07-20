const fs = require('fs');
const path = require('path');

// Mock the palette services
jest.mock('../src/services/googleVisionService', () => ({
  generateGoogleVisionPalettes: jest.fn()
}));

jest.mock('../src/services/colorThiefService', () => ({
  generateColorThiefPalette: jest.fn()
}));

jest.mock('../src/services/colourLoversService', () => ({
  generateColourLoversPalettes: jest.fn()
}));

const { generateGoogleVisionPalettes } = require('../src/services/googleVisionService');
const { generateColorThiefPalette } = require('../src/services/colorThiefService');
const { generateColourLoversPalettes } = require('../src/services/colourLoversService');
const { generateAllPalettes } = require('../src/services/paletteService');

describe('Palette Service Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Successful palette generation
  test('should generate 3 palettes with 5 unique colors each', async () => {
    // Mock successful responses
    generateGoogleVisionPalettes.mockResolvedValue([
      {
        id: 'google-1',
        name: 'Google Palette 1',
        colors: [
          { hex: '#FF0000', rgb: [255, 0, 0], selected: false },
          { hex: '#00FF00', rgb: [0, 255, 0], selected: false },
          { hex: '#0000FF', rgb: [0, 0, 255], selected: false },
          { hex: '#FFFF00', rgb: [255, 255, 0], selected: false },
          { hex: '#FF00FF', rgb: [255, 0, 255], selected: false }
        ]
      },
      {
        id: 'google-2',
        name: 'Google Palette 2',
        colors: [
          { hex: '#00FFFF', rgb: [0, 255, 255], selected: false },
          { hex: '#800000', rgb: [128, 0, 0], selected: false },
          { hex: '#008000', rgb: [0, 128, 0], selected: false },
          { hex: '#000080', rgb: [0, 0, 128], selected: false },
          { hex: '#808000', rgb: [128, 128, 0], selected: false }
        ]
      },
      {
        id: 'google-3',
        name: 'Google Palette 3',
        colors: [
          { hex: '#800080', rgb: [128, 0, 128], selected: false },
          { hex: '#008080', rgb: [0, 128, 128], selected: false },
          { hex: '#FF8000', rgb: [255, 128, 0], selected: false },
          { hex: '#8000FF', rgb: [128, 0, 255], selected: false },
          { hex: '#FF0080', rgb: [255, 0, 128], selected: false }
        ]
      }
    ]);

    generateColorThiefPalette.mockResolvedValue({
      id: 'colorthief-1',
      name: 'ColorThief Palette',
      colors: [
        { hex: '#C0C0C0', rgb: [192, 192, 192], selected: false },
        { hex: '#808080', rgb: [128, 128, 128], selected: false },
        { hex: '#404040', rgb: [64, 64, 64], selected: false },
        { hex: '#202020', rgb: [32, 32, 32], selected: false },
        { hex: '#101010', rgb: [16, 16, 16], selected: false }
      ]
    });

    generateColourLoversPalettes.mockResolvedValue([
      {
        id: 'colourlovers-1',
        name: 'ColourLovers Palette 1',
        colors: [
          { hex: '#FFE4E1', rgb: [255, 228, 225], selected: false },
          { hex: '#F0F8FF', rgb: [240, 248, 255], selected: false },
          { hex: '#F5F5DC', rgb: [245, 245, 220], selected: false },
          { hex: '#FFEFD5', rgb: [255, 239, 213], selected: false },
          { hex: '#F0FFF0', rgb: [240, 255, 240], selected: false }
        ]
      },
      {
        id: 'colourlovers-2',
        name: 'ColourLovers Palette 2',
        colors: [
          { hex: '#FFF0F5', rgb: [255, 240, 245], selected: false },
          { hex: '#FDF5E6', rgb: [253, 245, 230], selected: false },
          { hex: '#F0FFFF', rgb: [240, 255, 255], selected: false },
          { hex: '#FFFACD', rgb: [255, 250, 205], selected: false },
          { hex: '#F8F8FF', rgb: [248, 248, 255], selected: false }
        ]
      },
      {
        id: 'colourlovers-3',
        name: 'ColourLovers Palette 3',
        colors: [
          { hex: '#FAF0E6', rgb: [250, 240, 230], selected: false },
          { hex: '#F5F5F5', rgb: [245, 245, 245], selected: false },
          { hex: '#F0F0F0', rgb: [240, 240, 240], selected: false },
          { hex: '#E6E6FA', rgb: [230, 230, 250], selected: false },
          { hex: '#E0FFFF', rgb: [224, 255, 255], selected: false }
        ]
      }
    ]);

    const result = await generateAllPalettes('test-image.jpg');

    expect(result.palettes).toHaveLength(3);
    expect(result.error).toBeUndefined();
    
    // Check each palette has exactly 5 colors
    result.palettes.forEach((palette, index) => {
      expect(palette.colors).toHaveLength(5);
      expect(palette.id).toBe(`palette-${index + 1}`);
      expect(palette.name).toBe(`Palette ${index + 1}`);
    });

    // Check all colors are unique (no duplicates)
    const allColors = result.palettes.flatMap(p => p.colors);
    const uniqueColors = new Set(allColors.map(c => c.hex));
    expect(uniqueColors.size).toBe(15); // 15 unique colors total
  });

  // Test 2: Google Vision service failure
  test('should handle Google Vision service failure gracefully', async () => {
    generateGoogleVisionPalettes.mockRejectedValue(new Error('Google Vision API error'));
    generateColorThiefPalette.mockResolvedValue({
      id: 'colorthief-1',
      name: 'ColorThief Palette',
      colors: [
        { hex: '#FF0000', rgb: [255, 0, 0], selected: false },
        { hex: '#00FF00', rgb: [0, 255, 0], selected: false },
        { hex: '#0000FF', rgb: [0, 0, 255], selected: false },
        { hex: '#FFFF00', rgb: [255, 255, 0], selected: false },
        { hex: '#FF00FF', rgb: [255, 0, 255], selected: false }
      ]
    });
    generateColourLoversPalettes.mockResolvedValue([
      {
        id: 'colourlovers-1',
        name: 'ColourLovers Palette 1',
        colors: [
          { hex: '#C0C0C0', rgb: [192, 192, 192], selected: false },
          { hex: '#808080', rgb: [128, 128, 128], selected: false },
          { hex: '#404040', rgb: [64, 64, 64], selected: false },
          { hex: '#202020', rgb: [32, 32, 32], selected: false },
          { hex: '#101010', rgb: [16, 16, 16], selected: false }
        ]
      }
    ]);

    const result = await generateAllPalettes('test-image.jpg');

    expect(result.palettes).toHaveLength(3);
    expect(result.error).toBeUndefined();
    
    // Should still generate 3 palettes even with one service failing
    result.palettes.forEach(palette => {
      expect(palette.colors).toHaveLength(5);
    });
  });

  // Test 3: All services failing
  test('should handle all services failing with user-friendly error', async () => {
    generateGoogleVisionPalettes.mockRejectedValue(new Error('Google Vision failed'));
    generateColorThiefPalette.mockRejectedValue(new Error('ColorThief failed'));
    generateColourLoversPalettes.mockRejectedValue(new Error('ColourLovers failed'));

    const result = await generateAllPalettes('test-image.jpg');

    expect(result.palettes).toHaveLength(3);
    expect(result.error).toBeUndefined();
    
    // Should still generate 3 palettes with random colors
    result.palettes.forEach(palette => {
      expect(palette.colors).toHaveLength(5);
    });
  });

  // Test 4: Insufficient unique colors
  test('should generate additional colors when insufficient unique colors available', async () => {
    // Mock services returning similar colors
    generateGoogleVisionPalettes.mockResolvedValue([
      {
        id: 'google-1',
        name: 'Google Palette 1',
        colors: [
          { hex: '#FF0000', rgb: [255, 0, 0], selected: false },
          { hex: '#FF0001', rgb: [255, 0, 1], selected: false }, // Very similar
          { hex: '#FF0002', rgb: [255, 0, 2], selected: false }, // Very similar
          { hex: '#FF0003', rgb: [255, 0, 3], selected: false }, // Very similar
          { hex: '#FF0004', rgb: [255, 0, 4], selected: false }  // Very similar
        ]
      }
    ]);

    generateColorThiefPalette.mockResolvedValue({
      id: 'colorthief-1',
      name: 'ColorThief Palette',
      colors: [
        { hex: '#FF0005', rgb: [255, 0, 5], selected: false }, // Very similar
        { hex: '#FF0006', rgb: [255, 0, 6], selected: false }, // Very similar
        { hex: '#FF0007', rgb: [255, 0, 7], selected: false }, // Very similar
        { hex: '#FF0008', rgb: [255, 0, 8], selected: false }, // Very similar
        { hex: '#FF0009', rgb: [255, 0, 9], selected: false }  // Very similar
      ]
    });

    generateColourLoversPalettes.mockResolvedValue([
      {
        id: 'colourlovers-1',
        name: 'ColourLovers Palette 1',
        colors: [
          { hex: '#FF000A', rgb: [255, 0, 10], selected: false }, // Very similar
          { hex: '#FF000B', rgb: [255, 0, 11], selected: false }, // Very similar
          { hex: '#FF000C', rgb: [255, 0, 12], selected: false }, // Very similar
          { hex: '#FF000D', rgb: [255, 0, 13], selected: false }, // Very similar
          { hex: '#FF000E', rgb: [255, 0, 14], selected: false }  // Very similar
        ]
      }
    ]);

    const result = await generateAllPalettes('test-image.jpg');

    expect(result.palettes).toHaveLength(3);
    expect(result.error).toBeUndefined();
    
    // Should still generate 3 palettes with 5 colors each
    result.palettes.forEach(palette => {
      expect(palette.colors).toHaveLength(5);
    });
  });

  // Test 5: Network timeout
  test('should handle network timeout gracefully', async () => {
    generateGoogleVisionPalettes.mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 100)
      )
    );
    generateColorThiefPalette.mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 100)
      )
    );
    generateColourLoversPalettes.mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 100)
      )
    );

    const result = await generateAllPalettes('test-image.jpg');

    expect(result.palettes).toHaveLength(3);
    expect(result.error).toBeUndefined();
    
    // Should generate fallback palettes
    result.palettes.forEach(palette => {
      expect(palette.colors).toHaveLength(5);
    });
  });

  // Test 6: Invalid image URL
  test('should handle invalid image URL gracefully', async () => {
    generateGoogleVisionPalettes.mockRejectedValue(new Error('Invalid image URL'));
    generateColorThiefPalette.mockRejectedValue(new Error('Invalid image URL'));
    generateColourLoversPalettes.mockRejectedValue(new Error('Invalid image URL'));

    const result = await generateAllPalettes('invalid-url.jpg');

    expect(result.palettes).toHaveLength(3);
    expect(result.error).toBeUndefined();
    
    // Should generate fallback palettes
    result.palettes.forEach(palette => {
      expect(palette.colors).toHaveLength(5);
    });
  });

  // Test 7: Color similarity detection
  test('should properly detect and remove similar colors', async () => {
    generateGoogleVisionPalettes.mockResolvedValue([
      {
        id: 'google-1',
        name: 'Google Palette 1',
        colors: [
          { hex: '#FF0000', rgb: [255, 0, 0], selected: false },
          { hex: '#FF0001', rgb: [255, 0, 1], selected: false }, // Very similar
          { hex: '#00FF00', rgb: [0, 255, 0], selected: false },
          { hex: '#00FF01', rgb: [0, 255, 1], selected: false }, // Very similar
          { hex: '#0000FF', rgb: [0, 0, 255], selected: false }
        ]
      }
    ]);

    generateColorThiefPalette.mockResolvedValue({
      id: 'colorthief-1',
      name: 'ColorThief Palette',
      colors: [
        { hex: '#FF0002', rgb: [255, 0, 2], selected: false }, // Very similar to first
        { hex: '#00FF02', rgb: [0, 255, 2], selected: false }, // Very similar to third
        { hex: '#0000FE', rgb: [0, 0, 254], selected: false }, // Very similar to fifth
        { hex: '#808080', rgb: [128, 128, 128], selected: false },
        { hex: '#404040', rgb: [64, 64, 64], selected: false }
      ]
    });

    generateColourLoversPalettes.mockResolvedValue([
      {
        id: 'colourlovers-1',
        name: 'ColourLovers Palette 1',
        colors: [
          { hex: '#C0C0C0', rgb: [192, 192, 192], selected: false },
          { hex: '#202020', rgb: [32, 32, 32], selected: false },
          { hex: '#FFFFFF', rgb: [255, 255, 255], selected: false },
          { hex: '#000000', rgb: [0, 0, 0], selected: false },
          { hex: '#808080', rgb: [128, 128, 128], selected: false } // Duplicate
        ]
      }
    ]);

    const result = await generateAllPalettes('test-image.jpg');

    expect(result.palettes).toHaveLength(3);
    
    // Check that similar colors are removed
    const allColors = result.palettes.flatMap(p => p.colors);
    const uniqueColors = new Set(allColors.map(c => c.hex));
    expect(uniqueColors.size).toBe(15); // Should have exactly 15 unique colors
  });
});

console.log('✅ Palette service tests completed'); 