/**
 * Script to download all Figma images and save them locally
 * Run with: node scripts/download-figma-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const images = {
  step1: "https://www.figma.com/api/mcp/asset/c9ff0849-197f-4d34-b6a1-08a1af1439da",
  step2: "https://www.figma.com/api/mcp/asset/3a0502fa-449f-41d9-ae52-3ba105d6e170",
  step3: "https://www.figma.com/api/mcp/asset/b13131f0-1886-4953-a2ab-70da8e0edb6a",
  heroPlaceholder: "https://www.figma.com/api/mcp/asset/a4d6ee12-03bd-4596-80e2-0a2f13f2e099",
  heroPlaceholder1: "https://www.figma.com/api/mcp/asset/834564e8-2ecb-414c-a0b2-7a7666f95d7d",
  heroPlaceholder2: "https://www.figma.com/api/mcp/asset/e85d3efb-e826-4cb6-95ca-33af302126eb",
  videoIcon: "https://www.figma.com/api/mcp/asset/c58b2046-bfe4-4fea-b0f0-9337e35141ec",
  arrowRight: "https://www.figma.com/api/mcp/asset/15eb16f1-811b-45a0-811e-3a3b5e3ede9a",
  logoPart1: "https://www.figma.com/api/mcp/asset/252fd440-9866-4de0-b0f5-fb4bfc49953d",
  logoPart2: "https://www.figma.com/api/mcp/asset/8cf484ed-25e1-40d7-8b54-cbfaf930744a",
  timeSquareIcon: "https://www.figma.com/api/mcp/asset/4cbe7c31-87ae-458d-aaca-4325d965ed8f",
  shieldIcon: "https://www.figma.com/api/mcp/asset/6c488cdb-ed15-4f61-ac76-fb223d2aab11",
  uploadIcon: "https://www.figma.com/api/mcp/asset/e66f16d8-5b9c-4060-87fc-813e3535ed6f",
  soc2Icon: "https://www.figma.com/api/mcp/asset/ab6f7716-bfa3-49b7-8f51-b59a4db29082",
  supportIcon: "https://www.figma.com/api/mcp/asset/d88777d8-f622-4e8c-ac0d-fd4c467ab95d",
  uptimeIcon: "https://www.figma.com/api/mcp/asset/a880a1a2-4820-4983-b9e8-18c34896cde5",
  faqExpand: "https://www.figma.com/api/mcp/asset/d047db62-ab9b-4439-9ef4-2a61614e7eca",
  faqCollapse: "https://www.figma.com/api/mcp/asset/97c8cb2a-b893-4bbb-809d-419dc5aeadf3",
  starIcon: "https://www.figma.com/api/mcp/asset/92b9db91-0128-4c6e-ac54-75750cdbf5e4",
  avatarIcon: "https://www.figma.com/api/mcp/asset/14659660-50f3-4e3a-b00f-9cc65d8cdd9a",
  testimonialDivider: "https://www.figma.com/api/mcp/asset/5f23d44c-146d-49f1-9579-4064e63e4373",
  arrowSmall1: "https://www.figma.com/api/mcp/asset/38c38fb5-e1e8-4514-8544-f33b5c8ff788",
  arrowSmall2: "https://www.figma.com/api/mcp/asset/3c5522da-e0b2-483f-9732-fc91c2ff9622",
  arrowSmall3: "https://www.figma.com/api/mcp/asset/fd330bf2-3128-41e5-a370-33ce282f6267",
  demoVideoIcon: "https://www.figma.com/api/mcp/asset/2487463a-1d1e-4314-a4a2-2cec7abb0fb3",
};

const publicDir = path.join(__dirname, '..', 'public', 'images', 'landing');
const imagesDir = path.join(publicDir);

// Create directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${filename} already exists, skipping...`);
      resolve(filePath);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadImage(response.headers.location, filename)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded ${filename}`);
        resolve(filePath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('Starting image download...\n');
  
  const entries = Object.entries(images);
  const total = entries.length;
  let completed = 0;
  let failed = 0;

  for (const [key, url] of entries) {
    try {
      // Determine file extension (default to png, but could be svg, jpg, etc.)
      const filename = `${key}.png`;
      await downloadImage(url, filename);
      completed++;
    } catch (error) {
      console.error(`✗ Failed to download ${key}:`, error.message);
      failed++;
    }
  }

  console.log(`\nDownload complete!`);
  console.log(`✓ Successfully downloaded: ${completed}/${total}`);
  if (failed > 0) {
    console.log(`✗ Failed: ${failed}/${total}`);
  }
  console.log(`\nImages saved to: ${imagesDir}`);
}

downloadAllImages().catch(console.error);

