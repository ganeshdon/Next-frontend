// Browser fingerprinting utility for anonymous user tracking
export const getBrowserFingerprint = async () => {
  try {
    // Check if we already have a stored fingerprint
    const storedFingerprint = typeof window !== 'undefined' 
      ? localStorage.getItem('browser_fingerprint') 
      : null;
    
    if (storedFingerprint) {
      return storedFingerprint;
    }

    // Generate a stable fingerprint based on browser characteristics
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.platform,
      navigator.cookieEnabled,
      !!window.localStorage,
      !!window.sessionStorage,
      navigator.hardwareConcurrency || 0,
      navigator.deviceMemory || 0
    ];

    // Simple hash function
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    // Generate stable fingerprint WITHOUT Date.now()
    const fingerprint = 'fp_' + Math.abs(hash).toString(16);
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('browser_fingerprint', fingerprint);
    }
    
    return fingerprint;
  } catch (error) {
    console.error('Fingerprinting error:', error);
    // Fallback fingerprint - also try to store it
    const fallbackFingerprint = 'fallback_' + Math.random().toString(36).substring(2, 15);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('browser_fingerprint', fallbackFingerprint);
      } catch (e) {
        // localStorage might be disabled
      }
    }
    return fallbackFingerprint;
  }
};

