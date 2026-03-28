#!/usr/bin/env node

/**
 * tag-images.js
 * 
 * Reads heroImages from src/data/images.json, sends each image URL to
 * Claude's vision API to generate a description and tags, then writes
 * the updated JSON back to disk.
 * 
 * Usage:
 *   node scripts/tag-images.js
 * 
 * Requires ANTHROPIC_API_KEY environment variable (or reads from .env).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ── Configuration ──────────────────────────────────────────────────────────────
const IMAGES_JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'images.json');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';
const API_VERSION = '2023-06-01';

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY environment variable is required.');
  console.error('   Set it before running:  $env:ANTHROPIC_API_KEY="sk-ant-..."');
  process.exit(1);
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * For Cloudinary URLs, inject a transformation to resize the image so the
 * base64 payload stays under Claude's 5 MB limit.  We target ~1500px on the
 * longest side with quality 80 — that keeps virtually every photo under 1 MB.
 */
function getResizedUrl(url) {
  // Cloudinary pattern: .../upload/v12345/file.jpg
  // Insert transformation right after "/upload/"
  const cloudinaryUploadRe = /(\/upload\/)(v\d+\/)/;
  if (cloudinaryUploadRe.test(url)) {
    return url.replace(cloudinaryUploadRe, '$1c_limit,w_1500,h_1500,q_80/$2');
  }
  return url; // non-Cloudinary URL — use as-is
}

/** Fetch an image URL and return its base64 content + media type */
function fetchImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    const get = url.startsWith('https') ? https.get : require('http').get;
    get(url, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchImageAsBase64(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} fetching ${url}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || 'image/jpeg';
        // Map content type to supported Anthropic media types
        let mediaType = contentType.split(';')[0].trim();
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mediaType)) {
          mediaType = 'image/jpeg'; // default fallback
        }
        resolve({ base64: buffer.toString('base64'), mediaType });
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

/** Call Claude API with a vision prompt for a single image */
function callClaudeVision(base64, mediaType) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `You are writing metadata for a professional photography portfolio website.

TONE RULES — read these first:
- Short, direct sentences. Present tense. Specific detail.
- Dry wit is welcome. One raised eyebrow, not a joke. Never explain the punchline.
- No poetic or flowery language. No passive voice.
- Never use: beautiful, stunning, majestic, breathtaking, amazing, captivating.

OUTPUT — return ONLY a valid JSON object with exactly these four fields:
{
  "title": "3-4 word title. Dry and specific. Not dramatic.",
  "description": "[Mood in 4–6 words]. [One sentence: what is happening + optional dry punchline.]",
  "tags": ["array of exactly 5–7 lowercase strings"],
  "alt": "One plain sentence describing what is visually in the image for screen readers."
}

TAG RULES — tags describe what is IN the image, never the writing style:
- 1 tag for subject (what is in the frame)
- 1 tag for genre (wildlife / landscape / portrait / travel / architecture / street / night photography)
- 1 tag for photographic style (long exposure / bokeh / black and white / backlit / candid / studio)
- 1 tag for place (specific location or region)
- 1 tag for mood/light (golden hour / overcast / blue hour / dusk / midday / dramatic / misty)
- Up to 2 additional tags if genuinely useful for filtering

EXAMPLE — use this as the exact tone and format reference:
Image: Two sea lions hauled out on a harbour dock, one resting its head on the other.
{
  "title": "Pier Nap",
  "description": "Midday sun, salt air, zero ambition. A pair of sea lions doing what sea lions do best — absolutely nothing, with total commitment.",
  "tags": ["sea lion", "wildlife", "candid", "pacific coast", "midday"],
   "alt": "Two California sea lions resting on a sun-warmed harbour dock, one lying with its head on the other."
}

Return ONLY the JSON object. No markdown fences, no extra text, no explanation.`
            }
          ]
        }
      ]
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': API_VERSION,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString();
        try {
          const response = JSON.parse(raw);
          if (response.error) {
            return reject(new Error(`Claude API error: ${response.error.message}`));
          }
          // Extract text content from response
          const text = response.content
            ?.filter((c) => c.type === 'text')
            .map((c) => c.text)
            .join('');
          // Strip potential markdown fences
          const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          const parsed = JSON.parse(cleaned);
          resolve(parsed);
        } catch (err) {
          reject(new Error(`Failed to parse Claude response: ${err.message}\nRaw: ${raw.slice(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/** Small delay between API calls to avoid rate-limiting */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📖 Reading images.json …');
  const raw = fs.readFileSync(IMAGES_JSON_PATH, 'utf-8');
  const imagesData = JSON.parse(raw);

  const images = imagesData.albums[0].images; // process images in the first album
  if (!images || images.length === 0) {
    console.error('❌ No images found in the first album of images.json');
    process.exit(1);
  }

  console.log(`🖼️  Found ${images.length} images. Processing…\n`);
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    console.log(`[${i + 1}/${images.length}] Analyzing: ${img.alt || img.url.split('/').pop()}`);
    try {
      // 1. Fetch the image (resized via Cloudinary transform to stay under 5 MB)
      const resizedUrl = getResizedUrl(img.url);
      console.log('   ↳ Fetching image…');
      const { base64, mediaType } = await fetchImageAsBase64(resizedUrl);
      console.log(`   ↳ Fetched (${(base64.length / 1024).toFixed(0)} KB base64, ${mediaType})`);

      // 2. Send to Claude
      console.log('   ↳ Calling Claude vision API…');
      const result = await callClaudeVision(base64, mediaType);

      // 3. Update the image entry
      img.description = result.description || img.description;
      img.tags = result.tags || [];
      img.alt = result.alt || img.alt;
      img.title = result.title || img.title;

      console.log(`   ✅ Description: ${img.description}`);
      console.log(`   ✅ Tags: ${img.tags.join(', ')}`);
      console.log(`   ✅ Alt: ${img.alt}`);
      console.log(`   ✅ Title: ${img.title}\n`);
    } catch (err) {
      console.error(`   ❌ Error processing image ${i + 1}: ${err.message}\n`);
      // Keep existing data on failure
    }

    // Rate-limit: wait 1s between calls
    if (i < images.length - 1) {
      await sleep(1000);
    }
  }

  // Write back
  console.log('💾 Writing updated images.json …');
  fs.writeFileSync(IMAGES_JSON_PATH, JSON.stringify(imagesData, null, 2) + '\n', 'utf-8');
  console.log('✅ Done! Images have been tagged and described.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
