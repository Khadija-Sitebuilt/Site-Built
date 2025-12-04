# Image Assets Setup Guide

## Overview

This project uses local image assets instead of linking directly to Figma URLs. This ensures:
- ✅ Images never expire (Figma URLs expire after 7 days)
- ✅ Better performance and optimization
- ✅ Production-ready setup
- ✅ Full control over assets

## Quick Start

1. **Download all images from Figma:**
   ```bash
   npm run download-images
   ```

2. **Verify images are downloaded:**
   Check that images are in `public/images/landing/` directory

3. **That's it!** The components are already configured to use local images.

## Manual Download (Alternative)

If the script doesn't work, you can manually download images:

1. Open your Figma file
2. For each image/icon:
   - Select the element
   - Right-click → "Copy as PNG" or "Export"
   - Save to `public/images/landing/` with the correct filename

## Image File Structure

```
public/
└── images/
    └── landing/
        ├── step1.png
        ├── step2.png
        ├── step3.png
        ├── heroPlaceholder.png
        ├── videoIcon.png
        ├── arrowRight.png
        ├── logoPart1.png
        ├── logoPart2.png
        └── ... (all other images)
```

## Using Next.js Image Component (Optional Optimization)

For even better performance, you can use Next.js `Image` component:

1. Update components to use `next/image`:
   ```tsx
   import Image from 'next/image';
   
   <Image 
     src={images.step1} 
     alt="Step 1" 
     width={354} 
     height={216}
   />
   ```

2. Benefits:
   - Automatic image optimization
   - Lazy loading
   - Responsive images
   - Better Core Web Vitals scores

## Troubleshooting

### Images not showing?
1. Check that images exist in `public/images/landing/`
2. Verify filenames match exactly (case-sensitive)
3. Clear browser cache
4. Check browser console for 404 errors

### Script fails?
- Make sure you have Node.js installed
- Check your internet connection
- Some images might need to be downloaded manually from Figma

## Temporary Figma URLs (Development Only)

If you need to use Figma URLs temporarily (e.g., during development), you can:
1. Open `components/landing/assets.ts`
2. Comment out the local paths
3. Uncomment the Figma URLs section

**⚠️ Warning:** Figma URLs expire after 7 days. Always download images before deploying to production!

