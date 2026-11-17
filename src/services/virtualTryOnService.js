/**
 * Virtual Jewellery Try-On Service
 * Communicates with backend endpoints (/api/try-on/* or Firebase Cloud Functions)
 * Enforces zero exposure of API credentials to the browser client.
 */

// Maximum supported photo upload size: 10 MB
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

/**
 * Validates uploaded photo format, size and decodability
 */
export async function validateCustomerPhoto(file) {
  if (!file) {
    return { valid: false, error: "Please select a photograph to upload." };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Unsupported format. Please upload a JPEG, PNG, or WebP photograph."
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Photograph is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`
    };
  }

  // Verify successful image decoding
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth < 200 || img.naturalHeight < 200) {
          resolve({
            valid: false,
            error: "Photo resolution is too low. Please use a clearer photo of at least 200x200px."
          });
        } else {
          resolve({
            valid: true,
            width: img.naturalWidth,
            height: img.naturalHeight,
            dataUrl: e.target.result
          });
        }
      };
      img.onerror = () => {
        resolve({
          valid: false,
          error: "Failed to decode photograph. Please try another image."
        });
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      resolve({ valid: false, error: "Failed to read file from your device." });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Checks whether a product category is supported for virtual try-on
 */
export function isTryOnSupported(category) {
  if (!category || typeof category !== "string") return true;
  const lower = category.toLowerCase();

  // Exclude non-wearables
  if (
    lower.includes("box") ||
    lower.includes("organizer") ||
    lower.includes("storage") ||
    lower.includes("pouch") ||
    lower.includes("cleaner")
  ) {
    return false;
  }

  // Wearables: Earrings, Necklaces, Rings, Bracelets, Curated Sets
  return (
    lower.includes("earring") ||
    lower.includes("necklace") ||
    lower.includes("pendant") ||
    lower.includes("ring") ||
    lower.includes("bracelet") ||
    lower.includes("bangle") ||
    lower.includes("jewel") ||
    lower.includes("set")
  );
}

/**
 * Securely uploads photo through server-signed upload URL
 */
export async function uploadPhotoSecurely(file, productId) {
  try {
    // 1. Get signed upload configuration from backend
    const signResponse = await fetch("/api/try-on/generate-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType: file.type || "image/jpeg",
        fileName: file.name,
        productId
      })
    });

    if (!signResponse.ok) {
      throw new Error("Unable to establish secure upload link.");
    }

    const signData = await signResponse.json();

    // 2. Upload file to signed URL
    if (signData.provider === "higgsfield" && signData.uploadUrl) {
      const uploadResp = await fetch(signData.uploadUrl, {
        method: "PUT",
        headers: signData.headers || { "Content-Type": file.type },
        body: file
      });
      if (!uploadResp.ok) {
        throw new Error("Direct storage upload failed.");
      }
      return signData.publicUrl;
    }

    // Direct upload route fallback
    const directResp = await fetch(signData.uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file
    });
    const directData = await directResp.json();
    return directData.publicUrl;

  } catch (err) {
    console.warn("[TryOnService] Backend upload fallback to base64 data URL:", err.message);
    // Graceful offline/local dev fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Creates AI try-on session
 */
export async function createTryOnSession({
  product,
  customerPhotoUrl,
  user,
  angle = "front"
}) {
  const response = await fetch("/api/try-on/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: product.id,
      productName: product.name,
      productCategory: product.category || "Jewellery",
      productPrice: product.price,
      productImageUrl: product.primaryImage || product.image || product.images?.[0],
      customerPhotoUrl,
      userId: user?.uid || "guest",
      material: product.material || "18K Gold Plated",
      angle
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to start AI generation.");
  }

  return response.json();
}

/**
 * Polls status of an active try-on request with honest stage progression
 */
export async function pollTryOnStatus(requestId, tryOnId, onProgress) {
  const maxPolls = 30; // 60 seconds max
  let pollCount = 0;

  const stages = [
    "Uploading your photo...",
    "Preparing jewellery reference...",
    "Creating your virtual preview...",
    "Generating additional angles...",
    "Finalizing your results..."
  ];

  while (pollCount < maxPolls) {
    const currentStageIndex = Math.min(pollCount, stages.length - 1);
    if (onProgress) {
      onProgress({
        stage: stages[currentStageIndex],
        progressPercent: Math.min(95, 20 + pollCount * 18)
      });
    }

    try {
      const res = await fetch(`/api/try-on/status?requestId=${encodeURIComponent(requestId)}&tryOnId=${encodeURIComponent(tryOnId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === "completed") {
          if (onProgress) onProgress({ stage: "Finalizing your results...", progressPercent: 100 });
          return data;
        } else if (data.status === "failed" || data.status === "nsfw") {
          throw new Error(data.error || "AI generation could not complete for this photo. Please try a different angle.");
        }
      }
    } catch (e) {
      console.warn("[TryOnService] Polling retry:", e.message);
    }

    pollCount++;
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Timeout
  throw new Error("Preview generation timed out. Please retry with a clearer photo.");
}

