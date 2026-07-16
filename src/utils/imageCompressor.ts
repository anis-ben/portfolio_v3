/**
 * Compresses an image file and converts it to WebP format using the browser Canvas API.
 * 
 * @param file The original image file
 * @param maxDimension The maximum width or height of the compressed image
 * @param quality The compression quality from 0.0 to 1.0 (default is 0.8)
 * @returns A promise that resolves to the compressed WebP File
 */
export async function compressImageToWebP(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    // If not running in browser, return the original file
    if (typeof window === "undefined" || !window.HTMLCanvasElement) {
      resolve(file);
      return;
    }

    // Skip compression if file is not an image
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate responsive dimensions keeping the aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not obtain canvas 2D context"));
          return;
        }

        // Draw and scale down the image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas drawing into a WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas conversion to WebP failed"));
              return;
            }

            // Extract original file name without extension
            const originalName = file.name;
            const dotIndex = originalName.lastIndexOf(".");
            const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;

            const webpFile = new File([blob], `${baseName}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve(webpFile);
          },
          "image/webp",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
