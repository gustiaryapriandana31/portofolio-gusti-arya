/**
 * Compresses an image file in the browser before upload.
 * Resizes the image to a maximum width/height of 800px (retaining aspect ratio)
 * and exports as a JPEG with 0.7 quality.
 *
 * @param {File} file - The original File object from <input type="file">
 * @param {number} maxWidth - Maximum width (default: 800)
 * @param {number} maxHeight - Maximum height (default: 800)
 * @param {number} quality - JPEG compression quality (default: 0.7)
 * @returns {Promise<File>} A promise that resolves to the compressed File object.
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    // Only compress images
    if (!file || !file.type || !file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio-friendly dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            // Create a new File from the blob, appending .jpg if it originally had another type (since it's now a jpeg)
            let newName = file.name;
            const lastDot = newName.lastIndexOf(".");
            if (lastDot !== -1) {
              newName = newName.substring(0, lastDot) + ".jpg";
            } else {
              newName = newName + ".jpg";
            }

            const compressedFile = new File([blob], newName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
