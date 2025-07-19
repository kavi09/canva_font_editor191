import React from 'react';
import { Palette as PaletteType, Color } from '../types';
import ColorSwatch from './ColorSwatch';
import './Palette.css';

interface PaletteProps {
  palette: PaletteType;
  onColorToggle: (color: Color) => void;
  selectedColors: Color[];
}

const Palette: React.FC<PaletteProps> = ({ 
  palette, 
  onColorToggle, 
  selectedColors 
}) => {
  const isColorSelected = (color: Color) => {
    return selectedColors.some(selected => selected.hex === color.hex);
  };

  return (
    <div className="palette">
      <h3 className="palette-name">{palette.name}</h3>
      <div className="colors-grid">
        {palette.colors.map((color, index) => (
          <ColorSwatch
            key={`${palette.id}-${index}`}
            color={color}
            isSelected={isColorSelected(color)}
            onToggle={onColorToggle}
            showHexCode={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Palette; 