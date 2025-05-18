import React, { useState, useRef, useEffect } from 'react';
import { Upload, Button, Modal, message,Image } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import Webcam from 'react-webcam';
// import AWS from 'aws-sdk';
import { UploadFile } from 'antd/es/upload/interface';
//import ImgCrop from 'antd-img-crop';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { uploadToS3_UnitsImage } from '@/utils/awsUploader';


type PhotoUploaderProps = {
  onUploadSuccess: (imageUrl: string | null) => void;
  initialImage?: string; 
};

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onUploadSuccess, initialImage }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [isCropping, setIsCropping] = useState(false);
   const cropperRef = useRef<HTMLImageElement & { cropper: Cropper }>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  


  //  initialImage 
  useEffect(() => {
    if (initialImage) {
      setFileList([
        {
          uid: '-1', 
          name: 'Initial Image',
          status: 'done',
          url: initialImage,
        } as UploadFile,
      ]);
    }
  }, [initialImage]);

  
  useEffect(() => {
    if (isCameraOpen) {
      if (webcamRef.current) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
          if (webcamRef.current) {
            webcamRef.current.stream?.getTracks().forEach((track) => track.stop());
            webcamRef.current.stream = mediaStream;
            if (webcamRef.current.video?.srcObject) {
              webcamRef.current.video.srcObject = mediaStream;
              setIsCameraReady(true);
            }
          }
        });
      }
    } else {
      if (webcamRef.current) {
        webcamRef.current.stream?.getTracks().forEach((track) => track.stop());
        setIsCameraReady(false);
      }
    }
  }, [isCameraOpen, webcamRef.current]);

  // AWS.config.update({
  //   accessKeyId: (window as any).ENV?.REACT_APP_AWS_ACCESS_KEY_ID,
  // secretAccessKey: (window as any).ENV?.REACT_APP_AWS_SECRET_ACCESS_KEY, 
  // region: (window as any).ENV?.REACT_APP_AWS_REGION,
  // });

  // const s3 = new AWS.S3();

  // const uploadToS3 = async (file: File | string): Promise<string | null> => {
  //   try {
  //     const params = {
  //       Bucket: REACT_APP_AWS_BUCKET_NAME!,
  //       Key: `item-images/${Date.now()}.png`,
  //       Body:
  //         typeof file === 'string'
  //           ? Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  //           : file,
  //       ContentType: typeof file === 'string' ? 'image/png' : file.type,
  //     };
  //     const uploadResult = await s3.upload(params).promise();
  //     message.success('Image uploaded successfully!');
  //     return uploadResult.Location;
  //   } catch (error) {
  //     console.error('S3 Upload Error:', error);
  //     message.error('Failed to upload image.');
  //     return null;
  //   }
  // };

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const imageUrl = await uploadToS3_UnitsImage(file);
      if (imageUrl) {
        setFileList([{ uid: file.uid, name: file.name, status: 'done', url: imageUrl }]);
        onUploadSuccess(imageUrl);
        onSuccess(null, file);
      }
    } catch (error) {
      onError(error);
    }
  };

  const handleCapture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setIsCropping(true);
    } else {
      message.error('Failed to capture image.');
    }
  };

  const handleCropComplete = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas();
    const croppedImage = croppedCanvas.toDataURL('image/png');

    const imageUrl = await uploadToS3_UnitsImage(croppedImage);
    if (imageUrl) {
      setFileList([
        { uid: Date.now().toString(), name: 'cropped-image.png', status: 'done', url: imageUrl },
      ]);
      onUploadSuccess(imageUrl);
      setIsCameraOpen(false);
      setCapturedImage(null);
      setIsCropping(false); 
    }
  };


  // const handleUploadCapturedImage = async () => {
  //   if (capturedImage) {
  //     const imageUrl = await uploadToS3(capturedImage);
  //     if (imageUrl) {
  //       setFileList([
  //         { uid: Date.now().toString(), name: 'captured-image.png', status: 'done', url: imageUrl },
  //       ]);
  //       onUploadSuccess(imageUrl);
  //       setIsCameraOpen(false);
  //       setCapturedImage(null);
  //     }
  //   }
  // };

const getBase64 = (file: UploadFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj as File);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
   const handlePreview = async (file: UploadFile) => {
     if (!file.url && !file.preview) {
       file.preview = await getBase64(file);
     }

     setPreviewImage(file.url || (file.preview as string));
     setPreviewOpen(true);
   };

  // const onPreview = async (file: UploadFile) => {
  //   let src = file.url as string;
  //   if (!src) {
  //     src = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj as File);
  //       reader.onload = () => resolve(reader.result as string);
  //     });
  //   }
  //   const image = new Image();
  //   // image.src = src;
  //   // const imgWindow = window.open(src);
  //   // imgWindow?.document.write(image.outerHTML);
  //   image.style.maxWidth = '600px';
  //   image.style.maxHeight = '600px';
  //   image.src = src;

  //   const imgWindow = window.open();
  //   imgWindow?.document.write(`
  //     <html>
  //       <head><title>Preview</title></head>
  //       <body style="margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
  //         ${image.outerHTML}
  //       </body>
  //     </html>
  //   `);
  // };

  return (
    <div>
      {/* Upload from local */}
      <div>
        {/* <ImgCrop
          rotationSlider
          zoomSlider
          showReset
          minZoom={0.5}
          maxZoom={3}
          aspectSlider
          maxAspect={5}
        > */}
        <Upload
          listType="picture-card"
          fileList={fileList}
          customRequest={handleCustomUpload}
          onChange={({ fileList }) => setFileList(fileList)}
          onRemove={() => {
            setFileList([]);
            onUploadSuccess(null);
          }}
          // onPreview={onPreview}
          onPreview={handlePreview}
        >
          {fileList.length < 1 && '+ Upload'}
        </Upload>
        {/* </ImgCrop> */}
      </div>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
      {/* Open camera for capture */}
      <Button
        icon={<CameraOutlined />}
        style={{ marginTop: 10 }}
        onClick={() => setIsCameraOpen(true)}
      >
        Capture Photo
      </Button>

      {/* Camera Modal */}
      <Modal
        title="Capture Photo"
        open={isCameraOpen}
        onCancel={() => {
          setIsCameraOpen(false);
          setCapturedImage(null);
        }}
        footer={null}
        width={600}
      >
        {capturedImage && isCropping ? (
          <div>
            <div
              style={{ marginBottom: '10px', width: '100%', maxHeight: 250, objectFit: 'cover' }}
            >
              {/* <Cropper
                src={capturedImage}
                style={{ marginBottom: '10px', width: '100%', maxHeight: 250, objectFit: 'cover' }}
                // initialAspectRatio={16 / 9}
                guides={true}
                ref={cropperRef}
              /> */}

              <Cropper
                src={capturedImage}
                style={{ marginBottom: '10px', width: '100%', height: 250, objectFit: 'cover' }}
                guides={true}
                ref={cropperRef}
                viewMode={3}
                //autoCropArea={1}
                background
                responsive={true}
                checkOrientation
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              {/* <img
              src={capturedImage}
              alt="Captured"
              style={{ marginBottom: '10px', width: '100%', maxHeight: 250, objectFit: 'cover' }}
            /> */}

              <div>
                <Button style={{ marginRight: '10px' }} onClick={() => setCapturedImage(null)}>
                  Retake
                </Button>
                <Button type="primary" onClick={handleCropComplete}>
                  Crop&Upload
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              audio={false}
              videoConstraints={{ facingMode: 'environment' }}
              style={{ width: '100%', maxHeight: 250, objectFit: 'cover' }}
            />
            <Button type="primary" onClick={handleCapture} style={{ marginTop: 10 }}>
              Capture
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PhotoUploader;
