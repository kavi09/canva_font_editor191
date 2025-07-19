export interface Color {
  hex: string;
  rgb: [number, number, number];
  selected: boolean;
}

export interface Palette {
  id: string;
  name: string;
  colors: Color[];
}

export interface ImageValidationResult {
  isValid: boolean;
  message: string;
  fileSize?: number;
}

export interface PaletteGenerationResult {
  palettes: Palette[];
  error?: string;
} 