"use client"

import React, { useState } from 'react';

const ImageMatchPage: React.FC = () => {
  const [leftImage, setLeftImage] = useState<File | null>(null);
  const [rightImage, setRightImage] = useState<File | null>(null);

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

  const handleApiCall = async () => {
    if (leftImage && rightImage) {
      try {
        const formData = new FormData();
        formData.append('leftImage', leftImage);
        formData.append('rightImage', rightImage);

        const response = await fetch('your_api_endpoint', {
          method: 'POST',
          body: formData,
        });

        console.log('API Response:', response);
      } catch (error) {
        console.error('Error calling API:', error);
      }
    } else {
      alert('Please upload both left and right images.');
    }
  };

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <div className="flex flex-col md:flex-row flex-1 mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4 border border-gray-300 rounded-lg">
          <input type="file" accept="image/*" onChange={handleLeftImageChange} className="mb-4 px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer" />
          <div className="w-full h-64 md:h-full flex items-center justify-center border border-gray-300 overflow-auto rounded-lg">
            {leftImage && <img src={URL.createObjectURL(leftImage)} alt="Left Image Preview" className="object-contain max-w-full max-h-full" />}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4 border border-gray-300 rounded-lg">
          <input type="file" accept="image/*" onChange={handleRightImageChange} className="mb-4 px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer" />
          <div className="w-full h-64 md:h-full flex items-center justify-center border border-gray-300 overflow-auto rounded-lg">
            {rightImage && <img src={URL.createObjectURL(rightImage)} alt="Right Image Preview" className="object-contain max-w-full max-h-full" />}
          </div>
        </div>
      </div>
      <div className="text-center">
        <button onClick={handleApiCall} className="px-8 py-4 bg-blue-500 text-white rounded-lg">Match Images</button>
      </div>
    </div>
  );
};

export default ImageMatchPage;
