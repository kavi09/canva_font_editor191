import React from 'react';
import { Color } from '../types';
import { copyToClipboard } from '../utils/colorUtils';
import ColorSwatch from './ColorSwatch';
import './SelectedColors.css';

interface SelectedColorsProps {
  selectedColors: Color[];
  onColorToggle: (color: Color) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  allColors: Color[];
}

const SelectedColors: React.FC<SelectedColorsProps> = ({
  selectedColors,
  onColorToggle,
  onSelectAll,
  onClearAll,
  allColors
}) => {
  const handleCopyAllHexCodes = async () => {
    if (selectedColors.length === 0) return;
    
    const hexCodes = selectedColors.map(color => color.hex).join('\n');
    try {
      await copyToClipboard(hexCodes);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = `${selectedColors.length} hex codes copied!`;
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
      console.error('Failed to copy hex codes:', error);
    }
  };

  const isAllSelected = selectedColors.length === allColors.length && allColors.length > 0;
  const hasSelectedColors = selectedColors.length > 0;

  return (
    <div className="selected-colors">
      <div className="selected-colors-header">
        <h3>Selected Colors ({selectedColors.length})</h3>
        <div className="action-buttons">
          <button 
            onClick={onSelectAll}
            className={`action-btn ${isAllSelected ? 'disabled' : ''}`}
            disabled={isAllSelected}
          >
            Select All
          </button>
          <button 
            onClick={onClearAll}
            className={`action-btn ${!hasSelectedColors ? 'disabled' : ''}`}
            disabled={!hasSelectedColors}
          >
            Clear All
          </button>
          <button 
            onClick={handleCopyAllHexCodes}
            className={`action-btn copy-all-btn ${!hasSelectedColors ? 'disabled' : ''}`}
            disabled={!hasSelectedColors}
          >
            Copy All Hex Codes
          </button>
        </div>
      </div>

      {hasSelectedColors ? (
        <div className="selected-colors-content">
          <div className="selected-colors-grid">
            {selectedColors.map((color, index) => (
              <div key={`selected-${index}`} className="selected-color-item">
                <ColorSwatch
                  color={color}
                  isSelected={true}
                  onToggle={onColorToggle}
                  showHexCode={true}
                />
              </div>
            ))}
          </div>
          
          <div className="hex-codes-section">
            <h4>All Selected Hex Codes:</h4>
            <div className="hex-codes-list">
              {selectedColors.map((color, index) => (
                <div key={`hex-${index}`} className="hex-code-item">
                  <span 
                    className="color-preview" 
                    style={{ backgroundColor: color.hex }}
                  ></span>
                  <span className="hex-code-text">{color.hex}</span>
                  <button 
                    onClick={() => copyToClipboard(color.hex)}
                    className="copy-single-btn"
                  >
                    📋
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-selection">
          <p>No colors selected. Click on any color swatch to select it.</p>
        </div>
      )}
    </div>
  );
};

export default SelectedColors; 