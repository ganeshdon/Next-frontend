import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Upload, FileText, CheckCircle, Shield } from 'lucide-react';
import Button from '@/components/ui/button';
import { useAuth } from '@/hooks/AuthContext';


const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  // Check if user has completed their 7 free pages
  const isFreePagesCompleted = isAuthenticated && user?.subscription_tier === 'daily_free' && user?.pages_remaining === 0;

  return (
    <div className="space-y-6 sm:space-y-8" data-testid="file-upload-component">
      {/* Upload Zone - Large Dashed Box */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 sm:p-10 md:p-16 text-center transition-all duration-300 bg-gray-50
          ${dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        data-testid="upload-zone"
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
          data-testid="file-input"
        />

        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-5 md:space-y-6">
          {/* Light Blue Circular Icon with Dark Blue Arrow */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
          </div>

          {/* Main Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 px-2 sm:px-0" data-testid="upload-title">
            Drop Your Bank Statement Here
          </h2>

          {/* Description Text */}
          <p className="text-sm sm:text-base text-gray-500 max-w-lg px-2 sm:px-0" data-testid="upload-instructions">
            Supports PDF, JPG, PNG, and scanned documents from all banks worldwide
          </p>

          {/* Choose File Button */}
          <Button
            onClick={onButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 w-full sm:w-auto"
            data-testid="browse-button"
          >
            Choose File
          </Button>

          {/* Free Conversion Text - Show for unauthenticated users */}
          {!isAuthenticated && (
            <p className="text-xs sm:text-sm text-gray-700 px-2 sm:px-0">
              1 free conversion without signup{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-blue-600 cursor-pointer hover:text-blue-700 underline"
              >
                Sign up for more
              </button>
            </p>
          )}

          {/* Pages Free Text - Only show for authenticated users */}
          {isAuthenticated && (
            <p className="text-xs sm:text-sm text-gray-700 px-2 sm:px-0">
              {isFreePagesCompleted ? (
                <>
                  Free resource completed{' '}
                  <button
                    onClick={() => router.push('/pricing')}
                    className="text-blue-600 cursor-pointer hover:text-blue-700 underline"
                  >
                    Upgrade the plan
                  </button>
                </>
              ) : (
                <>
                  7 pages free{' '}
                  <button
                    onClick={() => router.push('/pricing')}
                    className="text-blue-600 cursor-pointer hover:text-blue-700 underline"
                  >
                    View pricing
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 sm:space-x-0 pt-2 sm:pt-4" data-testid="format-info">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <span className="text-xs sm:text-sm text-gray-700">PDF, JPG, PNG</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          <span className="text-xs sm:text-sm text-gray-700">No watermarks</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <span className="text-xs sm:text-sm text-gray-700">Bank-grade security</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;