const MODE = process.env.NEXT_PUBLIC_API_MODE || 'LIVE'; // LOCAL, LIVE, WIFI

const API = {};

API.MODE = MODE;

// Starting the App
if (MODE === 'LOCAL') API.HOST = 'http://localhost:8001';

if (MODE === 'LIVE') API.HOST = 'https://api.yourbankstatementconverter.com';

// OAuth Configuration
// OAuth Provider URL - This is the OAuth service (auth.emergentagent.com), NOT your site URL
// Default to the standard OAuth provider if not set
API.OAUTH_PROVIDER_URL = process.env.NEXT_PUBLIC_OAUTH_PROVIDER_URL || 'https://auth.emergentagent.com';

// Helper function to get site URL (environment-aware)
// In LOCAL mode: always use window.location.origin (localhost)
// In LIVE mode: use NEXT_PUBLIC_SITE_URL if set, otherwise use window.location.origin
API.getSiteUrl = () => {
  // If running in LOCAL mode, always use the current origin (localhost)
  if (MODE === 'LOCAL') {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:3000'; // fallback for SSR
  }
  
  // In LIVE mode, use NEXT_PUBLIC_SITE_URL if explicitly set
  // Otherwise, use window.location.origin (which will be the production domain)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for production SSR
  return 'https://yourbankstatementconverter.com';
};

// Helper function to get OAuth redirect URL
API.getOAuthUrl = () => {
  const siteUrl = API.getSiteUrl();
  const redirectUrl = `${siteUrl}/`;
  return `${API.OAUTH_PROVIDER_URL}/?redirect=${encodeURIComponent(redirectUrl)}`;
};

export default API;
