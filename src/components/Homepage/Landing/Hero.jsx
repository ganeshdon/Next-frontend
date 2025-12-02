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
    <section className="bg-gradient-to-b from-white to-slate-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Convert Your Bank Statements to<br />
            <span className="text-blue-600">Excel, CSV, or PDF</span> in Seconds
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Transform bank statements from any format into organized spreadsheets instantly.
            Start with <span className="font-semibold text-slate-900">7 free pages daily</span>. No credit card required.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">256-bit Encryption</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Instant Processing</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <Trash2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">Auto-Delete 24hrs</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">All Banks Supported</span>
            </div>
          </div>

          <button 
            onClick={handleStartConverting}
            className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Converting Free →
          </button>
        </div>
      </div>
    </section>
  );
}
