"use client";
import * as React from "react";
import { Button, CircularProgress } from "@mui/material";
import { TrashIcon, UploadIcon } from "lucide-react";
import axios from "axios";

const ImageMatchPage: React.FC = () => {
  const [leftImage, setLeftImage] = React.useState<File | null>(null);
  const [rightImage, setRightImage] = React.useState<File | null>(null);
  const [result, setResult] = React.useState<{
    matchingConfidence: string;
    status: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const leftInputRef = React.useRef<HTMLInputElement | null>(null);
  const rightInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleLeftImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setLeftImage(event.target.files[0]);
    }
  };

  const handleRightImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setRightImage(event.target.files[0]);
    }
  };

  const handleClearLeftImage = () => {
    setLeftImage(null);
    setResult(null);
    if (leftInputRef.current) {
      leftInputRef.current.value = "";
    }
  };

  const handleClearRightImage = () => {
    setRightImage(null);
    setResult(null);
    if (rightInputRef.current) {
      rightInputRef.current.value = "";
    }
  };

  const handleApiCall = async () => {
    if (leftImage && rightImage) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("image1", leftImage); // Use 'image1' as per API expectation
        formData.append("image2", rightImage); // Use 'image2' as per API expectation

        const response = await axios.post(
          "https://demo1.izdox.com/api/transaction/match_signature",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("API Response:", response.data);

        setResult({
          matchingConfidence: response.data.Result["Matching Confidence"],
          status: response.data.Result.status,
        });
      } catch (error) {
        console.error("Error calling API:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please upload both left and right images.");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-auto">
      <div className="bg-[#3f51b5] h-[64px] w-full">
        <div className="text-3xl font-bold text-white mt-4 ml-4">
          AI Platform
        </div>
      </div>
      <div className="pl-44 mt-5 text-2xl text-bold">
        <strong>SIGNATURE MATCHING</strong>
      </div>
      <div className="flex flex-col sm:flex-row flex-1">
        <div className="flex flex-col items-center justify-center sm:w-1/2 p-4 border-b sm:border-b-0">
          <h3 className="text-2xl m-5">Reference Image</h3>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleLeftImageChange}
              style={{ display: "none" }}
              id="left-image-upload"
              ref={leftInputRef}
            />
            <label htmlFor="left-image-upload">
              <Button
                component="span"
                variant="contained"
                startIcon={<UploadIcon />}
                className="px-3 py-2 bg-[#3f51b5] text-white rounded-lg cursor-pointer text-sm"
              >
                Upload
              </Button>
            </label>
            {leftImage && (
              <Button
                onClick={handleClearLeftImage}
                variant="contained"
                startIcon={<TrashIcon />}
                className="px-3 py-2 bg-[#3f51b5] text-white rounded-lg cursor-pointer text-sm"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="w-full border-gray-900 h-full max-w-[50vh] max-h-[25vh] flex items-center justify-center border border-gray-300 overflow-auto rounded-lg bg-white mt-4">
            {leftImage && (
              <img
                src={URL.createObjectURL(leftImage)}
                alt="Left Image Preview"
                className="object-contain w-full h-full"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center sm:w-1/2 p-4">
          <h3 className="text-2xl  m-5">Transaction Image</h3>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleRightImageChange}
              style={{ display: "none" }}
              id="right-image-upload"
              ref={rightInputRef}
            />
            <label htmlFor="right-image-upload">
              <Button
                component="span"
                variant="contained"
                startIcon={<UploadIcon />}
                className="px-3 py-2 bg-[#3f51b5] text-white rounded-lg cursor-pointer text-sm"
              >
                Upload
              </Button>
            </label>
            {rightImage && (
              <Button
                onClick={handleClearRightImage}
                variant="contained"
                startIcon={<TrashIcon />}
                className="px-3 py-2 bg-[#3f51b5] text-white rounded-lg cursor-pointer text-sm"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="w-full border-gray-900 h-full max-w-[50vh] max-h-[25vh] flex items-center justify-center border border-gray-300 overflow-auto rounded-lg bg-white mt-4">
            {rightImage && (
              <img
                src={URL.createObjectURL(rightImage)}
                alt="Right Image Preview"
                className="object-contain w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
      <div className="static pl-44 my-4">
        <Button
          onClick={handleApiCall}
          variant="contained"
          disabled={!leftImage || !rightImage}
          className="px-4 py-3  bg-[#3f51b5]"
        >
          Verify Signature
        </Button>
        {loading && (
          <div className="mt-4">
            <CircularProgress />
          </div>
        )}
      </div>
      <div className="pl-44">
        {result && !loading ? (
          <div className="text-black rounded-lg flex flex-col mb-20">
            <h1 className="text-xl font-bold">
              Matching Confidence:{" "}
              {parseFloat(result.matchingConfidence) >= 80
                ? `Exact Match`
                : parseFloat(result.matchingConfidence) >= 70
                  ? `Partially Matched`
                  : "Not Matched"}
            </h1>
          </div>
        ) : (
          <div className="text-black rounded-lg flex flex-col mb-20">
            <h1 className="text-xl font-bold">Matching Confidence: 0%</h1>
          </div>
        )}
      </div>
      <div className="h-8 p-2 bg-[#d3d3d3] flex justify-end items-center">
        <span className="text-xs text-gray-600">
          Powered by izDOX by bizAmica
        </span>
      </div>
    </div>
  );
};

export default ImageMatchPage;
