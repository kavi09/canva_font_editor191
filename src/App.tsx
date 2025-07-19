import React, { useState, useEffect } from 'react';
import './App.css';
import ImageUpload from './components/ImageUpload';
import Palette from './components/Palette';
import SelectedColors from './components/SelectedColors';
import { Color, Palette as PaletteType } from './types';
import { generateAllPalettes } from './services/paletteService';
import { setupSessionCleanup } from './utils/imageValidation';

function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [palettes, setPalettes] = useState<PaletteType[]>([]);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Initialize session cleanup when app loads
  useEffect(() => {
    const initCleanup = async () => {
      await setupSessionCleanup();
    };
    initCleanup();
  }, []);

  // Get all colors from all palettes
  const getAllColors = (): Color[] => {
    return palettes.flatMap(palette => palette.colors);
  };

  const handleImageValid = async (imageUrl: string) => {
    console.log('🖼️ Image uploaded successfully:', imageUrl);
    console.log('📊 State before upload:', {
      uploadedImage: !!uploadedImage,
      palettesCount: palettes.length,
      selectedColorsCount: selectedColors.length,
      isGenerating
    });
    
    setUploadedImage(imageUrl);
    setError(null);
    setShowErrorModal(false);
    setIsGenerating(true);

    try {
      console.log('🎨 Starting palette generation...');
      const result = await generateAllPalettes(imageUrl);
      console.log('🎨 Palette generation result:', result);
      
      if (result.error) {
        console.error('❌ Palette generation error:', result.error);
        setError(result.error);
        setShowErrorModal(true);
      } else {
        console.log('✅ Palettes generated successfully:', result.palettes);
        console.log('📊 Setting palettes:', result.palettes.length, 'palettes');
        console.log('🎨 Palette details:', result.palettes.map(p => ({ id: p.id, name: p.name, colorsCount: p.colors.length })));
        
        setPalettes(result.palettes);
        
        // Force a re-render by updating state
        setTimeout(() => {
          console.log('📊 State after palette generation:', {
            uploadedImage: !!uploadedImage,
            palettesCount: palettes.length,
            selectedColorsCount: selectedColors.length,
            isGenerating: false
          });
        }, 100);
      }
    } catch (err) {
      console.error('❌ Unexpected error during palette generation:', err);
      const errorMessage = 'Failed to generate palettes. Please try again.';
      setError(errorMessage);
      setShowErrorModal(true);
    } finally {
      setIsGenerating(false);
      console.log('🏁 Generation completed, isGenerating set to false');
    }
  };

  const handleImageInvalid = (errorMessage: string) => {
    console.error('❌ Image validation failed:', errorMessage);
    setError(errorMessage);
    setShowErrorModal(true);
  };

  const handleColorToggle = (color: Color) => {
    console.log('🎨 Toggling color:', color.hex);
    setSelectedColors(prev => {
      const isSelected = prev.some(c => c.hex === color.hex);
      if (isSelected) {
        return prev.filter(c => c.hex !== color.hex);
      } else {
        return [...prev, color];
      }
    });
  };

  const handleSelectAll = () => {
    const allColors = getAllColors();
    console.log('🎨 Selecting all colors:', allColors.length);
    setSelectedColors(allColors);
  };

  const handleClearAll = () => {
    console.log('🎨 Clearing all selected colors');
    setSelectedColors([]);
  };

  const handleReset = () => {
    console.log('🔄 Resetting application state');
    setUploadedImage(null);
    setPalettes([]);
    setSelectedColors([]);
    setError(null);
    setShowErrorModal(false);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  // Log state changes
  useEffect(() => {
    console.log('📊 State changed:', {
      uploadedImage: !!uploadedImage,
      palettesCount: palettes.length,
      selectedColorsCount: selectedColors.length,
      isGenerating,
      error: !!error
    });
  }, [uploadedImage, palettes, selectedColors, isGenerating, error]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎨 Canvas Font Editor - Color Palette Generator</h1>
        <p>Upload an image to generate three distinct color palettes using Google Vision AI</p>
      </header>

      <main className="App-main">
        {!uploadedImage ? (
          <div className="upload-section">
            <ImageUpload 
              onImageValid={handleImageValid}
              onImageInvalid={handleImageInvalid}
            />
          </div>
        ) : (
          <div className="results-section">
            <div className="image-preview">
              <img src={uploadedImage} alt="Uploaded" />
              <button onClick={handleReset} className="reset-btn">
                Upload New Image
              </button>
            </div>

            {isGenerating && (
              <div className="generating-message">
                <div className="spinner"></div>
                <p>Analyzing image with Google Vision AI...</p>
              </div>
            )}

            {palettes.length > 0 && (
              <div className="palettes-section">
                <h2>Generated Palettes ({palettes.length})</h2>
                <div className="palettes-grid">
                  {palettes.map((palette) => {
                    console.log('🎨 Rendering palette:', palette.id, palette.name, 'with', palette.colors.length, 'colors');
                    return (
                      <Palette
                        key={palette.id}
                        palette={palette}
                        onColorToggle={handleColorToggle}
                        selectedColors={selectedColors}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {!isGenerating && palettes.length === 0 && (
              <div className="no-palettes-message">
                <p>No palettes generated yet. Please wait...</p>
                <p>Debug: palettes.length = {palettes.length}, isGenerating = {isGenerating.toString()}</p>
              </div>
            )}

            <SelectedColors
              selectedColors={selectedColors}
              onColorToggle={handleColorToggle}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              allColors={getAllColors()}
            />
          </div>
        )}
      </main>

      {/* Error Modal */}
      {showErrorModal && error && (
        <div className="error-modal-overlay" onClick={closeErrorModal}>
          <div className="error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="error-modal-header">
              <h3>Error</h3>
              <button className="close-btn" onClick={closeErrorModal}>×</button>
            </div>
            <div className="error-modal-content">
              <p>{error}</p>
            </div>
            <div className="error-modal-footer">
              <button className="error-modal-btn" onClick={closeErrorModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
