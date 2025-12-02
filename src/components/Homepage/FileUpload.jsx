import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Upload, FileText, CheckCircle, Shield } from 'lucide-react';
import Button from '@/components/ui/button';


const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

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

  return (
    <div className="space-y-8" data-testid="file-upload-component">
      {/* Upload Zone - Large Dashed Box */}
      <div
        className={`border-2 border-dashed rounded-xl p-16 text-center transition-all duration-300 bg-gray-50
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

        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Light Blue Circular Icon with Dark Blue Arrow */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl font-bold text-gray-800" data-testid="upload-title">
            Drop Your Bank Statement Here
          </h2>

          {/* Description Text */}
          <p className="text-base text-gray-500 max-w-lg" data-testid="upload-instructions">
            Supports PDF, JPG, PNG, and scanned documents from all banks worldwide
          </p>

          {/* Choose File Button */}
          <Button
            onClick={onButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
            data-testid="browse-button"
          >
            Choose File
          </Button>

          {/* Pages Free Daily Text */}
          <p className="text-sm text-gray-700">
            7 pages free daily.{' '}
            <button
              onClick={() => router.push('/pricing')}
              className="text-blue-600  cursor-pointer hover:text-blue-700 underline"
            >
              View pricing
            </button>
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="flex items-center justify-center space-x-8 pt-4" data-testid="format-info">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700">PDF, JPG, PNG</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">No watermarks</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700">Bank-grade security</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;