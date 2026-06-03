/**
 * Compresses a Base64 image string by drawing it to a Canvas and scaling it down.
 */
export function compressBase64(
  base64Str: string,
  maxWidth = 450,
  maxHeight = 450,
  quality = 0.71
): Promise<string> {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image/') || base64Str.length < 30000) {
      // Extremely lightweight already or not a valid image URI, return as-is
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Guard code in case width or height are zero / invalid
      if (!width || !height) {
        resolve(base64Str);
        return;
      }

      // Calculate scale-down preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      // Fill a white background in case the input is transparent so we get clean JPEG rendering
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);
      
      // JPEG is excellent for high compression ratio
      try {
        let currentQuality = quality;
        let compressed = canvas.toDataURL('image/jpeg', currentQuality);
        
        // Ensure the base64 string is under ~750,000 chars (approx 750KB limit to be safe for Firestore 1MB doc)
        const MAX_BASE64_LENGTH = 750000;
        
        while (compressed.length > MAX_BASE64_LENGTH && currentQuality > 0.1) {
          currentQuality -= 0.1;
          compressed = canvas.toDataURL('image/jpeg', currentQuality);
        }

        // If it's STILL too big, scale down the dimensions and try once more
        if (compressed.length > MAX_BASE64_LENGTH) {
            canvas.width = Math.round(width / 1.5);
            canvas.height = Math.round(height / 1.5);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            compressed = canvas.toDataURL('image/jpeg', 0.5);
        }

        resolve(compressed);
      } catch (e) {
        resolve(base64Str);
      }
    };

    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

/**
 * Reads a browser File object, compresses it to JPEG format under maximum constraints,
 * and returns the compressed Base64 string.
 */
export function compressImageFile(
  file: File,
  maxWidth = 450,
  maxHeight = 450,
  quality = 0.71
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          const compressed = await compressBase64(event.target.result as string, maxWidth, maxHeight, quality);
          resolve(compressed);
        } catch (e) {
          resolve(event.target.result as string);
        }
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
