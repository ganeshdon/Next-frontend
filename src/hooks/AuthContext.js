import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

  // Initialize auth state on mount (client-side only)
  useEffect(() => {
    const initAuth = async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      // Check for OAuth session_id in URL fragment first
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const sessionId = params.get('session_id');
      
      if (sessionId) {
        setLoading(true);
        try {
          // Process OAuth session
          const response = await fetch(`${API_URL}/api/auth/oauth/session-data`, {
            headers: {
              'X-Session-ID': sessionId
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const { session_token, ...userData } = data;
            
            // Store session_token in localStorage for OAuth users
            if (session_token) {
              localStorage.setItem('oauth_session_token', session_token);
              localStorage.setItem('auth_type', 'oauth');
            }
            
            setUser(userData);
            setToken(session_token || 'oauth_session');
            
            // Clean up URL fragment
            window.history.replaceState({}, document.title, window.location.pathname);
            
            setLoading(false);
            return;
          } else {
            console.error('OAuth session processing failed');
          }
        } catch (error) {
          console.error('OAuth session error:', error);
        }
        
        // Clean up URL fragment even on error
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      // Check for existing OAuth session token
      const savedOAuthToken = localStorage.getItem('oauth_session_token');
      const authType = localStorage.getItem('auth_type');
      
      if (savedOAuthToken && authType === 'oauth') {
        try {
          // Verify OAuth session is still valid by fetching user profile
          const response = await fetch(`${API_URL}/api/user/profile`, {
            headers: {
              'Authorization': `Bearer ${savedOAuthToken}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(savedOAuthToken);
            setLoading(false);
            return;
          } else {
            // Session expired or invalid, clear it
            localStorage.removeItem('oauth_session_token');
            localStorage.removeItem('auth_type');
          }
        } catch (error) {
          console.error('OAuth session verification error:', error);
          localStorage.removeItem('oauth_session_token');
          localStorage.removeItem('auth_type');
        }
      }
      
      // Check for existing JWT token (only if not OAuth)
      if (!savedOAuthToken || authType !== 'oauth') {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
          try {
            const response = await fetch(`${API_URL}/api/user/profile`, {
              headers: {
                'Authorization': `Bearer ${savedToken}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              setToken(savedToken);
            } else {
              // Token is invalid, remove it
              localStorage.removeItem('auth_token');
              setToken(null);
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
            localStorage.removeItem('auth_token');
            setToken(null);
          }
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, [API_URL]);

  const login = async (email, password) => {
    // Wrap everything in try-catch to ensure no errors are thrown
    try {
      // Check if API_URL is defined
      if (!API_URL) {
        return { 
          success: false, 
          error: 'Server configuration error. Please contact support.' 
        };
      }

      let response;
      try {
        response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
      } catch (fetchError) {
        // Network/CORS error during fetch
        console.error('Fetch error:', fetchError);
        let errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        
        if (fetchError.message && (fetchError.message.includes('CORS') || fetchError.message.includes('Access-Control'))) {
          errorMessage = 'Server configuration error. Please contact support.';
        } else if (fetchError.message && fetchError.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        }
        
        return { success: false, error: errorMessage };
      }

      // Handle response
      if (!response.ok) {
        let errorMessage = 'Invalid email or password';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || 'Invalid email or password';
        } catch (parseError) {
          // If JSON parsing fails, use status text or default message
          if (response.status === 401) {
            errorMessage = 'Invalid email or password';
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = response.statusText || 'Login failed. Please try again.';
          }
        }
        // Return error instead of throwing to prevent runtime errors
        return { success: false, error: errorMessage };
      }

      // Parse successful response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return { 
          success: false, 
          error: 'Invalid response from server. Please try again.' 
        };
      }

      const { access_token, user: userData } = data;
      
      // Validate response data
      if (!access_token || !userData) {
        return { 
          success: false, 
          error: 'Invalid response from server. Please try again.' 
        };
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('auth_type', 'jwt');
        // Clear OAuth tokens if any
        localStorage.removeItem('oauth_session_token');
      }
      setToken(access_token);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      // Ultimate catch-all - should never reach here, but just in case
      console.error('Unexpected login error:', error);
      
      // Handle different types of errors
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error instanceof TypeError) {
        // Network/CORS errors
        if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
          if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
            errorMessage = 'Server configuration error. Please contact support.';
          } else {
            errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
          }
        } else {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      } else if (error && error.message) {
        // Other errors - make them user-friendly
        if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
          errorMessage = 'Server configuration error. Please contact support.';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = 'An error occurred. Please try again.';
        }
      }
      
      // Return error instead of throwing to prevent runtime errors
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (full_name, email, password, confirm_password) => {
    try {
      // Check if API_URL is defined
      if (!API_URL) {
        return { 
          success: false, 
          error: 'Server configuration error. Please contact support.' 
        };
      }

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          full_name, 
          email, 
          password, 
          confirm_password 
        })
      });

      if (!response.ok) {
        let errorMessage = 'Signup failed';
        try {
          const error = await response.json();
          errorMessage = error.detail || error.message || 'Signup failed';
        } catch (parseError) {
          // If JSON parsing fails, use status text or default message
          errorMessage = response.statusText || 'Signup failed';
        }
        // Return error instead of throwing to prevent runtime errors
        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      const { access_token, user: userData } = data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('auth_type', 'jwt');
        // Clear OAuth tokens if any
        localStorage.removeItem('oauth_session_token');
      }
      setToken(access_token);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle network errors specifically
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message) {
        // Use the error message if available, but make it user-friendly
        if (error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Return error instead of throwing to prevent runtime errors
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    // Save auth info before clearing localStorage
    const authType = typeof window !== 'undefined' ? localStorage.getItem('auth_type') : null;
    const oauthToken = typeof window !== 'undefined' ? localStorage.getItem('oauth_session_token') : null;
    const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const currentToken = token;

    // Always clear local storage and state first
    // This ensures logout works even if the backend is unreachable
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('oauth_session_token');
      localStorage.removeItem('auth_type');
    }
    setToken(null);
    setUser(null);

    // Try to notify backend, but don't fail if it doesn't work
    // Use saved values since we already cleared localStorage
    try {
      if (authType === 'oauth' && oauthToken) {
        // OAuth session logout - try to call API but don't wait for it
        // Note: We use Authorization header, so credentials: 'include' is not needed
        // and would cause CORS issues if backend uses wildcard CORS
        fetch(`${API_URL}/api/auth/oauth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${oauthToken}`
          }
        }).catch(err => {
          // Silently handle errors - logout already succeeded locally
          // Only log if it's not a CORS/network error
          if (!err.message || (!err.message.includes('fetch') && !err.message.includes('CORS'))) {
            console.warn('OAuth logout API call failed (this is okay):', err);
          }
        });
      } else if (jwtToken || (currentToken && currentToken !== 'oauth_session')) {
        // JWT token logout - try to call API but don't wait for it
        const tokenToUse = jwtToken || currentToken;
        fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenToUse}`
          }
        }).catch(err => {
          console.warn('JWT logout API call failed (this is okay):', err);
        });
      }
    } catch (error) {
      // Silently handle any errors - logout should always succeed locally
      console.warn('Logout API call error (local logout still succeeded):', error);
    }
  };

  const refreshUser = React.useCallback(async () => {
    if (!token) return;
    
    try {
      const opts = { headers: {} };
      const authType = localStorage.getItem('auth_type');
      
      // Use session_token for OAuth, JWT token for regular auth
      if (token && authType === 'oauth') {
        opts.headers['Authorization'] = `Bearer ${token}`;
      } else if (token && token !== 'oauth_session') {
        opts.headers['Authorization'] = `Bearer ${token}`;
      } else {
        opts.credentials = 'include';
      }

      const response = await fetch(`${API_URL}/api/user/profile`, opts);

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('User refresh error:', error);
    }
  }, [token, API_URL]);

  const checkPages = React.useCallback(async (pageCount) => {
    if (!token) return null;
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      const authType = localStorage.getItem('auth_type');
      
      // Use session_token for OAuth, JWT token for regular auth
      const opts = { method: 'POST', headers };
      if (authType === 'oauth' && token && token !== 'oauth_session') {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (token && token !== 'oauth_session') {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        opts.credentials = 'include';
      }
      
      const response = await fetch(`${API_URL}/api/user/pages/check`, {
        ...opts,
        body: JSON.stringify({ page_count: pageCount })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Pages check error:', error);
    }
    return null;
  }, [token, API_URL]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    refreshUser,
    checkPages
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};