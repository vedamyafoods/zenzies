export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "PUT" && req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { fileId = `file_${Date.now()}` } = req.query || {};
    // Direct upload handler: in serverless/local dev, we can store or return a data URI reference
    let rawBody = req.body;
    let dataUrl = "";

    if (typeof rawBody === "string" && rawBody.startsWith("data:")) {
      dataUrl = rawBody;
    } else if (Buffer.isBuffer(rawBody)) {
      const contentType = req.headers["content-type"] || "image/jpeg";
      dataUrl = `data:${contentType};base64,${rawBody.toString("base64")}`;
    } else {
      // In Vite dev middleware, rawBody might be a string
      const contentType = req.headers["content-type"] || "image/jpeg";
      dataUrl = typeof rawBody === "string" 
        ? (rawBody.startsWith("data:") ? rawBody : `data:${contentType};base64,${Buffer.from(rawBody).toString("base64")}`)
        : "";
    }

    return res.status(200).json({
      success: true,
      publicUrl: dataUrl || `https://res.cloudinary.com/luq2xhci/image/upload/v1794671384/customer_sample_portrait.png`,
      fileId
    });
  } catch (error) {
    console.error("[Try-On API] Direct upload error:", error);
    return res.status(500).json({ success: false, message: "Failed to process photo upload" });
  }
}

