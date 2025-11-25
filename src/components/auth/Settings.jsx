import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { User, CreditCard, Bell, Globe, Shield, AlertTriangle, Lock, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/router';
import API from '@/utils/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    language_preference: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [syncingInvoices, setSyncingInvoices] = useState(false);
  const { user, token, refreshUser, logout } = useAuth();
  const router = useRouter();

  const API_URL = API.HOST;

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        language_preference: user.language_preference || 'en'
      });
    }
  }, [user]);

  const formatDate = (iso) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch (e) {
      return iso;
    }
  };

  const computeNextBillingDate = () => {
    if (!user) return null;
    try {
      if (user.subscription_tier === 'daily_free') {
        if (user.daily_reset_time) return formatDate(user.daily_reset_time);
        return 'Every 24 hours';
      }

      if (user.billing_cycle_start) {
        const start = new Date(user.billing_cycle_start);
        // Advance one month forward from start of billing cycle
        const next = new Date(start);
        next.setMonth(next.getMonth() + 1);
        return formatDate(next.toISOString());
      }

      return 'Next billing date unavailable';
    } catch (e) {
      return 'Next billing date unavailable';
    }
  };

  // Fetch invoices when subscription tab is active
  useEffect(() => {
    if (activeTab === 'subscription' && user && token) {
      fetchInvoices();
    }
  }, [activeTab, user, token]);

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const headers = {};
      const opts = { method: 'GET', headers };
      if (token && token !== 'oauth_session') {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        opts.credentials = 'include';
      }

      const response = await fetch(`${API_URL}/api/dodo/invoices`, opts);

      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices || []);
      } else {
        const error = await response.json();
        console.error('Failed to fetch invoices:', error);
        // Don't show error toast, just log it
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Don't show error toast, just log it
    } finally {
      setLoadingInvoices(false);
    }
  };

  const syncInvoices = async () => {
    setSyncingInvoices(true);
    try {
      const headers = {};
      const opts = { method: 'POST', headers };
      if (token && token !== 'oauth_session') {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        opts.credentials = 'include';
      }

      const response = await fetch(`${API_URL}/api/dodo/sync-invoices`, opts);

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || `Synced ${data.synced_count || 0} invoice(s) from Dodo Payments`);
        // Refresh invoices after sync
        await fetchInvoices();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to sync invoices');
      }
    } catch (error) {
      console.error('Error syncing invoices:', error);
      toast.error('Failed to sync invoices');
    } finally {
      setSyncingInvoices(false);
    }
  };

  const formatPlanName = (tier) => {
    const plans = {
      'daily_free': 'Daily Free',
      'basic': 'Basic Plan',
      'premium': 'Premium Plan',
      'platinum': 'Platinum Plan',
      'enterprise': 'Enterprise Plan',
      'starter': 'Starter Plan',
      'professional': 'Professional Plan',
      'business': 'Business Plan'
    };
    return plans[tier] || tier;
  };

  const formatPagesLimit = () => {
    if (!user) return '';

    if (user.subscription_tier === 'enterprise') {
      return 'Unlimited pages';
    }

    if (user.subscription_tier === 'daily_free') {
      return `${user.pages_remaining}/${user.pages_limit} pages today (resets daily)`;
    }

    return `${user.pages_remaining}/${user.pages_limit} pages this month`;
  };

  const formatCurrency = (amount, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  const formatPlanNameFromPackage = (packageId) => {
    if (!packageId) return 'N/A';
    return formatPlanName(packageId);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      const opts = { method: 'PUT', headers, body: JSON.stringify({ full_name: formData.full_name, language_preference: formData.language_preference }) };
      if (token && token !== 'oauth_session') {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        opts.credentials = 'include';
      }
      const response = await fetch(`${API_URL}/api/user/profile`, opts);

      if (response.ok) {
        await refreshUser();
        toast.success('Profile updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'This action cannot be undone. Type "DELETE" to confirm account deletion:'
    );

    if (confirmation !== 'DELETE') {
      return;
    }

    try {
      const headers = {};
      const opts = { method: 'DELETE', headers };
      if (token && token !== 'oauth_session') {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        opts.credentials = 'include';
      }
      const response = await fetch(`${API_URL}/api/user/profile`, opts);

      if (response.ok) {
        toast.success('Account deleted successfully');
        await logout();
        router.push('/login');
      } else {
        toast.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Failed to delete account');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const renderAccountTab = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-sm text-gray-500 mt-1">
            Contact support to change your email address
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );

  const renderSubscriptionTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-blue-900">
                {formatPlanName(user?.subscription_tier)}
              </h4>
              <p className="text-blue-700">{formatPagesLimit()}</p>
            </div>
            {user?.subscription_tier === 'daily_free' && (
              <Button
                onClick={() => router.push('/pricing')}
                className="bg-green-600 hover:bg-green-700"
              >
                Upgrade Plan
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Pages Used</div>
            <div className="text-2xl font-semibold text-gray-900">
              {user?.pages_limit - user?.pages_remaining || 0}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Pages Remaining</div>
            <div className="text-2xl font-semibold text-gray-900">
              {user?.pages_remaining || 0}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Billing Cycle</span>
            <span className="font-medium">
              {user?.subscription_tier === 'daily_free' ? 'Daily Reset' : (user?.billing_interval === 'annual' ? 'Annual' : 'Monthly')}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Next Reset</span>
            <span className="font-medium">
              {computeNextBillingDate()}
            </span>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => router.push('/pricing')}
              variant="outline"
            >
              View All Plans
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
          </div>
          <div className="flex items-center space-x-3">
            {invoices.length > 0 && (
              <span className="text-sm text-gray-500">
                {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'}
              </span>
            )}
            {user?.subscription_tier !== 'daily_free' && (
              <Button
                onClick={syncInvoices}
                disabled={syncingInvoices}
                variant="outline"
                className="text-xs"
                size="sm"
              >
                {syncingInvoices ? 'Syncing...' : 'Sync Invoices'}
              </Button>
            )}
          </div>
        </div>

        {loadingInvoices ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No invoices found</p>
            <p className="text-sm text-gray-500 mb-4">
              {user?.subscription_tier === 'daily_free'
                ? 'Invoices will appear here after you upgrade to a paid plan.'
                : 'Your invoices will appear here after your first payment. If you have made a payment, try syncing invoices.'}
            </p>
            {user?.subscription_tier !== 'daily_free' && (
              <Button
                onClick={syncInvoices}
                disabled={syncingInvoices}
                variant="outline"
                size="sm"
              >
                {syncingInvoices ? 'Syncing...' : 'Sync Invoices from Dodo'}
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr key={`${invoice.invoice_id || invoice.payment_id || 'invoice'}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(invoice.created_at)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div>
                        <div className="font-medium">{formatPlanNameFromPackage(invoice.package_id)}</div>
                        {invoice.billing_interval && (
                          <div className="text-xs text-gray-500 capitalize">{invoice.billing_interval}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === 'succeeded' || invoice.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {invoice.status === 'succeeded' || invoice.status === 'completed' ? 'Paid' : invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 font-mono">
                      {invoice.invoice_id?.substring(0, 20) || 'N/A'}
                      {invoice.invoice_id && invoice.invoice_id.length > 20 && '...'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {invoice.invoice_url || invoice.invoice_pdf_url ? (
                        <a
                          href={invoice.invoice_pdf_url || invoice.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          <Download className="h-3 w-3" />
                          <span>View</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const renderPreferencesTab = () => (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Lock className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium mb-2">This section is currently locked</p>
        <p className="text-sm text-gray-500">Preferences settings will be available soon.</p>
      </div>
    </Card>
  );

  const renderSecurityTab = () => (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Lock className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">Security</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium mb-2">This section is currently locked</p>
        <p className="text-sm text-gray-500">Security settings will be available soon.</p>
      </div>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountTab();
      case 'subscription':
        return renderSubscriptionTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'security':
        return renderSecurityTab();
      default:
        return renderAccountTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isLocked = tab.id === 'preferences' || tab.id === 'security';
                  return (
                    <button
                      key={tab.id}
                      onClick={() => !isLocked && setActiveTab(tab.id)}
                      disabled={isLocked}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${isLocked
                        ? 'text-gray-400 cursor-not-allowed opacity-60'
                        : activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium flex-1">{tab.label}</span>
                      {isLocked && <Lock className="h-4 w-4" />}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;