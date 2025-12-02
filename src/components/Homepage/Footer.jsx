'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Linkedin, Mail, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Company Info Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <img
                    src="/logo.png"
                    alt="Your Bank Statement Converter"
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Your Bank Statement Converter
                </span>
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-md">
                Convert your PDF bank statements into organized spreadsheets with AI-powered
                processing. Fast, secure, and accurate conversion for individuals and businesses.
              </p>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-400 mr-2">Follow us:</span>
                <div className="flex items-center space-x-3">
                  <a
                    href="https://www.linkedin.com/company/your-bank-statement-converter/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61582147329394"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </a>
                  <a
                    href="mailto:info@yourbankstatementconverter.com"
                    className="group relative p-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links Section */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-blue-600">
                Quick Links
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                    Pricing
                  </Link>
                </li>
                <li>
                  <a
                    href="https://yourbankstatementconverter.com/blog/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-blue-600">
                Legal
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookie-policy"
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-500 transition-colors"></span>
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Legal Links */}
        <div className="border-t border-gray-800/50 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm font-medium">
              © {new Date().getFullYear()} Your Bank Statement Converter. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/terms-conditions"
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
              >
                Terms & Conditions
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/cookie-policy"
                className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;