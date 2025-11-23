// Browser fingerprinting utility for anonymous user tracking
export const getBrowserFingerprint = async () => {
  try {
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

    return 'fp_' + Math.abs(hash).toString(16) + '_' + Date.now();
  } catch (error) {
    console.error('Fingerprinting error:', error);
    // Fallback fingerprint
    return 'fallback_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
  }
};

