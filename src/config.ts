// Configuration for the application
export const config = {
  // Backend server configuration
  backend: {
    // Unified server port (same as frontend)
    port: 3000,
    // Health check endpoint
    healthEndpoint: '/api/health',
    // Upload endpoint
    uploadEndpoint: '/api/upload',
    // Analyze image endpoint
    analyzeEndpoint: '/api/analyze-image',
    // Cleanup session endpoint
    cleanupEndpoint: '/api/cleanup-session'
  },
  
  // Frontend configuration
  frontend: {
    // Same port as backend (unified server)
    port: 3000
  }
};

// Function to get the backend URL
export const getBackendUrl = async (): Promise<string> => {
  // Use environment variable if available, otherwise default to localhost:3000
  const baseUrl = process.env.REACT_APP_BACKEND_URL || `http://localhost:${config.backend.port}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${baseUrl}${config.backend.healthEndpoint}`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log(`✅ Unified server found on ${baseUrl}`);
      return baseUrl;
    }
  } catch (error) {
    console.log(`❌ Unified server not responding on ${baseUrl}`);
  }
  
  // Fallback to default
  console.log(`⚠️ Using default unified server URL ${baseUrl}`);
  return baseUrl;
}; 