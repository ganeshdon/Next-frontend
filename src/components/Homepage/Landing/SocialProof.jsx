import { Users, FileCheck, Star } from 'lucide-react';

export default function SocialProof() {
  return (
    <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center text-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-2">10,000+</div>
            <div className="text-sm sm:text-base text-blue-100">Trusted Users</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <FileCheck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-2">500+</div>
            <div className="text-sm sm:text-base text-blue-100">Banks Supported</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Star className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-2">99%</div>
            <div className="text-sm sm:text-base text-blue-100">Accuracy Rate</div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 text-center px-2 sm:px-0">
          <p className="text-lg sm:text-xl text-white font-semibold mb-2">
            Convert 210 Free Pages Monthly
          </p>
          <p className="text-sm sm:text-base text-blue-100">
            Join thousands who trust us with their financial documents
          </p>
        </div>
      </div>
    </section>
  );
}
