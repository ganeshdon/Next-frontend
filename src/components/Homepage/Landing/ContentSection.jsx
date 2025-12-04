import { useRouter } from "next/router";
import Link from "next/link";

export default function ContentSection() {
  const router = useRouter()
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">
              What is a Bank Statement Converter?
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
              A bank statement converter is a powerful online tool that transforms your bank statements from PDF, images, or scanned documents into editable formats like Excel (XLSX), CSV, or structured PDFs. Whether you're dealing with statements from Chase, Bank of America, HDFC, SBI, or any other financial institution, this tool extracts transaction data accurately and organizes it into clean, analyzable spreadsheets.
            </p>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-6 sm:mt-8 mb-3 sm:mb-4">
              Why You Need a Bank Statement Converter:
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
              Managing finances becomes significantly easier when your bank statements are in Excel or CSV format. Instead of manually typing hundreds of transactions, a bank statement converter uses advanced OCR (Optical Character Recognition) and AI technology to read your statements and convert them within seconds. This is essential for accountants, small business owners, freelancers, loan applicants, and anyone who needs to analyze their spending patterns or prepare financial reports.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Get started today with <span className="font-semibold text-slate-900">7 free pages daily</span> on yourbankstatementconverter.com - perfect for converting a typical monthly bank statement without any cost.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">
              How Does the Bank Statement Converter Work?
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4 sm:mb-6">
              Converting your bank statement at yourbankstatementconverter.com is incredibly simple:
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  1
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Create Your Free Account</h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    Sign up in seconds to unlock your daily 7 free page conversions. No credit card required for the free tier.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  2
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Upload Your Statement</h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    Drag and drop your bank statement PDF, or upload JPG, PNG, or scanned documents. The converter supports multi-page PDFs and statements from all major banks worldwide.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  3
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Automatic Data Extraction</h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    Our intelligent algorithm identifies transaction dates, descriptions, debits, credits, and balances automatically. The system recognizes various statement formats and adapts to different layouts.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  4
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Download in Your Preferred Format</h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    Get your converted file in Excel (.xlsx), CSV, or formatted PDF within seconds. All transactions are organized in columns: Date, Description, Debit, Credit, and Balance.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-4 sm:mt-6">
              The entire process takes less than 30 seconds, and your data is processed securely with automatic deletion after 24 hours.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-3 sm:mt-4">
              Need More Pages? Check out our flexible <Link href="/pricing" className="text-blue-600 hover:underline font-semibold cursor-pointer">pricing plans</Link> designed for individuals, businesses, and accounting professionals.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">
              Key Features That Make This the Best Bank Statement Converter
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Universal Bank Support</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Works with statements from Chase, Wells Fargo, Citi, Bank of America, Capital One, HDFC Bank, ICICI Bank, SBI, Axis Bank, HSBC, Barclays, and 500+ other financial institutions globally.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Multiple Format Support</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Convert from PDF, JPG, PNG, or scanned images to Excel, CSV, or PDF. Handle password-protected PDFs and multi-page statements effortlessly.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Smart Data Recognition</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Advanced OCR technology accurately identifies transaction details even from poor-quality scans. Automatically categorizes debits, credits, and running balances.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Privacy First</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  All processing happens securely with 256-bit encryption. Your files are automatically deleted from our servers after 24 hours. Complete data privacy guaranteed.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Flexible Plans for Every Need</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Start with 7 free pages daily - ideal for personal use. Need more? Choose from affordable plans on our <Link href="/pricing" className="text-blue-600 hover:underline font-semibold cursor-pointer">pricing plans</Link>  for bulk conversions, priority processing, and business features.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Bulk Processing</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Convert multiple months of statements at once. Premium plans allow you to upload up to 100+ pages and get organized spreadsheets for comprehensive financial analysis.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No Watermarks, Ever</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Whether you're using the free tier or premium plans, all converted files are clean, professional, and watermark-free.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
