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
import Hero from '@/components/Homepage/Landing/Hero';
import ContentSection from '@/components/Homepage/Landing/ContentSection';
import UseCases from '@/components/Homepage/Landing/UseCases';
import SocialProof from '@/components/Homepage/Landing/SocialProof';
import FAQ from '@/components/Homepage/Landing/FAQ';

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

      // Get subscription_id from sessionStorage
      const subscriptionId = sessionStorage.getItem('pending_subscription_id');

      // Show processing message while verifying payment status
      toast.info('Verifying payment status...');

      // Function to check and update subscription status
      const checkSubscription = async () => {
        // Check if we have a token (user might not be fully loaded yet)
        if (!token) {
          // Wait for auth to initialize, then try again
          setTimeout(() => {
            if (token) {
              checkSubscription();
            }
          }, 1000);
          return;
        }

        if (!subscriptionId) {
          // Refresh anyway (only if not already in progress)
          if (refreshUser && !refreshInProgressRef.current) {
            refreshInProgressRef.current = true;
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

          if (response.ok) {
            const result = await response.json();

            if (result.status === 'success') {
              // Clear retry counter on success
              sessionStorage.removeItem('subscription_check_retries');
              toast.success('🎉 Subscription activated! Your credits have been updated.');

              // Fetch and save invoice from Dodo API (with retry logic)
              const fetchInvoiceWithRetry = async (retries = 5) => {
                for (let i = 0; i < retries; i++) {
                  try {
                    // Wait a bit for token to be available
                    if (i > 0) {
                      await new Promise(resolve => setTimeout(resolve, 1000 * i));
                    }

                    // Get current token (check multiple sources)
                    const currentToken = token ||
                      (typeof window !== 'undefined' ? localStorage.getItem('token') : null) ||
                      (typeof window !== 'undefined' ? sessionStorage.getItem('token') : null);

                    if (!currentToken && i < retries - 1) {
                      continue;
                    }

                    const invoiceUrl = `${backendUrl}/api/dodo/fetch-and-save-invoice?subscription_id=${subscriptionId}`;

                    const invoiceHeaders = { 'Content-Type': 'application/json' };
                    const invoiceOptions = { method: 'POST', headers: invoiceHeaders };

                    if (currentToken && currentToken !== 'oauth_session') {
                      invoiceHeaders['Authorization'] = `Bearer ${currentToken}`;
                    } else {
                      invoiceOptions.credentials = 'include';
                    }

                    const invoiceResponse = await fetch(invoiceUrl, invoiceOptions);

                    if (invoiceResponse.ok) {
                      const invoiceResult = await invoiceResponse.json();
                      if (invoiceResult.invoices_saved > 0) {
                        toast.success(`Invoice saved successfully!`);
                      }
                      return; // Success, exit retry loop
                    }
                  } catch (invoiceError) {
                    console.error(`❌ Error fetching invoice (attempt ${i + 1}):`, invoiceError);
                    // Invoice fetch failed, continue without it
                  }
                }
              };

              // Start invoice fetch (will retry if needed)
              fetchInvoiceWithRetry();

              // Clear the pending subscription
              sessionStorage.removeItem('pending_subscription_id');

              // Refresh user data once after successful subscription activation (prevent duplicates)
              if (refreshUser && !refreshInProgressRef.current) {
                refreshInProgressRef.current = true;
                setTimeout(async () => {
                  try {
                    const updatedUser = await refreshUser();
                    if (updatedUser) {
                      toast.success(`Your account now has ${updatedUser.pages_remaining} pages remaining!`);
                    }
                  } catch (error) {
                    // Failed to refresh user
                  } finally {
                    refreshInProgressRef.current = false;
                  }
                }, 1500);
              }
            } else {
              // Check if subscription is in a terminal state (failed, cancelled, etc.)
              const terminalStates = ['failed', 'cancelled', 'expired', 'not_found'];
              if (terminalStates.includes(result.status)) {
                sessionStorage.removeItem('pending_subscription_id');
                sessionStorage.removeItem('last_payment_time');
                if (result.status === 'failed') {
                  toast.error('Payment failed. Please try again or contact support.');
                } else {
                  toast.error(`Subscription ${result.status}. Please try again.`);
                }
                return; // Stop retrying
              }

              toast.info('Processing your subscription... Please refresh in a few seconds.');
            }
          } else {
            await response.text();
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
          checkSubscription();
        }
      }, 3000);

      // Clean URL after a longer delay to ensure refresh completes
      setTimeout(() => {
        router.replace('/', undefined, { shallow: true });
        paymentHandledRef.current = false; // Reset for future payments
      }, 5000);
    }
  }, [router.query.payment, token, isAuthenticated, refreshUser, router]); // Include necessary deps

  // Watch for user changes and update display when user data changes
  useEffect(() => {
    if (user) {
      // User data updated
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

          if (response.ok) {
            const result = await response.json();

            if (result.status === 'success') {

              // Fetch and save invoice from Dodo API (works without token, uses credentials)
              const fetchInvoice = async () => {
                try {
                  const invoiceUrl = `${backendUrl}/api/dodo/fetch-and-save-invoice?subscription_id=${pendingSubscriptionId}`;

                  const invoiceHeaders = { 'Content-Type': 'application/json' };
                  const invoiceOptions = { method: 'POST', headers: invoiceHeaders };

                  // Use same auth method as subscription check
                  if (actualToken && actualToken !== 'oauth_session') {
                    invoiceHeaders['Authorization'] = `Bearer ${actualToken}`;
                  } else {
                    invoiceOptions.credentials = 'include';
                  }

                  const invoiceResponse = await fetch(invoiceUrl, invoiceOptions);

                  if (invoiceResponse.ok) {
                    const invoiceResult = await invoiceResponse.json();
                    if (invoiceResult.invoices_saved > 0) {
                      toast.success(`Invoice saved successfully!`);
                    }
                  } else {
                    const errorText = await invoiceResponse.text();
                    console.warn('⚠️ Could not fetch invoice:', errorText);
                  }
                } catch (invoiceError) {
                  console.error('❌ Error fetching invoice:', invoiceError);
                  // Don't fail the whole flow if invoice fetch fails
                }
              };

              // Fetch invoice immediately (no retry needed, subscription check already worked)
              fetchInvoice();

              sessionStorage.removeItem('pending_subscription_id');
              sessionStorage.removeItem('last_payment_time');
              sessionStorage.removeItem('subscription_check_retries');

              toast.success('🎉 Subscription activated! Your credits have been updated.');

              // Refresh user data once after a short delay (prevent duplicates)
              if (refreshUser && !refreshInProgressRef.current) {
                refreshInProgressRef.current = true;
                setTimeout(async () => {
                  try {
                    const updatedUser = await refreshUser();
                    if (updatedUser) {
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
              // Check if subscription is in a terminal state (failed, cancelled, etc.)
              const terminalStates = ['failed', 'cancelled', 'expired', 'not_found'];
              if (terminalStates.includes(result.status)) {
                sessionStorage.removeItem('pending_subscription_id');
                sessionStorage.removeItem('last_payment_time');
                if (result.status === 'failed') {
                  toast.error('Payment failed. Please try again or contact support.');
                } else {
                  toast.error(`Subscription ${result.status}. Please try again.`);
                }
                return; // Stop retrying
              }

              // Retry after 3 seconds if not yet active (but limit retries)
              const retryCount = parseInt(sessionStorage.getItem('subscription_check_retries') || '0');
              const maxRetries = 20; // Stop after 20 retries (60 seconds)

              if (retryCount >= maxRetries) {
                sessionStorage.removeItem('pending_subscription_id');
                sessionStorage.removeItem('last_payment_time');
                sessionStorage.removeItem('subscription_check_retries');
                toast.error('Subscription check timed out. Please refresh the page.');
                return;
              }

              sessionStorage.setItem('subscription_check_retries', String(retryCount + 1));

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

  // Handle scroll to converter card when page loads with hash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#converter-card') {
      setTimeout(() => {
        const element = document.getElementById('converter-card');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300); // Wait a bit for page to fully render
    }
  }, []);

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

        // Handle insufficient pages error - show toast and reset to upload
        const isInsufficientPages = errorMessage.toLowerCase().includes('insufficient pages') ||
          (errorMessage.toLowerCase().includes('need') && errorMessage.toLowerCase().includes('remaining')) ||
          errorMessage.toLowerCase().includes('pages remaining');

        if (isInsufficientPages) {
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
          <div className="text-center py-8 sm:py-12 px-2 sm:px-0" data-testid="error-state">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2" data-testid="error-title">Processing Failed</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2 sm:px-0" data-testid="error-message">{error}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-center items-center">
              <Button
                onClick={handleReset}
                className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                data-testid="try-again-btn"
              >
                Try Another File
              </Button>
              {error?.includes('Insufficient pages') && (
                <Button
                  onClick={() => router.push('/pricing')}
                  className="bg-green-600 text-white px-5 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base w-full sm:w-auto sm:ml-3"
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
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto">



        <Hero />



        <div className="w-full bg-white py-8 sm:py-10 md:py-12">
          <div className="flex justify-center mb-6 sm:mb-8 px-2 sm:px-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : currentStep === 'processing' || currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium ${currentStep === 'upload' ? 'bg-blue-600' : currentStep === 'processing' || currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'}`}>
                  1
                </div>
                <span className="ml-1 sm:ml-2 font-medium text-xs sm:text-sm">Upload PDF</span>
              </div>
              <div className="w-4 sm:w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${currentStep === 'processing' ? 'text-blue-600' : currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium ${currentStep === 'processing' ? 'bg-blue-600' : currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'}`}>
                  2
                </div>
                <span className="ml-1 sm:ml-2 font-medium text-xs sm:text-sm">Processing</span>
              </div>
              <div className="w-4 sm:w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium ${currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'}`}>
                  3
                </div>
                <span className="ml-1 sm:ml-2 font-medium text-xs sm:text-sm">Download</span>
              </div>
            </div>
          </div>
          <div id="converter-card" className="max-w-3xl mx-auto px-2 sm:px-4">
            <Card className="p-4 sm:p-6 md:p-8">
              {renderCurrentStep()}
            </Card>
          </div>
        </div>

        <ContentSection />
        <UseCases />
        <SocialProof />
        <FAQ />

        <div className="text-center bg-slate-50 py-4 sm:py-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 max-w-xl mx-auto px-2 sm:px-0">
            🔒 Your files are processed securely and never permanently stored
          </p>
        </div>


      </div>
    </div>
  );
};

export default Converter;