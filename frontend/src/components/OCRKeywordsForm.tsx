import React, { useState, useRef} from 'react';
import { Form, Input, Button, Select, message, Modal, Upload } from 'antd';
import { CameraOutlined, PlusOutlined, MinusCircleOutlined,CloudUploadOutlined} from '@ant-design/icons';
import Webcam from 'react-webcam';
import AWS from 'aws-sdk';
import { OCRKeywords } from '@/services/ant-design-pro/api';
import { Keyword, Unit } from '../type';
//import { UploadFile } from 'antd/es/upload/interface';

type OCRKeywordsFormProps = {
  units: Unit[];
  value?: Keyword[];
  onChange: (keywords: Keyword[]) => void;
  updateUnitReferences: (unitName: string | null, change: number) => void;
 
};


const OCRKeywordsForm: React.FC<OCRKeywordsFormProps> = ({
  units,
  value = [],
  onChange,
  updateUnitReferences,
 
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);


  const webcamRef = useRef<Webcam>(null);


  React.useEffect(() => {
    if (isCameraOpen) {
      if (webcamRef.current) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (mediaStream) {
          if (webcamRef.current) {
            webcamRef.current.stream?.getTracks().forEach((track: any) => {
              track.stop();
            });
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
        webcamRef.current.stream?.getTracks().forEach((track: any) => {
          track.stop();
        });
        setIsCameraReady(false);
      }
    }
  }, [isCameraOpen, webcamRef.current]);
  
  AWS.config.update({
    accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: REACT_APP_AWS_REGION,
  });

  const s3 = new AWS.S3({
    useAccelerateEndpoint: true,
    region: REACT_APP_AWS_REGION,
  });

  const compressImage = async (imageData: string): Promise<string> => {
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

    // Convert the canvas to compressed base64 image
    return canvas.toDataURL('image/png', 0.8);
  };

  const uploadToS3 = async (imageData: string): Promise<string> => {
    const compressedImage = await compressImage(imageData);
    const base64Data = Buffer.from(
      compressedImage.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    const fileType = compressedImage.split(';')[0].split(':')[1];

    const params = {
      Bucket: REACT_APP_AWS_BUCKET_NAME!,
      Key: `ocr-keywords-new/${Date.now()}.png`,
      Body: base64Data,
      ContentType: fileType,
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  };
const processImageForOCR = async (imageSrc:any, index:any) => {
  try {
    const imageUrl = await uploadToS3(imageSrc);
    const recognitionResponse = await OCRKeywords({ imageUrl });

    if (recognitionResponse.success===true) {
      const updatedKeywords = [...value];
      updatedKeywords[index].ocrKeyword = recognitionResponse.data;
      onChange(updatedKeywords);
      message.success('OCR succeeded and keyword updated!');
    } else {
      message.error(recognitionResponse.message || 'OCR failed.');
    }
  } catch (error) {
    console.error('OCR Error:', error);
    message.error('Failed to process the image.');
  }
};
   const handleCaptureAndUpload = async () => {
     if (!webcamRef.current) {
       message.error('Webcam is not initialized.');
       return;
     }

     const imageSrc = webcamRef.current.getScreenshot();
     if (imageSrc) {
       setIsUploading(true);
       try {
         await processImageForOCR(imageSrc, currentFieldIndex);
       } finally {
         setIsUploading(false);
         setIsCameraOpen(false);
         setCapturedImage(null);
       }
     } else {
       message.error('Failed to capture image.');
     }
   };
const handleCustomUpload = async (options:any, index:number) => {
  const { file, onSuccess, onError } = options;

  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        await processImageForOCR(e.target.result, index);
        onSuccess(null, file);
      }
    };
    reader.onerror = () => {
      message.error('Failed to read file.');
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('OCR Error:', error);
    message.error('Failed to process the uploaded image.');
    onError(error);
  }
};



  const handleUnitChange = (index: number, unitName: string | null) => {
    const updatedKeywords = [...value];

    // Update unit references
    if (updatedKeywords[index]?.unitName) {
      updateUnitReferences(updatedKeywords[index].unitName, -1);
    }
    if (unitName) {
      updateUnitReferences(unitName, 1);
    }

    updatedKeywords[index].unitName = unitName;
    onChange(updatedKeywords);
  };

  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = [...value];

    // Update unit references
    const removedUnitName = updatedKeywords[index]?.unitName;
    if (removedUnitName) {
      updateUnitReferences(removedUnitName, -1);
    }

    updatedKeywords.splice(index, 1);
    onChange(updatedKeywords);
  };

  const handleAddKeyword = () => {
    const newKeyword = { ocrKeyword: '', unitName: null };
    const updatedKeywords = [...value, newKeyword];
    onChange(updatedKeywords);
  };

const checkCameraAvailability = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some((device) => device.kind === 'videoinput');
    return hasCamera;
  } catch (error) {
    console.error('Error checking camera availability:', error);
    return false;
  }
};



  

  return (
    <>
      <Form.List name="keywords">
        {(fields) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                }}
              >
                <Form.Item
                  {...restField}
                  name={[name, 'ocrKeyword']}
                  rules={[{ required: false }]}
                  style={{
                    flex: 3,
                    marginBottom: 0,
                  }}
                >
                  <Input.TextArea rows={3} placeholder="Enter keyword or use OCR" />
                </Form.Item>

                <Button
                  icon={<CameraOutlined />}
                  type="default"
                  onClick={async () => {
                    const hasCamera = await checkCameraAvailability();
                    if (hasCamera) {
                      setCurrentFieldIndex(index);
                      setIsCameraOpen(true);
                      setIsCameraReady(true);
                      console.log('Camera is ready');
                    } else {
                      message.error('No camera detected or access denied. ');
                      console.error('No camera detected or access denied.');
                      setIsCameraReady(false);
                    }
                  }}
                  disabled={isUploading}
                />
                <Upload
                  customRequest={(options) => handleCustomUpload(options, index)} 
                  showUploadList={false} 
                >
                  <Button
                    icon={<CloudUploadOutlined />}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: '5px',
                    }}
                  >
                    Upload
                  </Button>
                </Upload>

                <Form.Item
                  {...restField}
                  name={[name, 'unitName']}
                  style={{
                   // flex: 1,
                    marginBottom: 0,
                    width:'80px'
                  }}
                >
                  <Select
                    placeholder="Select Unit"
                    value={value[index]?.unitName || null}
                    onChange={(selectedValue) => handleUnitChange(index, selectedValue)}
                    options={[
                      { key: 'none', value: null, label: 'None' },
                      ...units.map((unit) => ({
                        key: unit.id,
                        value: unit.name,
                        label: unit.name,
                      })),
                    ]}
                  />
                </Form.Item>

                <Button
                  icon={<MinusCircleOutlined />}
                  type="text"
                  danger
                  onClick={() => handleRemoveKeyword(index)}
                />
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={handleAddKeyword}
                style={{ width: '100%', marginTop: '8px' }}
                icon={<PlusOutlined />}
              >
                Add Keyword
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Modal
        title="Capture Image for OCR"
        open={isCameraOpen && isCameraReady}
        onCancel={() => {
          if (isCameraReady) {
            setIsCameraOpen(false);
            setCapturedImage(null);
          }
        }}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center' }}>
          {!capturedImage ? (
            <div
              style={{
                // objectFit: 'cover',
                // width: '100%',
                height: 250,
                // position:'absolute'
              }}
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={{
                  width: 1920,
                  height: 1080,
                  facingMode: 'environment',
                }}
                style={{ width: '100%', maxHeight: 250, objectFit: 'cover' }}
                onUserMedia={() => setIsCameraReady(true)}
              />
            </div>
          ) : (
            <div
              style={{
                objectFit: 'cover',
                width: '100%',
                height: 250,
                // position:'absolute'
              }}
            >
              <img
                src={capturedImage}
                alt="Captured"
                style={{
                  height: 250,
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          <Button
            type="primary"
            onClick={handleCaptureAndUpload}
            loading={isUploading}
            style={{ marginTop: '10px' }}
          >
            {isUploading ? 'Uploading...' : 'Capture'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default OCRKeywordsForm;
