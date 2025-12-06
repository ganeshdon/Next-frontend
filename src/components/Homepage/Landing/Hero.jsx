import { Shield, Zap, Trash2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Hero() {
  const router = useRouter();

  const handleStartConverting = () => {
    // Check if we're already on the home page
    if (router.pathname === '/') {
      // Scroll to the converter card
      const element = document.getElementById('converter-card');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to home page with hash
      router.push('/#converter-card').then(() => {
        // Wait for page to load, then scroll
        setTimeout(() => {
          const element = document.getElementById('converter-card');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    }
  };

  // Handle scroll when page loads with hash
  useEffect(() => {
    if (router.asPath.includes('#converter-card')) {
      setTimeout(() => {
        const element = document.getElementById('converter-card');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [router.asPath]);

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-14 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-5 md:mb-6 leading-tight px-2 sm:px-0">
            Convert Your Bank Statements to<br className="hidden sm:block" />
            <span className="text-blue-600">Excel, CSV</span> in Seconds
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-7 md:mb-8 leading-relaxed px-2 sm:px-4 md:px-0">
            Transform bank statements from any format into organized spreadsheets instantly.
            Start with <span className="font-semibold text-slate-900">7 free pages</span>. No credit card required.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-700 text-center sm:text-left">256-bit Encryption</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-700 text-center sm:text-left">Instant Processing</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-700 text-center sm:text-left">Auto-Delete 24hrs</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-700 text-center sm:text-left">All Banks Supported</span>
            </div>
          </div>

          <button
            onClick={handleStartConverting}
            className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
          >
            Start Converting Free →
          </button>
        </div>
      </div>
    </section>
  );
}
