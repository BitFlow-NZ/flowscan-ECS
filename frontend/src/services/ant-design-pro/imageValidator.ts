

export type ValidationResult = {
  valid: boolean;
  message?: string;
};

const MAX_FILE_SIZE_MB = 5; 
const MIN_RESOLUTION = 300; 
const MAX_RESOLUTION = 2000; 
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']; 


export const validateImage = (file: File): Promise<ValidationResult> => {
  return new Promise((resolve) => {
   
    if (!ALLOWED_FORMATS.includes(file.type)) {
      resolve({
        valid: false,
        message: 'Invalid file format. Please upload JPG, PNG, or WEBP.',
      });
      return;
    }


    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      resolve({
        valid: false,
        message: 'File size exceeds 5MB. Please upload a smaller file.',
      });
      return;
    }

 
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const { width, height } = image;
        if (
          width < MIN_RESOLUTION ||
          height < MIN_RESOLUTION ||
          width > MAX_RESOLUTION ||
          height > MAX_RESOLUTION
        ) {
          resolve({
            valid: false,
            message: `Invalid resolution. Image must be between ${MIN_RESOLUTION}x${MIN_RESOLUTION}px and ${MAX_RESOLUTION}x${MAX_RESOLUTION}px.`,
          });
        } else {
          resolve({ valid: true });
        }
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};
