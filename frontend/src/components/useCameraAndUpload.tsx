import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import AWS from 'aws-sdk';
import { message } from 'antd';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
  region: process.env.REACT_APP_AWS_REGION!,
});

const s3 = new AWS.S3();

export const useCameraAndUpload = (bucketName: string) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      message.error('Failed to capture image.');
      return;
    }
    setCapturedImage(imageSrc);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const uploadToS3 = async (): Promise<string | null> => {
    if (!capturedImage) {
      message.error('No image to upload.');
      return null;
    }

    try {
      const base64Data = Buffer.from(
        capturedImage.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
      const params = {
        Bucket: bucketName,
        Key: `uploaded-images/${Date.now()}.png`,
        Body: base64Data,
        ContentType: 'image/png',
      };

      const uploadResult = await s3.upload(params).promise();
      message.success('Image uploaded successfully!');
      return uploadResult.Location;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      message.error('Failed to upload image.');
      return null;
    }
  };

  return {
    isCameraOpen,
    setIsCameraOpen,
    capturedImage,
    setCapturedImage,
    webcamRef,
    handleCapture,
    handleRetake,
    uploadToS3,
  };
};
