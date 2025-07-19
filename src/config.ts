// Configuration for the application
export const config = {
  // Backend server configuration (now unified with frontend)
  backend: {
    // Single port for unified server
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

// Function to get the backend URL (now simplified)
export const getBackendUrl = async (): Promise<string> => {
  const baseUrl = `http://localhost:${config.backend.port}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${baseUrl}${config.backend.healthEndpoint}`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log(`✅ Unified server found on port ${config.backend.port}`);
      return baseUrl;
    }
  } catch (error) {
    console.log(`❌ Server not responding on port ${config.backend.port}`);
  }
  
  // Fallback to default
  console.log(`⚠️ Using default server port ${config.backend.port}`);
  return baseUrl;
}; 