import React, { useState, useEffect } from 'react';

const ProcessingState = ({ filename }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Reading PDF');

  const steps = [
    'Reading PDF content',
    'Extracting transaction data',
    'Parsing account information',
    'Organizing data by categories',
    'Generating Excel spreadsheet',
    'Finalizing download'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const currentIndex = steps.indexOf(prev);
        if (currentIndex < steps.length - 1) {
          return steps[currentIndex + 1];
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="text-center py-8 sm:py-10 md:py-12 px-2 sm:px-0" data-testid="processing-state">
      {/* Animated Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-6 sm:mb-7 md:mb-8 relative" data-testid="processing-icon">
        <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-30"></div>
      </div>

      {/* Processing Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 px-2 sm:px-0" data-testid="processing-title">
        Processing Your Bank Statement
      </h2>

      {/* Filename */}
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 md:mb-6 px-2 sm:px-0 truncate max-w-full" data-testid="processing-filename">
        {filename}
      </p>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-4 sm:mb-5 md:mb-6 px-2 sm:px-0" data-testid="progress-container">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
          ></div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-2" data-testid="progress-percentage">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Current Step */}
      <div className="space-y-3 sm:space-y-4" data-testid="current-step-container">
        <div className="flex items-center justify-center space-x-2 px-2 sm:px-0">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-pulse loading-dot"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-pulse loading-dot"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-pulse loading-dot"></div>
          </div>
          <p className="text-sm sm:text-base text-gray-700 font-medium" data-testid="current-step-text">
            {currentStep}...
          </p>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto px-2 sm:px-0" data-testid="processing-note">
          This usually takes a few seconds. Please don't close the browser.
        </p>
      </div>

      {/* Processing Steps Preview */}
      <div className="mt-6 sm:mt-7 md:mt-8 max-w-lg mx-auto px-2 sm:px-0" data-testid="steps-preview">
        <div className="bg-gray-50 rounded-lg p-4 sm:p-5 md:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 text-left" data-testid="steps-title">
            Processing Steps
          </h3>
          <div className="space-y-2.5 sm:space-y-3">
            {steps.map((step, index) => {
              const isActive = step === currentStep;
              const isCompleted = steps.indexOf(currentStep) > index;

              return (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3" data-testid={`step-${index}`}>
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 flex-shrink-0
                    ${isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                    {isCompleted ? (
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs sm:text-sm ${isCompleted || isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingState;