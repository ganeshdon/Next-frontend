import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FileText, Settings, LogOut, CreditCard, FileX, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = router.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const formatPagesRemaining = () => {
    if (!user) return '';

    const tier = user.subscription_tier;

    if (tier === 'enterprise') {
      return 'Unlimited';
    }

    if (tier === 'daily_free') {
      return `${user.pages_remaining}/7`;
    }

    // Handle all paid tier names (including Dodo plans: starter, professional, business)
    return `${user.pages_remaining}/${user.pages_limit}`;
  };

  const PublicNav = () => (
    <>
      <Link
        href="/"
        className={`relative px-3 py-2 font-semibold text-sm transition-all duration-200 ${pathname === '/'
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-blue-600'
          }`}
      >
        Home
        {pathname === '/' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
        )}
      </Link>
      <Link
        href="/pricing"
        className={`relative px-3 py-2 font-semibold text-sm transition-all duration-200 ${pathname?.startsWith('/pricing')
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-blue-600'
          }`}
      >
        Pricing
        {pathname?.startsWith('/pricing') && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
        )}
      </Link>
      <a
        href="https://yourbankstatementconverter.com/blog/"
        target="_blank"
        rel="noopener noreferrer"
        className="relative px-3 py-2 font-semibold text-sm transition-all duration-200 text-gray-700 hover:text-blue-600"
      >
        Blogs
      </a>
      <Link
        href="/login"
        className={`relative px-3 py-2 font-semibold text-sm transition-all duration-200 ${pathname === '/login'
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-blue-600'
          }`}
      >
        Login
        {pathname === '/login' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
        )}
      </Link>
      <Link
        href="/signup"
        className={`ml-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg ${pathname === '/signup'
          ? 'bg-blue-700 text-white shadow-blue-500/50'
          : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
      >
        Register
      </Link>
    </>
  );

  const AuthenticatedNav = () => (
    <>
      <Link
        href="/"
        className={`relative px-3 py-2 font-semibold text-sm transition-all duration-200 ${pathname === '/'
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-blue-600'
          }`}
      >
        Home
        {pathname === '/' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
        )}
      </Link>

      <Link
        href="/pricing"
        className={`relative px-3 py-2 font-semibold text-sm transition-all duration-200 ${pathname?.startsWith('/pricing')
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-blue-600'
          }`}
      >
        Pricing
        {pathname?.startsWith('/pricing') && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
        )}
      </Link>

      <a
        href="https://yourbankstatementconverter.com/blog/"
        target="_blank"
        rel="noopener noreferrer"
        className="relative px-3 py-2 font-semibold text-sm transition-all duration-200 text-gray-700 hover:text-blue-600"
      >
        Blogs
      </a>

      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${pathname?.startsWith('/settings')
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          }`}
        onClick={() => router.push('/settings')}
      >
        <CreditCard className="h-4 w-4" />
        <span className="font-semibold text-sm">
          Pages ({formatPagesRemaining()})
        </span>
      </div>

      <Link
        href="/documents"
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${pathname?.startsWith('/documents')
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          }`}
      >
        <FileText className="h-4 w-4" />
        <span>Documents</span>
      </Link>

      <Link
        href="/settings"
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${pathname?.startsWith('/settings')
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
          }`}
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 font-semibold text-sm transition-all duration-200"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign out</span>
      </button>
    </>
  );

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <img
                src="/logo.png"
                alt="Your Bank Statement Converter"
                className="h-12 w-12 object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden sm:block">
                Your Bank Statement Converter
              </span>
              <span className="text-lg font-bold text-gray-900 sm:hidden">
                YBSC
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? <AuthenticatedNav /> : <PublicNav />}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/98 backdrop-blur-md">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={pathname === '/' ? 'text-blue-600' : ''}>Home</span>
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={pathname?.startsWith('/pricing') ? 'text-blue-600' : ''}>Pricing</span>
                </Link>
                <a
                  href="https://yourbankstatementconverter.com/blog/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Blogs</span>
                </a>
                <div
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold cursor-pointer transition-all duration-200"
                  onClick={() => { router.push('/settings'); setMobileMenuOpen(false); }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Pages ({formatPagesRemaining()})</span>
                </div>
                <Link
                  href="/documents"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span className={pathname?.startsWith('/documents') ? 'text-blue-600' : ''}>Documents</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span className={pathname?.startsWith('/settings') ? 'text-blue-600' : ''}>Settings</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 font-semibold transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={pathname === '/' ? 'text-blue-600' : ''}>Home</span>
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={pathname?.startsWith('/pricing') ? 'text-blue-600' : ''}>Pricing</span>
                </Link>
                <a
                  href="https://yourbankstatementconverter.com/blog/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Blogs</span>
                </a>
                <Link
                  href="/login"
                  className="flex items-center px-4 py-3 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 mx-4 mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;