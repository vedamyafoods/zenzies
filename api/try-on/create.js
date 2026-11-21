import crypto from "crypto";

/**
 * Builds the exact jewellery preservation prompt specified by Zenzies
 */
function buildJewelleryTryOnPrompt(productName, category = "Earrings", material = "18K Gold Plated", angle = "front") {
  const cat = (category || "").toLowerCase();

  let itemNoun = "earring";
  let itemPlacement = "Place the exact original earring naturally on the person's visible ear. Correctly align the earring with the earlobe and piercing position. Follow gravity and natural hanging direction.";
  let perspectiveFocus = "Direct front-facing portrait showing both ears and the exact jewellery piece prominently and symmetrically visible.";

  if (cat.includes("necklace") || cat.includes("pendant")) {
    itemNoun = "necklace";
    itemPlacement = "Place the exact original necklace resting elegantly around the neck, draped naturally against the collarbone.";
    perspectiveFocus = "Front-facing portrait showing the necklace resting naturally on the collarbone.";
  } else if (cat.includes("ring")) {
    itemNoun = "ring";
    itemPlacement = "Place the exact original ring naturally and comfortably worn on the person's finger.";
    perspectiveFocus = "Natural portrait featuring the hand and finger adorned with the exact ring.";
  } else if (cat.includes("bracelet") || cat.includes("bangle")) {
    itemNoun = "bracelet";
    itemPlacement = "Place the exact original bracelet naturally fitted around the person's wrist.";
    perspectiveFocus = "Natural portrait featuring the wrist adorned with the exact bracelet.";
  } else {
    // Earrings by default
    if (angle === "left") {
      perspectiveFocus = "Gentle three-quarter left angle portrait showcasing the side profile and highlighting the exact earring worn on the left ear.";
    } else if (angle === "right") {
      perspectiveFocus = "Gentle three-quarter right angle portrait showcasing the side profile and highlighting the exact earring worn on the right ear.";
    } else if (angle === "closeup") {
      perspectiveFocus = "Macro close-up beauty portrait focusing directly on the exact earring, fine surface texture, and realistic skin contact.";
    }
  }

  return `# ZENZIES – EXACT JEWELLERY PRESERVATION & VIRTUAL TRY-ON

## ROLE
You are a professional luxury jewellery virtual try-on image editing AI. Your task is to realistically place the EXACT jewellery product from the provided reference image onto the person in the provided customer photograph.

## INPUT IMAGES
- IMAGE 1: Original customer photograph (the person who will wear the jewellery).
- IMAGE 2: Original Zenzies jewellery product photograph (the exact ${itemNoun} that must be worn: ${productName}).

## MOST IMPORTANT RULE: 100% JEWELLERY DESIGN PRESERVATION
The jewellery in IMAGE 2 is a real product and must be treated as a locked, immutable reference.
DO NOT redesign, recreate, reinterpret, simplify, beautify, modify or generate a similar-looking ${itemNoun}.
Preserve the original jewellery with maximum possible visual fidelity.

The following details MUST remain identical to the reference product:
1. Exact original ${itemNoun} silhouette, shape and dimensions.
2. Every individual crystal, diamond, gemstone and stone.
3. Exact number, size, shape and arrangement of all crystals.
4. Original stone colours, transparency, reflections and sparkle.
5. Exact metal colour (${material}), finish, texture and material.
6. Original pearls, beads, chains, hooks and decorative elements.
7. Every tiny connecting component and structural detail.
8. Original symmetry, proportions and overall construction.
9. Original hanging parts, curves, edges and design patterns.

NEVER add, remove, replace, duplicate or rearrange any crystal, stone, pearl or decorative element.

## CUSTOMER PHOTO PRESERVATION
Preserve the customer's original identity and appearance.
- Keep the same face, facial features, skin tone and skin texture.
- Preserve the original hairstyle, hair colour and ear shape.
- Do not change the person's age, expression or facial structure.
- Do not beautify, retouch or regenerate the person's face.
- Keep the original photograph's background, lighting and composition wherever possible.

## REALISTIC JEWELLERY PLACEMENT
${itemPlacement}
- Maintain realistic size and natural proportions.
- Reproduce realistic shadows, reflections and light interaction.
- Ensure the jewellery does not float, penetrate the skin or appear pasted on.
- Preserve realistic contact between the jewellery and skin.
- If hair overlaps the jewellery, maintain natural foreground and background layering.

## IMAGE QUALITY & PERSPECTIVE
Produce a photorealistic luxury jewellery campaign-quality image.
- Perspective: ${perspectiveFocus}
- High-resolution output.
- Natural skin texture.
- Sharp, clearly visible jewellery details.
- Realistic crystal reflections and metallic highlights.
- Professional fashion photography quality.

## STRICT PROHIBITIONS
- No jewellery redesign.
- No invented crystals or gemstones.
- No missing or extra stones.
- No colour changes.
- No altered jewellery geometry.
- No face replacement.
- No artificial-looking skin.
- No additional jewellery.
- No text, logos, watermarks or graphic overlays.
- No collage or multiple views.

## FINAL OUTPUT
Generate ONE single photorealistic image showing the original customer wearing the EXACT Zenzies ${itemNoun} from IMAGE 2.
The final image must look like a real photograph of the customer wearing the actual physical product.

PRIORITY ORDER:
1. Exact jewellery identity and design preservation.
2. Customer identity preservation.
3. Accurate placement.
4. Photorealistic integration.

If perfect jewellery preservation conflicts with visual enhancement, ALWAYS prioritize preserving the original jewellery over visual enhancement.`;
}

/**
 * Ensures an image (product or customer) is hosted on Higgsfield CloudFront CDN
 * to prevent external ingestion failures.
 */
async function ensureHiggsfieldUrl(imageUrl, apiKey, apiSecret) {
  if (!imageUrl) return null;
  if (typeof imageUrl === "string" && imageUrl.includes("cloudfront.net")) {
    return imageUrl;
  }

  try {
    let buf;
    let contentType = "image/jpeg";

    if (imageUrl.startsWith("data:")) {
      const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        contentType = match[1];
        buf = Buffer.from(match[2], "base64");
      } else {
        return imageUrl;
      }
    } else {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) return imageUrl;
      contentType = imgRes.headers.get("content-type") || "image/jpeg";
      buf = Buffer.from(await imgRes.arrayBuffer());
    }

    const upRes = await fetch("https://api.higgsfield.ai/files/generate-upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${apiKey}:${apiSecret}`
      },
      body: JSON.stringify({ content_type: contentType })
    });

    if (!upRes.ok) return imageUrl;
    const upData = await upRes.json();

    const putRes = await fetch(upData.upload_url, {
      method: "PUT",
      headers: upData.upload_headers || {
        "Content-Type": contentType,
        "x-amz-tagging": "retention=temporary"
      },
      body: buf
    });

    if (putRes.ok) {
      return upData.public_url;
    }
  } catch (err) {
    console.warn("[Try-On API] ensureHiggsfieldUrl warning:", err.message);
  }
  return imageUrl;
}

export default async function handler(req, res) {
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
        // fallback
      }
    }

    const {
      productId,
      productName = "Zenzies Fine Jewellery",
      productCategory = "Earrings",
      productPrice,
      productImageUrl,
      customerPhotoUrl,
      userId = "guest",
      material = "18K Gold Plated",
      angle = "front"
    } = body || {};

    const rawProductImage = productImageUrl || "https://res.cloudinary.com/luq2xhci/image/upload/v1794671384/customer_sample_portrait.png";

    if (!customerPhotoUrl) {
      return res.status(400).json({
        success: false,
        message: "Customer photograph is required."
      });
    }

    // Verify Supported Category
    const catLower = (productCategory || "").toLowerCase();
    const isSupported =
      catLower.includes("earring") ||
      catLower.includes("necklace") ||
      catLower.includes("ring") ||
      catLower.includes("bracelet") ||
      catLower.includes("jewellery") ||
      catLower.includes("jewelry");

    const isExcluded =
      catLower.includes("box") ||
      catLower.includes("organizer") ||
      catLower.includes("case") ||
      catLower.includes("pouch");

    if (!isSupported || isExcluded) {
      return res.status(400).json({
        success: false,
        message: `Category "${productCategory}" is not eligible for virtual jewellery placement.`
      });
    }

    const tryOnId = `tryon_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const prompt = buildJewelleryTryOnPrompt(productName, productCategory, material, angle);
    const hfCredentials = process.env.HF_CREDENTIALS;

    // ── LIVE HIGGSFIELD AI GENERATION ────────────────────────────────────
    if (hfCredentials && hfCredentials.includes(":")) {
      const [apiKey, apiSecret] = hfCredentials.split(":");

      // Ensure both images are hosted on Higgsfield CloudFront CDN
      const [validCustomerUrl, validProductUrl] = await Promise.all([
        ensureHiggsfieldUrl(customerPhotoUrl, apiKey, apiSecret),
        ensureHiggsfieldUrl(rawProductImage, apiKey, apiSecret)
      ]);

      const hfResp = await fetch("https://api.higgsfield.ai/marketing-studio/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Key ${apiKey}:${apiSecret}`
        },
        body: JSON.stringify({
          prompt,
          image_urls: [validCustomerUrl, validProductUrl],
          quality: "high",
          resolution: "2k",
          aspect_ratio: "auto",
          enhance_prompt: false,
          moderation: "auto"
        })
      });

      if (hfResp.ok) {
        const hfResult = await hfResp.json();
        const requestId = hfResult.request_id || `hf_${Date.now()}`;
        const initialStatus = hfResult.status || "in_progress";

        return res.status(200).json({
          success: true,
          mode: "live",
          tryOnId,
          requestId,
          status: initialStatus,
          activeAngle: angle,
          prompt,
          customerPhotoUrl: validCustomerUrl,
          product: {
            id: productId,
            name: productName,
            category: productCategory,
            price: productPrice,
            image: validProductUrl
          },
          createdAt: new Date().toISOString()
        });
      } else {
        const errText = await hfResp.text();
        console.error("[Try-On API] Higgsfield error:", hfResp.status, errText);
        return res.status(502).json({
          success: false,
          message: `AI try-on engine returned error (${hfResp.status}). Please try again shortly.`
        });
      }
    }

    // ── FALLBACK FOR LOCAL DEV WITHOUT CREDENTIALS ───────────────────────
    return res.status(200).json({
      success: true,
      mode: "simulation",
      tryOnId,
      status: "completed",
      activeAngle: angle,
      customerPhotoUrl,
      angles: {
        front: { status: "completed", imageUrl: customerPhotoUrl },
        left: { status: "completed", imageUrl: customerPhotoUrl },
        right: { status: "completed", imageUrl: customerPhotoUrl },
        closeup: { status: "completed", imageUrl: customerPhotoUrl }
      },
      product: {
        id: productId,
        name: productName,
        category: productCategory,
        price: productPrice,
        image: rawProductImage
      },
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("[Try-On API] create error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to initialize AI try-on: ${error.message}`
    });
  }
}
