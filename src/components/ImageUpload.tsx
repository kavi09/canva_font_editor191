import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { validateImage, uploadImageToServer } from '../utils/imageValidation';
import { ImageValidationResult } from '../types';

interface ImageUploadProps {
  onImageValid: (imageUrl: string) => void;
  onImageInvalid: (error: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageValid, onImageInvalid }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationResult, setValidationResult] = useState<ImageValidationResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsValidating(true);
    setIsUploading(false);
    setValidationResult(null);

    try {
      // First validate the image
      const result = await validateImage(file);
      setValidationResult(result);

      if (result.isValid) {
        // Then upload to server
        setIsUploading(true);
        const uploadResult = await uploadImageToServer(file);
        
        if (uploadResult.success && uploadResult.imageUrl) {
          onImageValid(uploadResult.imageUrl);
        } else {
          onImageInvalid(uploadResult.error || 'Upload failed');
        }
      } else {
        onImageInvalid(result.message);
      }
    } catch (error) {
      onImageInvalid('Failed to process image. Please try again.');
    } finally {
      setIsValidating(false);
      setIsUploading(false);
    }
  }, [onImageValid, onImageInvalid]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  return (
    <div className="image-upload-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${isValidating || isUploading ? 'validating' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="upload-content">
          {isValidating ? (
            <div className="validating-message">
              <div className="spinner"></div>
              <p>Validating image...</p>
            </div>
          ) : isUploading ? (
            <div className="validating-message">
              <div className="spinner"></div>
              <p>Uploading image to server...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3>Upload an Image</h3>
              <p>Drag and drop an image here, or click to select</p>
              <div className="requirements">
                <h4>Requirements:</h4>
                <ul>
                  <li>File size: Maximum 10MB</li>
                  <li>Formats: JPEG, PNG, WebP</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {validationResult && (
        <div className={`validation-result ${validationResult.isValid ? 'success' : 'error'}`}>
          <p>{validationResult.message}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 