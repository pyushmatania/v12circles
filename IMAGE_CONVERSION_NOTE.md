# Image Conversion Note

## Issue
The following HEIC files are not supported in web browsers:
- `ankit.heic`
- `soham.HEIC` 
- `praveen.HEIC`
- `kamlesh.HEIC`

## Current Solution
I've temporarily replaced these with placeholder images from Pexels:
- Ankit Singh: Professional male portrait
- Soham Bardhan: Professional male portrait  
- Praveen Dehury: Professional male portrait
- Kamlesh Biswal: Professional male portrait

## Recommended Solution
To use the actual photos, convert the HEIC files to web-compatible formats:

### Option 1: Online Conversion
1. Use online HEIC to JPG converters like:
   - https://convertio.co/heic-jpg/
   - https://cloudconvert.com/heic-to-jpg
   - https://www.zamzar.com/convert/heic-to-jpg/

### Option 2: Command Line (if you have ImageMagick)
```bash
# Install ImageMagick first, then:
magick convert ankit.heic ankit.jpg
magick convert soham.HEIC soham.jpg
magick convert praveen.HEIC praveen.jpg
magick convert kamlesh.HEIC kamlesh.jpg
```

### Option 3: macOS Preview
1. Open HEIC files in Preview
2. File → Export
3. Choose JPEG format
4. Save with .jpg extension

## After Conversion
Replace the placeholder URLs in `src/components/Community.tsx` with the converted local images:
- `/src/images/ankit.jpg`
- `/src/images/soham.jpg`
- `/src/images/praveen.jpg`
- `/src/images/kamlesh.jpg`

## Merchandise Images
The merchandise images are using external Pexels URLs and should work fine. If any are broken, they can be replaced with similar placeholder images. 