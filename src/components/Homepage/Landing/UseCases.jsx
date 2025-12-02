import { Calculator, FileCheck, Briefcase, User, TrendingUp, FileSearch } from 'lucide-react';
import { useRouter } from 'next/router';

export default function UseCases() {
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
  const useCases = [
    {
      icon: Calculator,
      title: 'For Accountants & Bookkeepers',
      description: 'Stop manually entering bank transactions into accounting software. The free tier handles 1-2 client statements daily, while professional plans let you process unlimited clients. Convert statements to CSV and import directly into QuickBooks, Xero, FreshBooks, or Tally. Save 10+ hours per client every month.'
    },
    {
      icon: FileCheck,
      title: 'For Loan Applications',
      description: 'Banks and lenders require statements in specific formats. With 7 free pages daily, you can convert typical mortgage application requirements (3-6 months of statements) over a few days, or upgrade for instant access when time is critical.'
    },
    {
      icon: Briefcase,
      title: 'For Small Business Owners',
      description: 'Reconcile business accounts faster by converting bank statements to Excel. The free daily limit works great for monthly reconciliations, while growing businesses benefit from unlimited plans that handle multiple accounts and locations.'
    },
    {
      icon: User,
      title: 'For Freelancers & Contractors',
      description: 'Track income from multiple clients and manage irregular payment schedules. Convert PayPal, Stripe, or bank statements to CSV for easy expense tracking. The 7 free pages daily covers most freelance needs, with affordable upgrades during tax season.'
    },
    {
      icon: TrendingUp,
      title: 'For Personal Finance Management',
      description: 'Import your spending data into budgeting apps or Excel templates. With 7 free pages daily, you can convert all your monthly statements at no cost. Analyze where your money goes, identify subscription charges, and create monthly budget reports.'
    },
    {
      icon: FileSearch,
      title: 'For Auditors & Tax Professionals',
      description: 'Quickly process client statements for audits, tax returns, or financial reviews during tax season. Free tier perfect for individual returns, professional plans designed for CPA firms handling dozens of clients.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Perfect for Every Financial Need
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From personal budgeting to professional accounting, our converter saves time and eliminates errors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
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
