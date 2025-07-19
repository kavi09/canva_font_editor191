import React from 'react';
import { Color } from '../types';
import { copyToClipboard } from '../utils/colorUtils';
import './ColorSwatch.css';

interface ColorSwatchProps {
  color: Color;
  isSelected: boolean;
  onToggle: (color: Color) => void;
  showHexCode?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  color, 
  isSelected, 
  onToggle, 
  showHexCode = true 
}) => {
  const handleClick = () => {
    onToggle(color);
  };

  const handleCopyHex = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(color.hex);
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = 'Hex code copied!';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    } catch (error) {
      console.error('Failed to copy hex code:', error);
    }
  };

  return (
    <div 
      className={`color-swatch ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={{ 
        backgroundColor: color.hex,
        border: isSelected ? '3px solid #333' : '1px solid #ddd'
      }}
    >
      {showHexCode && (
        <div className="hex-code" onClick={handleCopyHex}>
          <span className="hex-text">{color.hex}</span>
          <span className="copy-icon">📋</span>
        </div>
      )}
      {isSelected && (
        <div className="selection-indicator">
          <span className="checkmark">✓</span>
        </div>
      )}
    </div>
  );
};

export default ColorSwatch; 