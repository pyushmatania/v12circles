#!/usr/bin/env node

/**
 * Favicon Conversion Script
 * 
 * This script helps convert the SVG favicon to PNG formats.
 * You'll need to install sharp: npm install sharp
 * 
 * Usage: node scripts/convert-favicon.cjs
 */

const fs = require('fs');
const path = require('path');

console.log('🎬 Circles Favicon Conversion Script');
console.log('=====================================');

const svgPath = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public');

// Check if SVG exists
if (!fs.existsSync(svgPath)) {
  console.error('❌ favicon.svg not found in public directory');
  process.exit(1);
}

console.log('✅ Found favicon.svg');

// Instructions for manual conversion
console.log('\n📋 Manual Conversion Instructions:');
console.log('1. Open favicon.svg in a browser or image editor');
console.log('2. Export as PNG with these sizes:');
console.log('   - 16x16 (favicon-16x16.png)');
console.log('   - 32x32 (favicon-32x32.png)');
console.log('   - 180x180 (apple-touch-icon.png)');
console.log('   - 192x192 (android-chrome-192x192.png)');
console.log('   - 512x512 (android-chrome-512x512.png)');

console.log('\n🌐 Online Conversion Tools:');
console.log('- https://convertio.co/svg-png/');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('- https://www.svgviewer.dev/');

console.log('\n💡 Alternative: Use the SVG favicon directly');
console.log('Modern browsers support SVG favicons natively!');

// Create a simple HTML preview
const previewHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Circles Favicon Preview</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .preview { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .favicon { display: inline-block; margin: 10px; }
        h1 { color: #7c3aed; }
    </style>
</head>
<body>
    <h1>🎬 Circles - Lights, Camera, Ownership!</h1>
    
    <div class="preview">
        <h2>Favicon Preview</h2>
        <div class="favicon">
            <img src="/favicon.svg" alt="Circles Favicon" style="width: 32px; height: 32px;">
            <p>32x32</p>
        </div>
        <div class="favicon">
            <img src="/favicon.svg" alt="Circles Favicon" style="width: 64px; height: 64px;">
            <p>64x64</p>
        </div>
        <div class="favicon">
            <img src="/favicon.svg" alt="Circles Favicon" style="width: 128px; height: 128px;">
            <p>128x128</p>
        </div>
    </div>
    
    <div class="preview">
        <h2>Design Elements</h2>
        <ul>
            <li>🎥 Film strip holes on the sides</li>
            <li>📷 Camera lens in the center</li>
            <li>💡 Camera flash/light accent</li>
            <li>🎨 Purple gradient background</li>
            <li>⭐ Golden accent colors</li>
        </ul>
    </div>
</body>
</html>`;

const previewPath = path.join(__dirname, '../public/favicon-preview.html');
fs.writeFileSync(previewPath, previewHtml);

console.log('\n✅ Created favicon-preview.html');
console.log('🌐 View it at: http://localhost:5174/favicon-preview.html');

console.log('\n🎉 Favicon setup complete!');
console.log('The new favicon features:');
console.log('- Film strip design elements');
console.log('- Camera lens motif');
console.log('- Purple gradient branding');
console.log('- "Lights, Camera, Ownership!" theme'); 