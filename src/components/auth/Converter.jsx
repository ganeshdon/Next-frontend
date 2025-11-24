import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import FileUpload from '@/components/Homepage/FileUpload';
import ProcessingState from '@/components/Homepage/ProcessingState';
import Results from '@/components/Homepage/Results';
import { toast } from 'sonner';
import { AlertTriangle, CreditCard, Gift, UserPlus } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { useRouter } from 'next/router';
import { getBrowserFingerprint } from '@/utils/fingerprint';
import API from '@/utils/api';

const Converter = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [error, setError] = useState(null);
  const [pagesUsed, setPagesUsed] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousData, setAnonymousData] = useState(null);
  const [browserFingerprint, setBrowserFingerprint] = useState(null);
  const paymentHandledRef = useRef(false); // Track if payment success was already handled
  const refreshInProgressRef = useRef(false); // Track if user refresh is in progress to prevent duplicate calls

  const { user, token, refreshUser, checkPages, isAuthenticated } = useAuth();
  const router = useRouter();

  // Check for successful payment on page load
  useEffect(() => {
    const paymentSuccess = router.query.payment;

    if (paymentSuccess === 'success' && !paymentHandledRef.current) {
      paymentHandledRef.current = true; // Mark as handled

      console.log('🔍 Payment success detected');

      // Get subscription_id from sessionStorage
      const subscriptionId = sessionStorage.getItem('pending_subscription_id');
      console.log('📝 Subscription ID from storage:', subscriptionId);
      console.log('🔐 Token available:', !!token);
      console.log('👤 Is authenticated:', isAuthenticated);

      // Show success message
      toast.success('🎉 Payment successful! Activating your subscription...');

      // Function to check and update subscription status
      const checkSubscription = async () => {
        console.log('🚀 Starting subscription check...');

        // Check if we have a token (user might not be fully loaded yet)
        if (!token) {
          console.error('❌ No token available');
          // Wait for auth to initialize, then try again
          setTimeout(() => {
            if (token) {
              console.log('🔄 Token now available, retrying...');
              checkSubscription();
            }
          }, 1000);
          return;
        }

        if (!subscriptionId) {
          console.error('❌ No subscription ID found in storage');
          // Refresh anyway (only if not already in progress)
          if (refreshUser && !refreshInProgressRef.current) {
            refreshInProgressRef.current = true;
            console.log('🔄 Refreshing user data anyway...');
            setTimeout(async () => {
              try {
                await refreshUser();
              } finally {
                refreshInProgressRef.current = false;
              }
            }, 1000);
          }
          return;
        }

        try {
          const backendUrl = API.HOST;
          const url = `${backendUrl}/api/dodo/check-subscription/${subscriptionId}`;

          console.log('📞 Calling:', url);
          console.log('🔑 Using token:', token.substring(0, 20) + '...');

          // Build headers/options depending on token type (JWT vs OAuth session)
          const headers = { 'Content-Type': 'application/json' };
          const fetchOptions = { method: 'POST', headers };

          // Get the actual token (session_token for OAuth, JWT for regular auth)
          const authType = typeof window !== 'undefined' ? localStorage.getItem('auth_type') : null;
          const actualToken = (authType === 'oauth' && token === 'oauth_session') 
            ? (typeof window !== 'undefined' ? localStorage.getItem('oauth_session_token') : null)
            : token;

          // For JWT tokens and OAuth session tokens, send Authorization header
          if (actualToken && actualToken !== 'oauth_session') {
            headers['Authorization'] = `Bearer ${actualToken}`;
          } else {
            // Fallback: ensure cookies are sent for session-based auth
            fetchOptions.credentials = 'include';
          }

          // Call backend to check and update subscription
          const response = await fetch(url, fetchOptions);

          console.log('📡 Response status:', response.status);

          if (response.ok) {
            const result = await response.json();
            console.log('✅ Subscription check result:', result);

            if (result.status === 'success') {
              toast.success('🎉 Subscription activated! Your credits have been updated.');
              // Clear the pending subscription
              sessionStorage.removeItem('pending_subscription_id');
              console.log('🗑️ Cleared pending subscription from storage');

              // Refresh user data once after successful subscription activation (prevent duplicates)
              if (refreshUser && !refreshInProgressRef.current) {
                refreshInProgressRef.current = true;
                setTimeout(async () => {
                  try {
                    const updatedUser = await refreshUser();
                    console.log('✅ User refreshed after subscription activation:', updatedUser);
                    if (updatedUser) {
                      toast.success(`Your account now has ${updatedUser.pages_remaining} pages remaining!`);
                    }
                  } catch (error) {
                    console.error('Failed to refresh user after subscription:', error);
                  } finally {
                    refreshInProgressRef.current = false;
                  }
                }, 1500);
              }
            } else {
              console.warn('⚠️ Subscription not yet active:', result);
              toast.info('Processing your subscription... Please refresh in a few seconds.');
            }
          } else {
            const errorText = await response.text();
            console.error('❌ Subscription check failed:', response.status, errorText);
            toast.error('Could not verify subscription. Please refresh the page.');
          }
        } catch (error) {
          console.error('💥 Error checking subscription:', error);
          toast.error('Error checking subscription status.');
        }
      };

      // Check subscription immediately, then retry if needed
      checkSubscription();

      // Also retry after a delay in case backend is still processing
      setTimeout(() => {
        if (sessionStorage.getItem('pending_subscription_id')) {
          console.log('🔄 Retrying subscription check...');
          checkSubscription();
        }
      }, 3000);

      // Clean URL after a longer delay to ensure refresh completes
      setTimeout(() => {
        console.log('🧹 Cleaning URL');
        router.replace('/', undefined, { shallow: true });
        paymentHandledRef.current = false; // Reset for future payments
      }, 5000);
    }
  }, [router.query.payment, token, isAuthenticated, refreshUser, router]); // Include necessary deps

  // Watch for user changes and update display when user data changes
  useEffect(() => {
    if (user) {
      console.log('👤 User data updated:', {
        pages_remaining: user.pages_remaining,
        pages_limit: user.pages_limit,
        subscription_tier: user.subscription_tier
      });
    }
  }, [user]);

  // Check for pending subscription on every page load (runs automatically when returning from payment)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const pendingSubscriptionId = sessionStorage.getItem('pending_subscription_id');

    if (!pendingSubscriptionId) {
      return;
    }

    // Check if we just came back from payment (check within last 10 minutes)
    const lastPaymentTime = sessionStorage.getItem('last_payment_time');
    const now = Date.now();

    if (lastPaymentTime && (now - parseInt(lastPaymentTime)) > 10 * 60 * 1000) {
      // Payment was too long ago, clear it
      sessionStorage.removeItem('pending_subscription_id');
      sessionStorage.removeItem('last_payment_time');
      return;
    }

    console.log('🔍 Found pending subscription, automatically checking status...');

    // Wait for auth to be ready, then check subscription
    const checkWhenReady = () => {
      if (!isAuthenticated || !token) {
        // Wait for auth to initialize
        setTimeout(checkWhenReady, 500);
        return;
      }

      // Automatically check subscription status
      const checkPendingSubscription = async () => {
        try {
          const backendUrl = API.HOST;
          const url = `${backendUrl}/api/dodo/check-subscription/${pendingSubscriptionId}`;

          console.log('📞 Auto-checking subscription:', url);

          const headers = { 'Content-Type': 'application/json' };
          const fetchOptions = { method: 'POST', headers };

          // Get the actual token (session_token for OAuth, JWT for regular auth)
          const authType = typeof window !== 'undefined' ? localStorage.getItem('auth_type') : null;
          const actualToken = (authType === 'oauth' && token === 'oauth_session') 
            ? (typeof window !== 'undefined' ? localStorage.getItem('oauth_session_token') : null)
            : token;

          if (actualToken && actualToken !== 'oauth_session') {
            headers['Authorization'] = `Bearer ${actualToken}`;
          } else {
            fetchOptions.credentials = 'include';
          }

          const response = await fetch(url, fetchOptions);

          console.log('📡 Subscription check response:', response.status);

          if (response.ok) {
            const result = await response.json();
            console.log('✅ Subscription check result:', result);

            if (result.status === 'success') {
              console.log('✅ Pending subscription activated!');
              sessionStorage.removeItem('pending_subscription_id');
              sessionStorage.removeItem('last_payment_time');

              toast.success('🎉 Subscription activated! Your credits have been updated.');

              // Refresh user data once after a short delay (prevent duplicates)
              if (refreshUser && !refreshInProgressRef.current) {
                refreshInProgressRef.current = true;
                setTimeout(async () => {
                  try {
                    const updatedUser = await refreshUser();
                    if (updatedUser) {
                      console.log('✅ User refreshed:', updatedUser);
                      toast.success(`Your account now has ${updatedUser.pages_remaining} pages remaining!`);
                    }
                  } catch (error) {
                    console.error('Failed to refresh user:', error);
                  } finally {
                    refreshInProgressRef.current = false;
                  }
                }, 1500);
              }
            } else {
              console.log('⚠️ Subscription not yet active, will retry in 3 seconds...');
              // Retry after 3 seconds if not yet active
              setTimeout(() => {
                if (sessionStorage.getItem('pending_subscription_id') === pendingSubscriptionId) {
                  checkPendingSubscription();
                }
              }, 3000);
            }
          } else {
            const errorText = await response.text();
            console.error('❌ Subscription check failed:', response.status, errorText);
          }
        } catch (error) {
          console.error('💥 Error checking pending subscription:', error);
        }
      };

      // Check immediately when auth is ready
      checkPendingSubscription();
    };

    // Start checking when ready
    checkWhenReady();
  }, [isAuthenticated, token, refreshUser]);

  // Initialize browser fingerprint for anonymous users
  useEffect(() => {
    const initFingerprint = async () => {
      try {
        const fingerprint = await getBrowserFingerprint();
        setBrowserFingerprint(fingerprint);

        if (!isAuthenticated) {
          setIsAnonymous(true);
          await checkAnonymousLimit(fingerprint);
        } else {
          // User is authenticated, not anonymous
          setIsAnonymous(false);
        }
      } catch (error) {
        console.error('Fingerprinting failed:', error);
        // getBrowserFingerprint already has fallback, but set a basic one if needed
        const fallbackFingerprint = 'fallback_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
        setBrowserFingerprint(fallbackFingerprint);

        if (!isAuthenticated) {
          setIsAnonymous(true);
          await checkAnonymousLimit(fallbackFingerprint);
        } else {
          setIsAnonymous(false);
        }
      }
    };

    initFingerprint();
  }, [isAuthenticated]);

  // Check anonymous conversion limit
  const checkAnonymousLimit = async (fingerprint) => {
    try {
      const backendUrl = API.HOST;

      const response = await fetch(`${backendUrl}/api/anonymous/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          browser_fingerprint: fingerprint
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnonymousData(data);
      }
    } catch (error) {
      console.error('Error checking anonymous limit:', error);
    }
  };

  const formatPagesDisplay = () => {
    if (isAnonymous) {
      if (anonymousData?.can_convert) {
        return 'You have 1 free conversion available!';
      } else {
        return 'Free conversion used - Sign up for unlimited access';
      }
    }

    if (!user) return '';

    if (user.subscription_tier === 'enterprise') {
      return 'Unlimited pages available';
    }

    if (user.subscription_tier === 'daily_free') {
      return `${user.pages_remaining} of 7 pages remaining today`;
    }

    return `${user.pages_remaining} of ${user.pages_limit} pages remaining this month`;
  };

  const getResetMessage = () => {
    if (isAnonymous) {
      return 'Sign up for unlimited conversions with advanced features';
    }

    if (user?.subscription_tier === 'daily_free') {
      return 'Pages reset every 24 hours';
    }
    return 'Pages reset monthly on your billing date';
  };

  const handleFileUpload = async (file) => {
    try {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be under 10MB.');
        return;
      }

      // Check limits before processing
      if (isAnonymous) {
        if (!anonymousData?.can_convert) {
          toast.error('Free conversion limit reached. Please sign up for unlimited conversions.');
          return;
        }
      } else if (user) {
        // Check authenticated user limits - wrap in additional safety
        try {
          // Use Promise.resolve to ensure checkPages never throws
          const pageCheck = await Promise.resolve(checkPages(1)).catch((err) => {
            console.error('Promise rejection in checkPages:', err);
            return { can_convert: false, error: 'Network error' };
          });

          if (!pageCheck || !pageCheck.can_convert) {
            const errorMsg = pageCheck?.error
              ? `Unable to verify pages: ${pageCheck.error}`
              : 'Insufficient pages remaining. Please upgrade your plan.';
            toast.error(errorMsg);
            return;
          }
        } catch (error) {
          // Handle any unexpected errors gracefully
          console.error('Error checking pages:', error);
          toast.error('Unable to verify your page limit. Please try again.');
          return;
        }
      }

      setUploadedFile(file);
      setCurrentStep('processing');
      processFile(file);
    } catch (error) {
      // Ultimate safety net - catch any unexpected errors
      console.error('Unexpected error in handleFileUpload:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const processFile = async (file) => {
    try {
      console.log('Processing PDF:', file.name, isAnonymous ? '(Anonymous)' : '(Authenticated)');

      const formData = new FormData();
      formData.append('file', file);

      const backendUrl = API.HOST;

      let endpoint = '/api/process-pdf';
      let headers = {};

      if (isAnonymous) {
        endpoint = '/api/anonymous/convert';
        headers['X-Browser-Fingerprint'] = browserFingerprint;
      } else {
        // Get the actual token (session_token for OAuth, JWT for regular auth)
        const authType = typeof window !== 'undefined' ? localStorage.getItem('auth_type') : null;
        const actualToken = (authType === 'oauth' && token === 'oauth_session') 
          ? (typeof window !== 'undefined' ? localStorage.getItem('oauth_session_token') : null)
          : token;

        if (actualToken && actualToken !== 'oauth_session') {
          headers['Authorization'] = `Bearer ${actualToken}`;
        } else {
          throw new Error('Authentication token not found');
        }
      }

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to process PDF' }));
        const errorMessage = errorData.detail || `Failed to process PDF: ${response.status}`;

        console.log('API Error:', errorMessage); // Debug log

        // Handle insufficient pages error - show toast and reset to upload
        const isInsufficientPages = errorMessage.toLowerCase().includes('insufficient pages') ||
          (errorMessage.toLowerCase().includes('need') && errorMessage.toLowerCase().includes('remaining')) ||
          errorMessage.toLowerCase().includes('pages remaining');

        if (isInsufficientPages) {
          console.log('Insufficient pages detected, showing toast');
          toast.error('Insufficient pages remaining. Please upgrade your plan to continue processing.', {
            duration: 5000,
            action: {
              label: 'Upgrade',
              onClick: () => router.push('/pricing')
            }
          });
          setCurrentStep('upload');
          setUploadedFile(null);
          setError(null);
          return;
        }

        // For other errors, throw to be caught by catch block
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('AI Extraction Result:', result);

      if (!result.success || !result.data) {
        throw new Error('Invalid response from AI processing');
      }

      const extractedData = result.data;
      setExtractedData(extractedData);
      setPagesUsed(result.pages_processed || result.pages_used || 1);

      // Generate CSV with AI-extracted data
      const csvContent = generateComprehensiveCSV(extractedData);
      setExcelFile(new Blob([csvContent], { type: 'text/csv' }));

      // Update limits
      if (isAnonymous) {
        setAnonymousData(prev => ({ ...prev, can_convert: false, conversions_used: 1 }));
      } else {
        await refreshUser();
      }

      setCurrentStep('results');

      const message = isAnonymous
        ? 'Free conversion completed! Sign up for unlimited conversions.'
        : `PDF processed successfully! Used ${result.pages_processed || result.pages_used || 1} pages.`;

      toast.success(message);
    } catch (error) {
      console.error('Processing error:', error);
      const errorMessage = error.message || 'Failed to process the bank statement.';

      // Handle insufficient pages in catch block too
      const isInsufficientPages = errorMessage.toLowerCase().includes('insufficient pages') ||
        (errorMessage.toLowerCase().includes('need') && errorMessage.toLowerCase().includes('remaining')) ||
        errorMessage.toLowerCase().includes('pages remaining');

      if (isInsufficientPages) {
        console.log('Insufficient pages detected in catch, showing toast');
        toast.error('Insufficient pages remaining. Please upgrade your plan to continue processing.', {
          duration: 5000,
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/pricing')
          }
        });
        setCurrentStep('upload');
        setUploadedFile(null);
        setError(null);
        return;
      }

      // For other errors, show error state
      setError(errorMessage);
      setCurrentStep('error');
      toast.error(errorMessage);
    }
  };

  const generateComprehensiveCSV = (data) => {
    let csvLines = [];

    const maxTransactions = Math.max(
      data.deposits?.length || 0,
      data.atmWithdrawals?.length || 0,
      data.checksPaid?.length || 0,
      data.visaPurchases?.length || 0
    );

    const headerRow = [
      'Account Summary', 'Value', '',
      'Description', 'Date Credited', 'Amount', '',
      'Description', 'Tran Date', 'Date Paid', 'Amount', '',
      'Date Paid', 'Check Number', 'Amount', 'Reference Number', '',
      'Description', 'Tran Date', 'Date Paid', 'Amount'
    ];
    csvLines.push(headerRow.join(','));

    const subHeaderRow = [
      'Account Number', data.accountInfo?.accountNumber || '', '',
      'DEPOSITS & OTHER CREDITS', '', '', '',
      'ATM WITHDRAWALS & DEBITS', '', '', '', '',
      'CHECKS PAID', '', '', '', '',
      'CARD PURCHASES', '', '', ''
    ];
    csvLines.push(subHeaderRow.join(','));

    let rowData = [
      'Statement Date', data.accountInfo?.statementDate || '', '',
      data.deposits?.[0]?.description || '', data.deposits?.[0]?.dateCredited || '', data.deposits?.[0]?.amount ? `$${data.deposits[0].amount.toFixed(2)}` : '', '',
      data.atmWithdrawals?.[0]?.description || '', data.atmWithdrawals?.[0]?.tranDate || '', data.atmWithdrawals?.[0]?.datePosted || '', data.atmWithdrawals?.[0]?.amount ? `$${Math.abs(data.atmWithdrawals[0].amount).toFixed(2)}` : '', '',
      data.checksPaid?.[0]?.datePaid || '', data.checksPaid?.[0]?.checkNumber || '', data.checksPaid?.[0]?.amount ? `$${data.checksPaid[0].amount.toFixed(2)}` : '', data.checksPaid?.[0]?.referenceNumber || '', '',
      data.visaPurchases?.[0]?.description || '', data.visaPurchases?.[0]?.tranDate || '', data.visaPurchases?.[0]?.datePosted || '', data.visaPurchases?.[0]?.amount ? `$${Math.abs(data.visaPurchases[0].amount).toFixed(2)}` : ''
    ];
    csvLines.push(rowData.join(','));

    rowData = [
      'Beginning Balance', `$${(data.accountInfo?.beginningBalance || 0).toFixed(2)}`, '',
      data.deposits?.[1]?.description || '', data.deposits?.[1]?.dateCredited || '', data.deposits?.[1]?.amount ? `$${data.deposits[1].amount.toFixed(2)}` : '', '',
      data.atmWithdrawals?.[1]?.description || '', data.atmWithdrawals?.[1]?.tranDate || '', data.atmWithdrawals?.[1]?.datePosted || '', data.atmWithdrawals?.[1]?.amount ? `$${Math.abs(data.atmWithdrawals[1].amount).toFixed(2)}` : '', '',
      data.checksPaid?.[1]?.datePaid || '', data.checksPaid?.[1]?.checkNumber || '', data.checksPaid?.[1]?.amount ? `$${data.checksPaid[1].amount.toFixed(2)}` : '', data.checksPaid?.[1]?.referenceNumber || '', '',
      data.visaPurchases?.[1]?.description || '', data.visaPurchases?.[1]?.tranDate || '', data.visaPurchases?.[1]?.datePosted || '', data.visaPurchases?.[1]?.amount ? `$${Math.abs(data.visaPurchases[1].amount).toFixed(2)}` : ''
    ];
    csvLines.push(rowData.join(','));

    rowData = [
      'Ending Balance', `$${(data.accountInfo?.endingBalance || 0).toFixed(2)}`, '',
      data.deposits?.[2]?.description || '', data.deposits?.[2]?.dateCredited || '', data.deposits?.[2]?.amount ? `$${data.deposits[2].amount.toFixed(2)}` : '', '',
      data.atmWithdrawals?.[2]?.description || '', data.atmWithdrawals?.[2]?.tranDate || '', data.atmWithdrawals?.[2]?.datePosted || '', data.atmWithdrawals?.[2]?.amount ? `$${Math.abs(data.atmWithdrawals[2].amount).toFixed(2)}` : '', '',
      data.checksPaid?.[2]?.datePaid || '', data.checksPaid?.[2]?.checkNumber || '', data.checksPaid?.[2]?.amount ? `$${data.checksPaid[2].amount.toFixed(2)}` : '', data.checksPaid?.[2]?.referenceNumber || '', '',
      data.visaPurchases?.[2]?.description || '', data.visaPurchases?.[2]?.tranDate || '', data.visaPurchases?.[2]?.datePosted || '', data.visaPurchases?.[2]?.amount ? `$${Math.abs(data.visaPurchases[2].amount).toFixed(2)}` : ''
    ];
    csvLines.push(rowData.join(','));

    for (let i = 3; i < maxTransactions; i++) {
      rowData = [
        '', '', '',
        data.deposits?.[i]?.description || '', data.deposits?.[i]?.dateCredited || '', data.deposits?.[i]?.amount ? `$${data.deposits[i].amount.toFixed(2)}` : '', '',
        data.atmWithdrawals?.[i]?.description || '', data.atmWithdrawals?.[i]?.tranDate || '', data.atmWithdrawals?.[i]?.datePosted || '', data.atmWithdrawals?.[i]?.amount ? `$${Math.abs(data.atmWithdrawals[i].amount).toFixed(2)}` : '', '',
        data.checksPaid?.[i]?.datePaid || '', data.checksPaid?.[i]?.checkNumber || '', data.checksPaid?.[i]?.amount ? `$${data.checksPaid[i].amount.toFixed(2)}` : '', data.checksPaid?.[i]?.referenceNumber || '', '',
        data.visaPurchases?.[i]?.description || '', data.visaPurchases?.[i]?.tranDate || '', data.visaPurchases?.[i]?.datePosted || '', data.visaPurchases?.[i]?.amount ? `$${Math.abs(data.visaPurchases[i].amount).toFixed(2)}` : ''
      ];
      csvLines.push(rowData.join(','));
    }

    return csvLines.join('\n');
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setExtractedData(null);
    setExcelFile(null);
    setError(null);
    setPagesUsed(0);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return <FileUpload onFileUpload={handleFileUpload} />;
      case 'processing':
        return <ProcessingState filename={uploadedFile?.name} />;
      case 'results':
        return (
          <Results
            extractedData={extractedData}
            excelFile={excelFile}
            filename={uploadedFile?.name}
            onReset={handleReset}
            pagesUsed={pagesUsed}
            isAnonymous={isAnonymous}
          />
        );
      case 'error':
        return (
          <div className="text-center py-12" data-testid="error-state">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid="error-title">Processing Failed</h3>
            <p className="text-gray-600 mb-6" data-testid="error-message">{error}</p>
            <div className="space-y-2">
              <Button
                onClick={handleReset}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                data-testid="try-again-btn"
              >
                Try Another File
              </Button>
              {error?.includes('Insufficient pages') && (
                <Button
                  onClick={() => router.push('/pricing')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors ml-3"
                >
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Show loading for authenticated users while user data loads
  if (!isAnonymous && !user && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with user info */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Bank Statement Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Convert your PDF bank statements into organized spreadsheets
          </p>

          {/* Usage Status */}
          <Card className="max-w-xl mx-auto p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isAnonymous ? (
                  <Gift className="h-5 w-5 text-green-600" />
                ) : (
                  <CreditCard className="h-5 w-5 text-blue-600" />
                )}
                <span className="font-medium text-gray-900">{formatPagesDisplay()}</span>
              </div>

              {isAnonymous ? (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => router.push('/signup')}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Sign Up Free
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  {user?.pages_remaining <= 2 && user?.subscription_tier === 'daily_free' && (
                    <Button
                      onClick={() => router.push('/pricing')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Upgrade
                    </Button>
                  )}
                  {/* <Button
                    onClick={async () => {
                      if (refreshUser) {
                        toast.info('Refreshing your account...');
                        const updatedUser = await refreshUser();
                        if (updatedUser) {
                          toast.success(`You have ${updatedUser.pages_remaining} pages remaining.`);
                        }
                      }
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    title="Refresh credits"
                  >
                    Professional
                  </Button> */}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">{getResetMessage()}</p>

            {isAnonymous && !anonymousData?.can_convert && (
              <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Free conversion used. Sign up to get 7 more conversions daily!
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Process Steps Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : currentStep === 'processing' || currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep === 'upload' ? 'bg-blue-600' : currentStep === 'processing' || currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Upload PDF</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === 'processing' ? 'text-blue-600' : currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep === 'processing' ? 'bg-blue-600' : currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Processing</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Download</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white rounded-2xl shadow-xl p-8">
            {renderCurrentStep()}
          </Card>
        </div>

        {/* Privacy Notice */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            🔒 Your files are processed securely and never permanently stored
          </p>
        </div>
      </div>
    </div>
  );
};

export default Converter;