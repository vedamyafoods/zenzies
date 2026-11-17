import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import ProductReferenceCard from "./ProductReferenceCard";
import PhotoUploader from "./PhotoUploader";
import PhotoPreview from "./PhotoPreview";
import TryOnConsent from "./TryOnConsent";
import GenerationProgress from "./GenerationProgress";
import PreviewGallery from "./PreviewGallery";
import {
  uploadPhotoSecurely,
  createTryOnSession,
  pollTryOnStatus
} from "../../services/virtualTryOnService";
import { useAuth } from "../useAuth";

/**
 * Master Virtual Try-On Modal Component
 * Orchestrates:
 *  1. Product Reference & Photo Upload
 *  2. AI Synthesis & Stage Progression
 *  3. Multi-Angle Preview Gallery & Add-to-Cart
 */
const VirtualTryOnModal = ({ isOpen, onClose, product }) => {
  const { user } = useAuth();

  // Workflow steps: 'upload' | 'generating' | 'results'
  const [step, setStep] = useState("upload");
  const [customerPhoto, setCustomerPhoto] = useState(null);
  const [progressState, setProgressState] = useState({
    stage: "Preparing jewellery reference...",
    progressPercent: 20
  });
  const [generatedAngles, setGeneratedAngles] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Handle Photo Selected
  const handlePhotoSelected = (photoData) => {
    setCustomerPhoto(photoData);
    setErrorMessage(null);
  };

  // Start AI Generation Workflow
  const handleGeneratePreview = async () => {
    if (!customerPhoto) {
      setErrorMessage("Please upload your photograph first.");
      return;
    }

    setErrorMessage(null);
    setStep("generating");
    setProgressState({
      stage: "Uploading your photo...",
      progressPercent: 25
    });

    try {
      // 1. Upload photo through secure signed endpoint
      const uploadedUrl = await uploadPhotoSecurely(customerPhoto.file, product.id);

      setProgressState({
        stage: "Preparing jewellery reference...",
        progressPercent: 45
      });

      // 2. Create AI Try-on session
      const sessionResult = await createTryOnSession({
        product,
        customerPhotoUrl: uploadedUrl || customerPhoto.dataUrl,
        user,
        angle: "front"
      });

      // 3. Track progress or handle completed results
      if (sessionResult.mode === "simulation" || sessionResult.status === "completed") {
        setProgressState({
          stage: "Finalizing your results...",
          progressPercent: 100
        });
        setTimeout(() => {
          setGeneratedAngles(sessionResult.angles || {});
          setStep("results");
        }, 1200);
      } else {
        // Asynchronous polling
        setProgressState({
          stage: "Creating your virtual preview...",
          progressPercent: 60
        });

        const completedStatus = await pollTryOnStatus(
          sessionResult.requestId,
          sessionResult.tryOnId,
          (progress) => setProgressState(progress)
        );

        setGeneratedAngles(completedStatus.angles || {
          front: { status: "completed", imageUrl: completedStatus.imageUrl }
        });
        setStep("results");
      }

    } catch (err) {
      console.error("[VirtualTryOn] Generation error:", err);
      setErrorMessage(err.message || "Failed to generate preview. Please retry.");
      setStep("upload");
    }
  };

  // Try Another Photo without losing product
  const handleTryAnotherPhoto = () => {
    setCustomerPhoto(null);
    setGeneratedAngles({});
    setErrorMessage(null);
    setStep("upload");
  };

  const categoryName = (product.category || "Jewellery").toLowerCase();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A1412]/75 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ ease: "easeOut", duration: 0.2 }}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl bg-[#FFFFFF] border border-[#E8DDD2] shadow-2xl z-10 p-5 sm:p-7 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-[#E8DDD2]/60">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#956638]">
                <Sparkles size={16} className="text-[#956638]" />
                <span className="font-serif text-lg sm:text-xl font-normal text-[#211A16] tracking-tight">
                  Virtual Try-On
                </span>
              </div>
              <p className="font-body text-xs text-[#7B6D63]">
                See how these {categoryName} look on you using AI.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#F2EBE1] text-[#7B6D63] hover:text-[#211A16] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close virtual try-on modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* STEP 1 & 2: Upload Mode */}
          {step === "upload" && (
            <div className="space-y-4">
              {/* Product Reference */}
              <ProductReferenceCard product={product} />

              {/* Photo Upload Zone / Preview */}
              {!customerPhoto ? (
                <PhotoUploader
                  category={product.category}
                  onPhotoSelected={handlePhotoSelected}
                />
              ) : (
                <PhotoPreview
                  photo={customerPhoto}
                  onReplace={() => setCustomerPhoto(null)}
                  onRemove={() => setCustomerPhoto(null)}
                />
              )}

              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Button: Generate My Preview */}
              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={!customerPhoto}
                className={`w-full h-[52px] px-6 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98] ${
                  customerPhoto
                    ? "bg-[#2C221E] hover:bg-[#1A1412] text-white cursor-pointer hover:shadow-lg"
                    : "bg-[#E8DDD2] text-[#9E9082] cursor-not-allowed"
                }`}
              >
                <Sparkles size={16} className={customerPhoto ? "text-[#E5A83B]" : "text-[#9E9082]"} />
                <span>Generate My Preview</span>
              </button>

              {/* Privacy Consent Guarantee */}
              <TryOnConsent />
            </div>
          )}

          {/* STEP 2: Synthesis Progress */}
          {step === "generating" && (
            <GenerationProgress
              stage={progressState.stage}
              progressPercent={progressState.progressPercent}
              product={product}
              customerPhoto={customerPhoto}
            />
          )}

          {/* STEP 3: Multi-Angle Results */}
          {step === "results" && (
            <PreviewGallery
              product={product}
              customerPhoto={customerPhoto}
              angles={generatedAngles}
              onBack={() => setStep("upload")}
              onTryAnotherPhoto={handleTryAnotherPhoto}
            />
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VirtualTryOnModal;

