import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import EnterpriseContactModal from '@/components/Homepage/EnterpriseContactModal';
import API from '@/utils/api';

const Pricing = () => {
  const [billingInterval, setBillingInterval] = useState('monthly');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const { user, token, refreshUser, isAuthenticated } = useAuth();
  const router = useRouter();

  // Check for successful payment on page load
  useEffect(() => {
    const paymentSuccess = router.query.payment;

    if (paymentSuccess === 'success' && isAuthenticated && token) {
      // Don't show success message yet - wait for actual verification from subscription check
      // toast.success('Payment successful! Your subscription has been activated.');

      // Get subscription_id from sessionStorage
      const subscriptionId = sessionStorage.getItem('pending_subscription_id');

      // Fetch and save invoice from Dodo API
      if (subscriptionId) {
        const fetchInvoice = async () => {
          try {
            // Wait a bit for token to be available
            await new Promise(resolve => setTimeout(resolve, 2000));

            const backendUrl = API.HOST;
            const headers = { 'Content-Type': 'application/json' };
            const fetchOptions = { method: 'POST', headers };

            // Get token from multiple sources
            const currentToken = token ||
              (typeof window !== 'undefined' ? localStorage.getItem('token') : null) ||
              (typeof window !== 'undefined' ? sessionStorage.getItem('token') : null);

            if (currentToken && currentToken !== 'oauth_session') {
              headers['Authorization'] = `Bearer ${currentToken}`;
            } else {
              fetchOptions.credentials = 'include';
            }

            const invoiceUrl = `${backendUrl}/api/dodo/fetch-and-save-invoice?subscription_id=${subscriptionId}`;
            const invoiceResponse = await fetch(invoiceUrl, fetchOptions);

            if (invoiceResponse.ok) {
              const invoiceResult = await invoiceResponse.json();
              console.log('✅ Invoice fetched and saved:', invoiceResult);
              if (invoiceResult.invoices_saved > 0) {
                toast.success(`Invoice saved successfully!`);
              } else if (invoiceResult.message && invoiceResult.message.includes('already exists')) {
                console.log('ℹ️ Invoice already exists');
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

        // Fetch invoice after a short delay to ensure payment is processed
        setTimeout(() => fetchInvoice(), 2000);
      }

      // Poll for user data updates
      const pollForUpdate = async (attempt = 1, maxAttempts = 10) => {
        try {
          const updatedUser = await refreshUser();
          if (updatedUser) {
            console.log(`User refreshed (attempt ${attempt}):`, updatedUser);
            toast.success(`Your account now has ${updatedUser.pages_remaining} pages remaining!`);

            // If we got updated data, stop polling
            if (attempt < maxAttempts && updatedUser.pages_remaining > 0) {
              // Continue polling a few more times to ensure we have the latest
              if (attempt < 3) {
                setTimeout(() => pollForUpdate(attempt + 1, maxAttempts), 2000);
              }
            }
          }
        } catch (error) {
          console.error('Failed to refresh user:', error);
          if (attempt < maxAttempts) {
            setTimeout(() => pollForUpdate(attempt + 1, maxAttempts), 2000);
          }
        }
      };

      // Start polling
      setTimeout(() => pollForUpdate(), 1000);

      // Clean URL
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [isAuthenticated, router.query.payment, refreshUser, router, token]);

  // Removed old Stripe payment status polling - Dodo handles via webhooks

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 1, annual: 12 },
      pages: 400,
      features: [
        '4 pages / month'
      ],
      buttonText: 'Buy',
      buttonVariant: 'default',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 30, annual: 24 },
      pages: 1000,
      features: [
        '1000 pages / month'
      ],
      buttonText: 'Buy',
      buttonVariant: 'default',
      popular: false
    },
    {
      id: 'business',
      name: 'Business',
      price: { monthly: 50, annual: 40 },
      pages: 4000,
      features: [
        '4000 pages / month'
      ],
      buttonText: 'Buy',
      buttonVariant: 'default',
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 'Need More?', annual: 'Need More?' },
      pages: 'Custom',
      features: [],
      buttonText: 'Contact',
      buttonVariant: 'default',
      popular: false
    }
  ];

  const handlePlanSelect = async (plan) => {
    if (!isAuthenticated) {
      toast.info('Please sign up or login to upgrade your plan');
      router.push('/signup');
      return;
    }

    if (plan.id === 'enterprise') {
      setShowEnterpriseModal(true);
      return;
    }

    setLoadingPlan(plan.id);

    try {
      const backendUrl = API.HOST;

      const headers = { 'Content-Type': 'application/json' };
      const fetchOptions = { method: 'POST', headers, body: JSON.stringify({ package_id: plan.id, billing_interval: billingInterval }) };

      if (token && token !== 'oauth_session') {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        fetchOptions.credentials = 'include';
      }

      const response = await fetch(`${backendUrl}/api/dodo/create-subscription`, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create subscription');
      }

      const data = await response.json();

      // Store subscription_id in sessionStorage for later use
      if (data.session_id) {
        sessionStorage.setItem('pending_subscription_id', data.session_id);
        sessionStorage.setItem('last_payment_time', Date.now().toString());
      }

      // Redirect to Dodo Payments Checkout
      window.location.href = data.checkout_url;

    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to start subscription process');
      setLoadingPlan(null);
    }
  };

  const formatPrice = (plan) => {
    if (typeof plan.price[billingInterval] === 'string') {
      return plan.price[billingInterval];
    }

    return `$${plan.price[billingInterval]}`;
  };

  // Removed unused data arrays

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Payment Status Check */}
        {checkingStatus && (
          <Card className="max-w-md mx-auto p-4 sm:p-5 mb-6 sm:mb-8 bg-blue-50 border-blue-200 shadow-md rounded-xl">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-blue-600" />
              <span className="text-sm sm:text-base text-blue-800 font-semibold">Checking payment status...</span>
            </div>
          </Card>
        )}

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2 sm:px-0">
          {/* <div className="inline-block mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
              Plans
            </span>
          </div> */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Your Bank Statement Converter Pricing
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
            Experience the convenience of having everything you need in one place, enhancing your digital interactions effortlessly.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 mb-8 sm:mb-10 md:mb-12">
          <div className="relative inline-flex items-center bg-white rounded-full p-1 shadow-md border border-gray-200">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`relative px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 ${billingInterval === 'monthly'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
              disabled={checkingStatus}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`relative px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 ${billingInterval === 'annual'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
              disabled={checkingStatus}
            >
              Annually
            </button>
          </div>
          {billingInterval === 'annual' && (
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
              💰 Save 20%
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            // Check if this is the current plan - must match both tier AND billing interval
            const isCurrentPlan = user?.subscription_tier === plan.id &&
              user?.billing_interval === billingInterval;

            // Allow plan selection if user has 0 pages remaining (even if it's current plan)
            const hasNoPages = user?.pages_remaining <= 0;
            const canSelectPlan = !isCurrentPlan || hasNoPages;
            const isPopular = index === 1; // Mark Professional as popular

            // Determine card background and checkmark colors (design only)
            const cardBg = isPopular ? 'bg-purple-50' : 'bg-white';
            const checkmarkColor = isPopular ? 'bg-purple-500' : 'bg-blue-500';

            return (
              <div key={plan.id} className="relative">
                {isPopular && (
                  <div className="absolute -top-2 sm:-top-3 right-2 sm:right-4 z-10">
                    <span className="bg-blue-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                      Popular
                    </span>
                  </div>
                )}
                <Card
                  className={`p-5 sm:p-6 md:p-8 ${cardBg} border-2 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full flex flex-col ${isCurrentPlan && !hasNoPages
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{plan.name}</h3>
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                          {formatPrice(plan)}
                        </span>
                        {typeof plan.price[billingInterval] === 'number' && (
                          <span className="text-sm sm:text-base md:text-lg text-gray-600 ml-1 sm:ml-2">/month</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base mb-6 sm:mb-8 transition-all duration-200 ${!canSelectPlan
                      ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                      : isPopular
                        ? 'bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    disabled={!canSelectPlan || loadingPlan === plan.id || checkingStatus}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2 inline" />
                        Processing...
                      </>
                    ) : isCurrentPlan && !hasNoPages ? 'Current Plan' : plan.buttonText}
                  </Button>

                  {plan.features.length > 0 && (
                    <div className="border-t border-gray-200 pt-4 sm:pt-6">
                      <ul className="space-y-3 sm:space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-xs sm:text-sm text-gray-700">
                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${checkmarkColor} flex items-center justify-center mr-2 sm:mr-3 shrink-0`}>
                              <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                            </div>
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {plan.id === 'enterprise' && (
                    <div className="border-t border-gray-200 pt-4 sm:pt-6">
                      <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-700">
                        <li className="flex items-center">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${checkmarkColor} flex items-center justify-center mr-2 sm:mr-3 shrink-0`}>
                            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                          </div>
                          <span className="font-semibold">Unlimited pages</span>
                        </li>
                        <li className="flex items-center">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${checkmarkColor} flex items-center justify-center mr-2 sm:mr-3 shrink-0`}>
                            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                          </div>
                          <span className="font-semibold">Priority support</span>
                        </li>
                        <li className="flex items-center">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${checkmarkColor} flex items-center justify-center mr-2 sm:mr-3 shrink-0`}>
                            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                          </div>
                          <span className="font-semibold">Custom integrations</span>
                        </li>
                        <li className="flex items-center">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${checkmarkColor} flex items-center justify-center mr-2 sm:mr-3 shrink-0`}>
                            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                          </div>
                          <span className="font-semibold">Dedicated account manager</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enterprise Contact Modal */}
      <EnterpriseContactModal
        isOpen={showEnterpriseModal}
        onClose={() => setShowEnterpriseModal(false)}
      />
    </div>
  );
};

export default Pricing;