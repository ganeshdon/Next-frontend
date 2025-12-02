import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/AuthContext';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Eye, EyeOff, Loader2, Check, Mail, Lock, User, UserPlus, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import API from '@/utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!acceptTerms) {
      toast.error('You must accept the terms and privacy policy');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await signup(
        formData.full_name,
        formData.email,
        formData.password,
        formData.confirm_password
      );

      if (result.success) {
        toast.success(`Welcome to Your Bank Statement Converter, ${result.user.full_name}!`);
        router.replace('/');
      } else {
        toast.error(result.error || 'Signup failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-300" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse-slow animation-delay-4000"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-shape"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          >
            <div className={`w-3 h-3 ${i % 3 === 0 ? 'bg-emerald-400/40' : i % 3 === 1 ? 'bg-teal-400/40' : 'bg-green-400/40'} rounded-full`}></div>
          </div>
        ))}
      </div>

      <div className="max-w-5xl w-full relative z-10 animate-slide-up">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Decorative Panel */}
          <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyMCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-xl transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                <Rocket className="w-16 h-16 text-white animate-bounce-slow" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Start Your Journey</h3>
              <p className="text-emerald-100 text-lg mb-8">Join thousands of users converting bank statements effortlessly</p>
              <div className="space-y-4 text-left">
                <div className="flex items-center text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Fast & Secure Processing</span>
                </div>
                <div className="flex items-center text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Multiple Format Support</span>
                </div>
                <div className="flex items-center text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>Free to Get Started</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/30 relative overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full"></div>

            {/* Header Section */}
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg mb-6 transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-600">Start converting bank statements for free</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-bold text-gray-700 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:shadow-lg disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 ml-1">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:shadow-lg disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                    placeholder="name@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:shadow-lg disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-all duration-200 hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex space-x-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${i < getPasswordStrength()
                            ? strengthColors[getPasswordStrength() - 1]
                            : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-gray-600">
                      Password strength: <span className={`${getPasswordStrength() <= 2 ? 'text-red-500' :
                        getPasswordStrength() === 3 ? 'text-yellow-500' :
                          getPasswordStrength() === 4 ? 'text-emerald-500' : 'text-green-500'
                        }`}>
                        {formData.password.length > 0 ? strengthLabels[getPasswordStrength() - 1] || 'Very Weak' : ''}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirm_password" className="block text-sm font-bold text-gray-700 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:shadow-lg disabled:bg-gray-50 disabled:cursor-not-allowed bg-white"
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-all duration-200 hover:scale-110"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {formData.confirm_password && formData.password && (
                  <div className="mt-2 flex items-center space-x-2">
                    {formData.password === formData.confirm_password ? (
                      <>
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-red-600">Passwords do not match</span>
                    )}
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="accept-terms"
                    name="accept-terms"
                    type="checkbox"
                    className="w-5 h-5 text-emerald-600 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed transition-all"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={loading}
                  />
                </div>
                <label htmlFor="accept-terms" className="ml-3 block text-sm font-semibold text-gray-700 cursor-pointer select-none">
                  I accept the{' '}
                  <Link href="/terms" className="font-bold text-emerald-600 hover:text-teal-600 transition-all duration-200 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-bold text-emerald-600 hover:text-teal-600 transition-all duration-200 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white py-4 px-4 rounded-xl font-bold text-base shadow-2xl hover:shadow-emerald-500/50 transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 w-5 h-5" />
                      <span>Launch Your Account</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-8 mb-6 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-semibold">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Google OAuth Button */}
            <div className="mb-6 relative z-10">
              <Button
                type="button"
                onClick={() => window.location.href = API.getOAuthUrl()}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 px-4 rounded-xl font-bold text-base transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-emerald-300 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
                disabled={loading}
              >
                <svg className="mr-3 h-6 w-6 transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-6 border-t-2 border-gray-100 relative z-10">
              <p className="text-sm text-gray-600 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-emerald-600 hover:text-teal-600 transition-all duration-200 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        @keyframes float-shape {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-30px) translateX(20px) rotate(90deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-60px) translateX(-20px) rotate(180deg);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-30px) translateX(10px) rotate(270deg);
            opacity: 0.6;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }
        .animate-float-shape {
          animation: float-shape linear infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Signup;