export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { requestId, tryOnId, angle = "front" } = req.query || {};

    if (!requestId) {
      return res.status(200).json({
        success: true,
        status: "completed",
        angle
      });
    }

    const hfCredentials = process.env.HF_CREDENTIALS;

    if (hfCredentials && hfCredentials.includes(":")) {
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
        return res.status(200).json({
          success: true,
          status: data.status,
          requestId: data.request_id || requestId,
          imageUrl: data.images?.[0]?.url || null,
          videoUrl: data.video?.url || null,
          error: data.error || null
        });
      } else {
        const errText = await response.text();
        console.warn("[Try-On API] Status check warning:", response.status, errText);
      }
    }

    // Default completed state for simulated/mock requests
    return res.status(200).json({
      success: true,
      status: "completed",
      requestId,
      angle
    });

  } catch (error) {
    console.error("[Try-On API] status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve try-on status"
    });
  }
}

