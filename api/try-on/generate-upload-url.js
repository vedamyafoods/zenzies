import crypto from "crypto";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // use as is
      }
    }

    const { contentType = "image/jpeg", fileName = "customer-photo.jpg", productId } = body || {};

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(contentType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type. Only JPEG, PNG, and WebP are supported."
      });
    }

    const hfCredentials = process.env.HF_CREDENTIALS;

    // If real Higgsfield credentials are configured on the server
    if (hfCredentials && hfCredentials.includes(":")) {
      try {
        const [apiKey, apiSecret] = hfCredentials.split(":");
        const response = await fetch("https://api.higgsfield.ai/files/generate-upload-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Key ${apiKey}:${apiSecret}`
          },
          body: JSON.stringify({ content_type: contentType })
        });

        if (response.ok) {
          const data = await response.json();
          return res.status(200).json({
            success: true,
            provider: "higgsfield",
            uploadUrl: data.upload_url,
            publicUrl: data.public_url,
            headers: data.upload_headers || {
              "Content-Type": contentType,
              "x-amz-tagging": "retention=temporary"
            }
          });
        }
      } catch (hfErr) {
        console.warn("[Try-On API] Higgsfield upload URL error:", hfErr.message);
      }
    }

    // Direct / Local secure upload handler fallback
    const fileId = `tryon_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
    return res.status(200).json({
      success: true,
      provider: "direct",
      uploadUrl: `/api/try-on/direct-upload?fileId=${fileId}`,
      fileId,
      publicUrl: null, // Will be returned upon direct upload completion
      headers: {
        "Content-Type": contentType
      }
    });

  } catch (error) {
    console.error("[Try-On API] generate-upload-url error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error generating upload reference."
    });
  }
}

