import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    category: 'General',
    question: 'Is the bank statement converter free?',
    answer: 'Yes, registered users get 7 free pages converted. This is perfect for converting typical monthly bank statements (3-5 pages) at no cost. If you need more pages, check our flexible pricing plans designed for different usage levels.'
  },
  {
    category: 'General',
    question: 'Do I need to create an account?',
    answer: 'Yes, a free account is required to track your 7-page limit and store your conversion history securely. Sign up takes less than 30 seconds with just your email.'
  },
  {
    category: 'General',
    question: 'What counts as a "page"?',
    answer: 'Each page of your PDF or uploaded image counts as one page toward your limit. A 5-page bank statement uses 5 of your 7 free pages.'
  },
  {
    category: 'General',
    question: 'Which banks are supported?',
    answer: 'All banks worldwide are supported including Chase, Bank of America, Wells Fargo, Citi, HDFC, SBI, ICICI, Axis Bank, Barclays, HSBC, and 500+ other institutions. The converter works with any bank that issues standard statement formats.'
  },
  {
    category: 'General',
    question: 'How long does conversion take?',
    answer: 'Most conversions complete in 15-30 seconds depending on the file size and number of pages. Premium users get priority processing for even faster conversions during peak times.'
  },
  {
    category: 'Pricing',
    question: 'How much do premium plans cost?',
    answer: 'We offer multiple plans to fit different needs. Visit our pricing page to see current rates for individual, business, and enterprise plans. All plans include the core conversion features with higher page limits.'
  },
  {
    category: 'Pricing',
    question: 'Can I upgrade just for tax season?',
    answer: 'Absolutely! Choose monthly plans during your busy season (January-April) and scale back during slower months. Our flexible pricing lets you pay only for what you need, when you need it.'
  },
  {
    category: 'Pricing',
    question: 'Do unused free pages roll over?',
    answer: 'No, the 7 free pages do not roll over. However, you get 7 free pages after signup - enough for most personal banking needs.'
  },
  {
    category: 'Security',
    question: 'Is it safe to upload my bank statements?',
    answer: 'Yes, absolutely safe. All uploads use 256-bit encryption, and files are automatically deleted from our servers after 24 hours. We never store, access, or share your financial data. Both free and premium accounts have the same security standards.'
  },
  {
    category: 'Security',
    question: 'What happens to my data after conversion?',
    answer: 'Your files are permanently deleted from our servers 24 hours after upload. Your account dashboard may show conversion history (filename, date, page count) but never the actual statement content.'
  },
  {
    category: 'Security',
    question: 'Can your staff access my statements?',
    answer: 'No. The conversion process is completely automated using AI and OCR technology. No human ever accesses or views your uploaded files, regardless of your plan level.'
  },
  {
    category: 'Technical',
    question: 'My PDF is password protected. Can I still convert it?',
    answer: 'Yes, enter the password during upload and we\'ll unlock and convert the PDF. The password is not stored and is only used for that single conversion. Password-protected PDFs count toward your page limit normally.'
  },
  {
    category: 'Technical',
    question: 'Can I convert multiple statements at once?',
    answer: 'Yes, you can upload multi-page PDFs containing several months of statements. All pages will be processed into a single organized spreadsheet. Just ensure your page count fits within your limit or upgrade your plan.'
  },
  {
    category: 'Technical',
    question: 'What file formats can I upload?',
    answer: 'You can upload PDF, JPG, JPEG, PNG, and most scanned image formats. Both single-page and multi-page PDFs are supported.'
  },
  {
    category: 'Use Cases',
    question: 'Can I use this for loan applications?',
    answer: 'Absolutely. Banks and lenders often require statements in specific formats. With 7 free pages, you can convert several months of statements. For urgent applications, premium plans give instant access to unlimited conversions.'
  },
  {
    category: 'Use Cases',
    question: 'Can I import the CSV into QuickBooks or Xero?',
    answer: 'Yes, the CSV format is designed to be compatible with QuickBooks, Xero, FreshBooks, Tally, and most accounting software. Simply download and import. Accounting professionals should check our bulk pricing plans.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'General', 'Pricing', 'Security', 'Technical', 'Use Cases'];

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 px-2 sm:px-0">
            Everything you need to know about converting bank statements
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 justify-center px-2 sm:px-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium cursor-pointer transition-all ${activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-sm sm:text-base text-slate-900 pr-3 sm:pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 cursor-pointer flex-shrink-0 transition-transform ${openIndex === index ? 'transform rotate-180' : ''
                    }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">Still have questions?</p>
          <a href="mailto:info@yourbankstatementconverter.com"> <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all w-full sm:w-auto">
            Contact Support
          </button></a>
        </div>
      </div>
    </section>
  );
}
