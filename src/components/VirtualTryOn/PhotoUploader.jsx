import React, { useRef, useState } from "react";
import { Camera, Upload, AlertCircle, Sparkles } from "lucide-react";
import { validateCustomerPhoto } from "../../services/virtualTryOnService";

/**
 * Step 2 Component: Drag-and-Drop & Camera Photo Uploader
 */
const PhotoUploader = ({ onPhotoSelected, category = "Earrings" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [validating, setValidating] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const catLower = (category || "").toLowerCase();
  const guidanceTips = catLower.includes("earring")
    ? "Front-facing photo • good lighting • hair tucked behind ears"
    : catLower.includes("necklace")
    ? "Front-facing portrait • neck and collarbone visible • good lighting"
    : catLower.includes("ring")
    ? "Clear hand or finger photo • natural lighting • no blur"
    : "Front-facing portrait • natural lighting • face clearly visible";

  const processFile = async (file) => {
    if (!file) return;
    setUploadError(null);
    setValidating(true);

    try {
      const validation = await validateCustomerPhoto(file);
      if (!validation.valid) {
        setUploadError(validation.error);
        return;
      }
      onPhotoSelected({
        file,
        dataUrl: validation.dataUrl,
        width: validation.width,
        height: validation.height
      });
    } catch (err) {
      setUploadError("Unable to process photo. Please try another image.");
    } finally {
      setValidating(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[#956638] text-white text-[11px] font-semibold flex items-center justify-center">
          2
        </span>
        <h3 className="font-body text-sm font-semibold text-[#211A16]">
          Upload your photo
        </h3>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
          isDragging
            ? "border-[#956638] bg-[#F7EFE3] scale-[1.01]"
            : "border-[#D8CBBE] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] hover:border-[#B8926A]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={handleFileInputChange}
        />
        {/* Mobile Camera Dedicated Input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8DDD2] flex items-center justify-center text-[#956638] shadow-2xs">
          <Camera size={22} strokeWidth={1.75} />
        </div>

        <div>
          <p className="font-body text-sm font-semibold text-[#211A16]">
            Upload your photo
          </p>
          <p className="font-body text-xs text-[#7B6D63] mt-0.5">
            or drag & drop here
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="text-[11px] font-medium text-[#956638] bg-white border border-[#E8DDD2] hover:border-[#956638] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Upload size={11} /> Browse File
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            className="text-[11px] font-medium text-[#956638] bg-white border border-[#E8DDD2] hover:border-[#956638] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer sm:hidden"
          >
            <Camera size={11} /> Open Camera
          </button>
        </div>
      </div>

      {/* Helpful Guidance Hint */}
      <p className="text-[11px] text-[#7B6D63] font-body text-center leading-relaxed">
        {guidanceTips}
      </p>

      {/* Error Notice */}
      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-rose-500" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;

