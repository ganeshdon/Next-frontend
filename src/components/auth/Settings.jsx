import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/AuthContext';
import  Card  from '@/components/ui/card';
import  Button  from '@/components/ui/button';
import { User, CreditCard, Bell, Globe, Shield, AlertTriangle, Lock } from 'lucide-react';
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

  // Transactions UI removed — no-op effect kept for future billing side-effects
  useEffect(() => { }, [user]);

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
              {user?.subscription_tier === 'daily_free' ? 'Daily Reset' : 'Monthly'}
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
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isLocked
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