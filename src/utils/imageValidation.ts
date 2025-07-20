import { ImageValidationResult } from '../types';
import { getBackendUrl } from '../config';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Generate session ID for this browser session
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('uploadSessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('uploadSessionId', sessionId);
    console.log('🔧 Created new session ID:', sessionId);
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

    // Check image dimensions
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      
      if (width < 100 || height < 100) {
        resolve({
          isValid: false,
          message: `Image too small. Minimum dimensions are 100x100 pixels. Current: ${width}x${height}`,
          fileSize: file.size
        });
        return;
      }
      
      if (width > 4096 || height > 4096) {
        resolve({
          isValid: false,
          message: `Image too large. Maximum dimensions are 4096x4096 pixels. Current: ${width}x${height}`,
          fileSize: file.size
        });
        return;
      }

      // Image is valid
      resolve({
        isValid: true,
        message: `Image is valid. Size: ${(file.size / 1024).toFixed(1)}KB, Dimensions: ${width}x${height}`,
        fileSize: file.size
      });
    };

    img.onerror = () => {
      resolve({
        isValid: false,
        message: 'Unable to read image dimensions. Please try a different image.',
        fileSize: file.size
      });
    };

    img.src = URL.createObjectURL(file);
  });
};

// Upload image to server
export const uploadImageToServer = async (file: File): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const backendUrl = await getBackendUrl();
    const formData = new FormData();
    formData.append('image', file);

    const sessionId = getSessionId();
    console.log('📤 Uploading file with session ID:', sessionId);

    const response = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Session-ID': sessionId
      }
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ File uploaded successfully');
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

// Enhanced cleanup function
const performCleanup = async () => {
  try {
    const sessionId = getSessionId();
    const backendUrl = await getBackendUrl();
    
    console.log('🧹 Performing cleanup for session:', sessionId);
    
    const response = await fetch(`${backendUrl}/api/cleanup-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
      // Use keepalive to ensure request completes even if page is unloading
      keepalive: true
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Cleanup completed:', result.message);
    } else {
      console.error('❌ Cleanup failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Cleanup error:', error);
  }
};

// Cleanup session files when browser closes
export const setupSessionCleanup = async () => {
  const sessionId = getSessionId();
  console.log('🔧 Setting up session cleanup for:', sessionId);
  
  // Cleanup when page unloads (user closes browser/tab)
  window.addEventListener('beforeunload', () => {
    console.log('🔄 Browser closing, initiating cleanup...');
    
    // Use sendBeacon for reliable cleanup even if page is closing
    // Note: sendBeacon doesn't support custom headers, so we'll use a different approach
    const cleanupData = new FormData();
    cleanupData.append('sessionId', sessionId);
    
    const backendUrl = window.location.origin; // Use same origin since we're unified
    console.log('📤 Sending cleanup beacon to:', `${backendUrl}/api/cleanup-session`);
    
    // Try to send with session ID in URL parameter since sendBeacon doesn't support headers
    const cleanupUrl = `${backendUrl}/api/cleanup-session?sessionId=${encodeURIComponent(sessionId)}`;
    navigator.sendBeacon(cleanupUrl, cleanupData);
  });

  // Also cleanup when user navigates away (SPA navigation)
  window.addEventListener('pagehide', () => {
    console.log('🔄 Page hiding, performing cleanup...');
    performCleanup();
  });

  // Cleanup when window loses focus (user switches tabs/apps)
  window.addEventListener('blur', () => {
    // Small delay to avoid too frequent cleanup calls
    setTimeout(() => {
      if (document.hidden) {
        console.log('🔄 Window lost focus, performing cleanup...');
        performCleanup();
      }
    }, 1000);
  });

  // Cleanup when visibility changes (user switches tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('🔄 Page hidden, performing cleanup...');
      performCleanup();
    }
  });

  // Periodic cleanup every 30 minutes as backup
  setInterval(() => {
    console.log('🔄 Periodic cleanup check...');
    performCleanup();
  }, 30 * 60 * 1000); // 30 minutes
}; 