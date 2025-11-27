import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const title = '404 - Page Not Found | Your Bank Statement Converter';
  const description = 'The page you are looking for could not be found.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 GIF */}
          <div className="mb-8">
            <img 
              src="/404.gif" 
              alt="404 Not Found" 
              className="w-full max-w-md mx-auto h-auto"
              onError={(e) => {
                // Fallback if GIF doesn't exist - show a simple 404 text
                e.target.style.display = 'none';
                const fallback = document.getElementById('404-fallback');
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div id="404-fallback" style={{ display: 'none' }}>
              <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Page Not Found
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Home Button */}
          <Link href="/">
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

