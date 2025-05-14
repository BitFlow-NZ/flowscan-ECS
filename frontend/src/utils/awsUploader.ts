// utils/awsUploader.ts
import AWS from 'aws-sdk';
import { message } from 'antd';
import { Buffer } from 'buffer';
import { getPresignedUrl} from '@/services/ant-design-pro/api';


const awsRegion = (window as any).ENV?.REACT_APP_AWS_REGION;
const accessKeyId = (window as any).ENV?.REACT_APP_AWS_ACCESS_KEY_ID;
const secretAccessKey = (window as any).ENV?.REACT_APP_AWS_SECRET_ACCESS_KEY;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region: awsRegion,
});

export const s3 = new AWS.S3({
  useAccelerateEndpoint: true,
  region: awsRegion,
});

export const compressImage = async (imageData: string): Promise<string> => {
  const img = new Image();
  img.src = imageData;
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Failed to get canvas context');

  canvas.width = 1920;
  canvas.height = 1080;

  ctx.drawImage(img, 0, 0, 1920, 1080);
  return canvas.toDataURL('image/png', 0.8);
};

export const uploadToS3_CapturedImage = async (
  imageData: string,
  setIsUploading?: (val: boolean) => void,
): Promise<string> => {
  try {
    if (setIsUploading) setIsUploading(true);

    console.time('Compression Time');
    const compressedImage = await compressImage(imageData);
    console.timeEnd('Compression Time');

    const base64Data = compressedImage.replace(/^data:image\/\w+;base64,/, '');
    const fileType = compressedImage.split(';')[0].split(':')[1];

    // const res = await fetch('/api/upload/get-presigned-url', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     fileType,
    //     fileExtension: 'png',
    //     folder: 'captured-image',
    //   }),
    // });

    // if (!res.ok) throw new Error('Failed to get upload URL');

    const { uploadUrl, publicUrl } = await getPresignedUrl(fileType, 'captured-image');

    console.time('Upload Time');
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': fileType },
      body: Buffer.from(base64Data, 'base64'),
    });
    console.timeEnd('Upload Time');

    if (!uploadRes.ok) throw new Error('Failed to upload to S3');

    return publicUrl;
  } catch (err) {
    console.error('Upload Error:', err);
    throw err;
  } finally {
    if (setIsUploading) setIsUploading(false);
  }
};

export const uploadToS3_UnitsImage = async (
  file: File | string,
  folder: string = 'units-images-new',
): Promise<string | null> => {
  try {
    const isBase64 = typeof file === 'string';
    const base64Data = isBase64 ? file.replace(/^data:image\/\w+;base64,/, '') : null;

    const fileType = isBase64 ? 'image/png' : file.type;

    // 1. Get presigned URL from backend
    // const res = await fetch('/api/upload/get-presigned-url', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     fileType,
    //     fileExtension: 'png',
    //     folder,
    //   }),
    // });

    // if (!res.ok) {
    //   throw new Error('Failed to get upload URL');
    // }

    // const { uploadUrl, publicUrl } = await res.json();
    const { uploadUrl, publicUrl } = await getPresignedUrl(fileType, folder);

    // 2. Upload to S3 via PUT
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
      body: isBase64 ? Buffer.from(base64Data!, 'base64') : file,
    });

    if (!uploadRes.ok) {
      throw new Error('Failed to upload to S3');
    }

    message.success('Image uploaded successfully!');
    return publicUrl;
  } catch (err) {
    console.error('S3 Upload Error:', err);
    message.error('Failed to upload image.');
    return null;
  }
};
