import { Users, FileCheck, Star } from 'lucide-react';

export default function SocialProof() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 text-center text-white">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">10,000+</div>
            <div className="text-blue-100">Trusted Users</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-100">Banks Supported</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">99%</div>
            <div className="text-blue-100">Accuracy Rate</div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl text-white font-semibold mb-2">
            Convert 210 Free Pages Monthly
          </p>
          <p className="text-blue-100">
            Join thousands who trust us with their financial documents
          </p>
        </div>
      </div>
    </section>
  );
}
