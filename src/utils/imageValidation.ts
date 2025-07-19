import { ImageValidationResult } from '../types';
import { getBackendUrl } from '../config';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Generate session ID for this browser session
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('uploadSessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('uploadSessionId', sessionId);
  }
  return sessionId;
};

export const validateImage = (file: File): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      resolve({
        isValid: false,
        message: `File size too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        fileSize: file.size
      });
      return;
    }

    // Check file format
    if (!ALLOWED_FORMATS.includes(file.type)) {
      resolve({
        isValid: false,
        message: `Invalid file format. Please upload a JPEG, PNG, or WebP image.`,
        fileSize: file.size
      });
      return;
    }

    // Image is valid (no dimension checks)
    resolve({
      isValid: true,
      message: `Image is valid. Size: ${(file.size / 1024).toFixed(1)}KB`,
      fileSize: file.size
    });
  });
};

// Upload image to server
export const uploadImageToServer = async (file: File): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const backendUrl = await getBackendUrl();
    const formData = new FormData();
    formData.append('image', file);

    const sessionId = getSessionId();

    const response = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Session-ID': sessionId
      }
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        imageUrl: `${backendUrl}${data.imageUrl}`
      };
    } else {
      return {
        success: false,
        error: data.error || 'Upload failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to upload image. Please try again.'
    };
  }
};

// Cleanup session files when browser closes
export const setupSessionCleanup = async () => {
  const sessionId = getSessionId();
  const backendUrl = await getBackendUrl();
  
  // Cleanup when page unloads (user closes browser/tab)
  window.addEventListener('beforeunload', () => {
    // Use sendBeacon for reliable cleanup even if page is closing
    const cleanupData = new FormData();
    cleanupData.append('sessionId', sessionId);
    
    navigator.sendBeacon(`${backendUrl}/api/cleanup-session`, cleanupData);
  });

  // Also cleanup when user navigates away (SPA navigation)
  window.addEventListener('pagehide', () => {
    fetch(`${backendUrl}/api/cleanup-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
      // Use keepalive to ensure request completes even if page is unloading
      keepalive: true
    }).catch(() => {
      // Ignore errors during cleanup
    });
  });
}; 