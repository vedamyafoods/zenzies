import "dotenv/config";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let query = req.query;
    if (!query || Object.keys(query).length === 0) {
      try {
        const parsedUrl = new URL(req.url, "http://localhost");
        query = Object.fromEntries(parsedUrl.searchParams.entries());
      } catch (e) {
        query = {};
      }
    }

    const { requestId, tryOnId, angle = "front" } = query || {};

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Missing requestId parameter."
      });
    }

    const hfCredentials = process.env.HF_CREDENTIALS;

    if (!hfCredentials || !hfCredentials.includes(":")) {
      return res.status(500).json({
        success: false,
        message: "Virtual try-on requires HF_CREDENTIALS to be configured in your environment or Vercel dashboard."
      });
    }

    const [apiKey, apiSecret] = hfCredentials.split(":");
    const response = await fetch(`https://api.higgsfield.ai/requests/${requestId}/status`, {
      method: "GET",
      headers: {
        "Authorization": `Key ${apiKey}:${apiSecret}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      // data has: status ('queued' | 'in_progress' | 'completed' | 'failed' | 'nsfw'), images: [{ url }]
      const generatedImage = data.images?.[0]?.url || null;

      if (data.status === "completed" && !generatedImage) {
        return res.status(200).json({
          success: false,
          status: "failed",
          requestId: data.request_id || requestId,
          error: "AI completed processing but did not return a preview image."
        });
      }

      return res.status(200).json({
        success: data.status !== "failed" && data.status !== "nsfw",
        status: data.status,
        requestId: data.request_id || requestId,
        imageUrl: generatedImage,
        angles: {
          [angle]: {
            status: data.status,
            imageUrl: generatedImage
          },
          front: {
            status: data.status,
            imageUrl: generatedImage
          }
        },
        videoUrl: data.video?.url || null,
        error: data.error || (data.status === "failed" ? "AI image placement could not complete for this photo." : null)
      });
    } else {
      const errText = await response.text();
      console.warn("[Try-On API] Status check warning:", response.status, errText);
      return res.status(response.status).json({
        success: false,
        message: `Status check error: ${errText}`
      });
    }

  } catch (error) {
    console.error("[Try-On API] status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve try-on status"
    });
  }
}
