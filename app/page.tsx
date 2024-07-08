"use client";
import axios from 'axios';
import React, { useState, useRef } from 'react';

const ImageMatchPage: React.FC = () => {
  const [leftImage, setLeftImage] = useState<File | null>(null);
  const [rightImage, setRightImage] = useState<File | null>(null);
  const [result, setResult] = useState<{ matchingConfidence: string; status: string } | null>(null);

  const leftImageInputRef = useRef<HTMLInputElement>(null);
  const rightImageInputRef = useRef<HTMLInputElement>(null);

  const handleLeftImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setLeftImage(event.target.files[0]);
    }
  };

  const handleRightImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setRightImage(event.target.files[0]);
    }
  };

  const handleClearLeftImage = () => {
    setLeftImage(null);
    if (leftImageInputRef.current) {
      leftImageInputRef.current.value = '';
    }
  };

  const handleClearRightImage = () => {
    setRightImage(null);
    if (rightImageInputRef.current) {
      rightImageInputRef.current.value = '';
    }
  };

  const handleApiCall = async () => {
    if (leftImage && rightImage) {
      try {
        const formData = new FormData();
        formData.append('image1', leftImage);  // Use 'image1' as per API expectation
        formData.append('image2', rightImage);  // Use 'image2' as per API expectation

        const response = await axios.post('https://demo1.izdox.com/api/transaction/match_signature', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('API Response:', response.data);

        setResult({
          matchingConfidence: response.data.Result["Matching Confidence"],
          status: response.data.Result.status,
        });
      } catch (error) {
        console.error('Error calling API:', error);
      }
    } else {
      alert('Please upload both left and right images.');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-auto">
      <div className="flex flex-col sm:flex-row flex-1">
        <div className="flex flex-col items-center justify-center sm:w-1/2 p-4 border-r border-gray-300">
          <input
            ref={leftImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleLeftImageChange}
            className="mb-4 px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer text-sm sm:text-base"
          />
          <div className="w-full h-full max-h-[40vh] flex items-center justify-center border border-gray-300 overflow-auto rounded-lg">
            {leftImage && (
              <img src={URL.createObjectURL(leftImage)} alt="Left Image Preview" className="object-contain w-full h-full" />
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center sm:w-1/2 p-4">
          <input
            ref={rightImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleRightImageChange}
            className="mb-4 px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer text-sm sm:text-base"
          />
          <div className="w-full h-full max-h-[40vh] flex items-center justify-center border border-gray-300 overflow-auto rounded-lg">
            {rightImage && (
              <img src={URL.createObjectURL(rightImage)} alt="Right Image Preview" className="object-contain w-full h-full" />
            )}
          </div>
        </div>
      </div>
      <div className="p-4 text-center flex flex-col items-center space-y-4">
        {result && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md w-full text-center">
            <h1 className="text-3xl mt-5 ">Matching Confidence: {result.matchingConfidence}</h1>
            <h3 className="text-3xl mt-5 mb-4">Status: {result.status}</h3>
          </div>
        )}
        <div className="flex space-x-4">
          {leftImage && (
            <button onClick={handleClearLeftImage} className="px-4 sm:px-8 py-3 bg-blue-500 text-white rounded-lg">Clear Left Image</button>
          )}
          <button onClick={handleApiCall} className={`px-4 sm:px-8 py-3 bg-blue-500 text-white rounded-lg ${!leftImage || !rightImage ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!leftImage || !rightImage}>Match Images</button>
          {rightImage && (
            <button onClick={handleClearRightImage} className="px-4 sm:px-8 py-3 bg-blue-500 text-white rounded-lg">Clear Right Image</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageMatchPage;
