import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Modal, message, Popover, Space, Upload } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  CameraOutlined,
  QuestionCircleOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import Webcam from 'react-webcam';
import AWS from 'aws-sdk';
import { Unit } from '../type';
import { UploadFile } from 'antd/es/upload/interface';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
//import ImgCrop from 'antd-img-crop';

type UnitsFormProps = {
  value?: Unit[];
  onChange: (units: Unit[]) => void;
  // defaultUnitImg: string;
  unitReferences: { [key: string]: number };
  initialImage?: string;
};

const UnitsForm: React.FC<UnitsFormProps> = ({
  value = [],
  onChange,
  //  defaultUnitImg,
  unitReferences,
  initialImage,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [duplicateUnits, setDuplicateUnits] = useState<string[]>([]);
  const [isCropping, setIsCropping] = useState(false);
  const cropperRef = useRef<HTMLImageElement & { cropper: Cropper }>(null);

  const DEFAULT_IMAGE_URL =
    'https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/backend-image/DefaultProductPhoto.png';

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

  const s3 = new AWS.S3();

  // const uploadToS3 = async (imageData: string): Promise<string | null> => {
  //   try {
  //     const base64Data = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  //     const params = {
  //       Bucket: REACT_APP_AWS_BUCKET_NAME!,
  //       Key: `units-image/${Date.now()}.png`,
  //       Body: base64Data,
  //       ContentType: 'image/png',
  //     };

  //     const uploadResult = await s3.upload(params).promise();
  //    // message.success('Image uploaded successfully!');
  //     return uploadResult.Location;
  //   } catch (error) {
  //     console.error('S3 Upload Error:', error);
  //     message.error('Failed to upload image.');
  //     return null;
  //   }
  // };
  const uploadToS3 = async (file: File | string): Promise<string | null> => {
    try {
      const params = {
        Bucket: REACT_APP_AWS_BUCKET_NAME!,
        Key: `units-images-new/${Date.now()}.png`,
        Body:
          typeof file === 'string'
            ? Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
            : file,
        ContentType: typeof file === 'string' ? 'image/png' : file.type,
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

  const handleCapture = () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      message.error('Failed to capture image.');
      return;
    }
    setCapturedImage(imageSrc);
    setIsCropping(true);
  };

  // const handleRetake = () => {
  //   setCapturedImage(null);
  // };

  const handleCropComplete = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas();
    const croppedImage = croppedCanvas.toDataURL('image/png');

    const imageUrl = await uploadToS3(croppedImage);
    if (imageUrl) {
      setFileList([
        { uid: Date.now().toString(), name: 'cropped-image.png', status: 'done', url: imageUrl },
      ]);

      const updatedUnits = [...value];
      if (currentFieldIndex !== null) {
        updatedUnits[currentFieldIndex].img = imageUrl;
      }
      onChange(updatedUnits);
      // onUploadSuccess(imageUrl);
      setIsCameraOpen(false);
      setCapturedImage(null);
      setIsCropping(false);
    }
  };

  // const handleUploadCapturedImage = async () => {
  //   if (!capturedImage || currentFieldIndex === null) {
  //     message.error('No image captured or invalid field index.');
  //     return;
  //   }

  //   try {
  //     const imageUrl = await uploadToS3(capturedImage);
  //     if (imageUrl) {
  //       const updatedUnits = [...value];
  //       updatedUnits[currentFieldIndex].img = imageUrl;
  //       onChange(updatedUnits);

  //       // message.success('Image uploaded successfully!');
  //     }
  //   } catch (error) {
  //     console.error('Upload Error:', error);
  //     message.error('Failed to upload captured image.');
  //   } finally {
  //     setIsCameraOpen(false);
  //     setCapturedImage(null);
  //   }
  // };

  const handleCustomUpload = async (options: any, index: number) => {
    const { file, onSuccess, onError } = options;
    try {
      const imageUrl = await uploadToS3(file);
      if (imageUrl) {
        const updatedUnits = [...value];
        updatedUnits[index].img = imageUrl;
        onChange(updatedUnits);
        onSuccess(null, file);
      }
    } catch (error) {
      onError(error);
      message.error('Failed to upload image.');
    }
  };

  const handleUnitsChange = (index: number, name: string) => {
    const updatedUnits = [...value];
    updatedUnits[index].name = name;

    const names = updatedUnits.map((unit) => unit.name.toLowerCase());
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);

    if (duplicates.length > 0 && updatedUnits[index].name !== '') {
      Modal.confirm({
        title: 'Duplicate Unit Name',
        content: `"${name}" is already existed. Please choose an action below.`,
        okText: 'Clear',
        cancelText: 'Remove',
        onOk: () => {
         
          updatedUnits[index].name = '';
          onChange(updatedUnits);
          message.info(`"${name}" has been cleared.`);
        },
        onCancel: () => {
        
          updatedUnits.splice(index, 1);
          onChange(updatedUnits);
          message.success(`"${name}" has been removed.`);
        },
      });
      return;
    }

  
    onChange(updatedUnits);
  };

  const handleRemove = (unitName: string, index: number) => {
   
    if (unitReferences[unitName]) {
      message.warning(`Unit "${unitName}" cannot be removed as it is used in OCR Keywords.`);
      return;
    }

    const updatedUnits = [...value];
    updatedUnits.splice(index, 1);
    onChange(updatedUnits);
  };
  useEffect(() => {
    const names = value.map((unit) => unit.name.trim().toLowerCase());
    const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
    setDuplicateUnits(duplicates); 
  }, [value]);

  useEffect(() => {
    if (value.length === 0) {
      onChange([{ name: '', img: DEFAULT_IMAGE_URL }]);
    }
  }, [value, onChange]);

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
      <Form.List name="units">
        {(fields, { add, remove }) => (
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '8px',
                  }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    style={{
                      flex: 1,
                      marginBottom: 0,
                    }}
                    rules={[
                      { required: true, message: 'Unit name is required.' },
                      { max: 100, message: 'Max 100 characters allowed.' },
                    ]}
                  >
                    <Input
                      placeholder="Unit Name"
                      onBlur={(e) => handleUnitsChange(index, e.target.value)}
                  
                    />
                  </Form.Item>
                  <Space>
                    {/* Popover for Unit Image */}
                    <Popover
                      content={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100px',
                            width: '100px',
                            overflow: 'hidden',
                            margin: '0 auto',
                          }}
                        >
                          <img
                            src={value[index]?.img || DEFAULT_IMAGE_URL}
                            alt="Unit Photo"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </div>
                      }
                      title={
                        value[index]?.img === DEFAULT_IMAGE_URL ? 'No Unit Image' : 'Unit Image'
                      }
                      overlayStyle={{ maxWidth: '150px' }}
                    >
                      <QuestionCircleOutlined
                        style={{ fontSize: '16px', color: '#1890ff', marginLeft: '5px' }}
                      />
                    </Popover>

                    <Button
                      icon={<CameraOutlined />}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '5px',
                      }}
                      onClick={async () => {
                        const hasCamera = await checkCameraAvailability();
                        if (hasCamera) {
                          setCurrentFieldIndex(index);
                          setIsCameraOpen(true);
                          setIsCameraReady(true);
                        } else {
                          message.error('No camera detected.');
                          setIsCameraReady(false);
                        }
                      }}
                    />
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
                    {/* </ImgCrop> */}

                    <Button
                      icon={<MinusCircleOutlined />}
                      type="text"
                      danger
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '5px',
                      }}
                      onClick={() => handleRemove(value[index]?.name || '', index)}
                    />
                  </Space>
                </div>
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add({ name: '', img: DEFAULT_IMAGE_URL });
                }}
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
              >
                Add Unit
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Modal
        title="Capture Image for Unit"
        open={isCameraOpen}
        onCancel={() => {
          if (isCameraReady) {
            setIsCameraOpen(false);
            setCapturedImage(null);
          }
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
            <Button type="primary" onClick={handleCapture} style={{ marginTop: '10px' }}>
              Capture
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UnitsForm;
