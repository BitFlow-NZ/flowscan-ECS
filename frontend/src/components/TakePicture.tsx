import { useRef, useState, useCallback, useEffect } from 'react';
import AWS from 'aws-sdk';
import Webcam from 'react-webcam';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Typography, Flex, Popover, message, Select } from 'antd';
import { Item } from '../type';
import { imageRecognition, recognizeBarcode } from '@/services/ant-design-pro/api';
import { BarcodeScanner } from 'react-barcode-scanner';

const ExamplePicture = `${window.ENV?.REACT_APP_IMG_URL}/image/Example+Picture.jpg`;

const TakePicture = ({
  onRecognitionSuccess,
}: {
  onRecognitionSuccess: (items: Item[]) => void;
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);

  const { Option } = Select;

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>();

  const [barcodePaused, setBarcodePaused] = useState(false);
  // const lastScannedRef = useRef<{ code: string; timestamp: number }>({ code: '', timestamp: 0 });
  const isHandlingScanRef = useRef(false); // 🔒 是否正在处理中，避免连续调用
  const scannedCodes = useRef<Set<string>>(new Set());
const lastScannedRef = useRef<string>(''); 
 

  const SCAN_INTERVAL_MS = 3000;
  // Fetch available devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first camera
        }
      } catch (error) {
        message.error('Failed to access camera devices.');
        console.error(error);
      }
    };

    getDevices();
  }, []);

  // Handle camera selection
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  // AWS Configuration
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

  // Upload image to S3
  const uploadToS3 = async (imageData: string): Promise<AWS.S3.ManagedUpload.SendData> => {
    setIsUploading(true);

    try {
      // Compress the image before converting it to a buffer
      console.time('Compression Time');
      const compressedImage = await compressImage(imageData);
      console.timeEnd('Compression Time');

      const base64Data = Buffer.from(
        compressedImage.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
      const fileType = compressedImage.split(';')[0].split(':')[1];

      const bucketName =  (window as any).ENV?.REACT_APP_AWS_BUCKET_NAME || 
      import.meta.env.VITE_AWS_BUCKET_NAME || 
      'flowscan-web';

      // S3 upload parameters
      const params = {
        Bucket: bucketName,
        Key: `captured-image/${Date.now()}.png`,
        Body: base64Data,
        ContentType: fileType,
      };

      console.time('Upload Time');
      const uploadResult = await s3.upload(params).promise();
      console.timeEnd('Upload Time');

      return uploadResult;
    } catch (error) {
      setIsUploading(false);
      console.error('S3 Upload Error:', error);
      throw error;
    }
  };

  // Capture picture from webcam
  const capture = useCallback(async () => {
    try {
      // Capture the image
      const imageSrc = (webcamRef.current as any)?.getScreenshot();
      if (!imageSrc) {
        message.error('Failed to capture an image.');
        return;
      }

      setIsUploading(true);
      setImgSrc(imageSrc);

      console.log('Captured Image Size (Base64):', imageSrc.length);

      // Compress and upload the image
      const compressedImage = await compressImage(imageSrc);
      const uploadResult = await uploadToS3(compressedImage);
      const uploadedImageUrl = uploadResult.Location;

      // Perform image recognition
      const recognitionResponse = await imageRecognition({ imageUrl: uploadedImageUrl });

      if (recognitionResponse?.success === true) {
        const recognizedItems = recognitionResponse.data || [];

        // message.success('Awesome!' );
        setImgSrc(null);
        onRecognitionSuccess(recognizedItems); // Pass recognized items to parent component
        setIsUploading(false);
      } else {
        const serverMessage =
          recognitionResponse?.message || 'Please try again or use the search bar.';
        message.warning(serverMessage);
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || 'No text detected.';
      message.error(serverMessage);
      setImgSrc(null);
      setIsUploading(false);
    } finally {
      setImgSrc(null);
      setIsUploading(false);
    }
  }, [webcamRef, onRecognitionSuccess]);

  // Function to handle keydown for the "Enter" key
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      const isInputField =
        event.target instanceof HTMLElement &&
        (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA');

      // Only capture if the webcam is open and the keypress is not in an input field
      if (event.key === 'Enter' && isWebcamOpen && !isInputField) {
        event.preventDefault();
        event.stopPropagation();
        await capture();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWebcamOpen, capture]);

  const content = (
    <div>
      <p>Ensure your object fits inside the frame.</p>
      <img
        src={ExamplePicture}
        alt="Example Picture"
        style={{
          display: 'block',
          margin: '0 auto', // Center horizontally
          width: '160px',
          height: '100px',
        }}
      />
    </div>
  );

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setBarcodePaused(false);
  //   }, 1000); // 延迟开启条码识别
  //   return () => clearTimeout(timer);
  // }, [isWebcamOpen]);

  return (
    <div>
      <div
        style={{
          border: '1px dashed #1890ff',
          borderRadius: 4,
          marginBottom: 24,
          fontSize: 0,
          //  overflow: 'hidden',
          // width: '100%',
          position: 'relative',
          // maxWidth: 306,
        }}
      >
        <div>
          {!imgSrc && isWebcamOpen ? (
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 250,
                backgroundColor: '#000',
              }}
            >
              <Webcam
                ref={webcamRef}
                // mirrored={false}
                screenshotFormat="image/png"
                forceScreenshotSourceSize
                screenshotQuality={1}
                videoConstraints={{
                  width: 1920,
                  height: 1080,
                  facingMode: 'environment',
                }}
                style={{
                  width: '100%',
                  top: 0,
                  left: 0,
                  height: '100%',
                  position: 'absolute',
                  objectFit: 'cover',
                  zIndex: 1,
                }}
              />
              <BarcodeScanner
                paused={barcodePaused}
                options={{
                  formats: [
                    'aztec',
                    'code_128',
                    'code_39',
                    'code_93',
                    'codabar',
                    'data_matrix',
                    'ean_13',
                    'ean_8',
                    'itf',
                    'pdf417',
                    'qr_code',
                    'upc_a',
                    'upc_e',
                  ],
                  delay: 3000,
                }}
                trackConstraints={{
                  deviceId: selectedDeviceId,
                  facingMode: 'environment',
                }}
                onCapture={async (barcodes) => {
                  const codeData = barcodes?.[0];
                  const code = codeData?.rawValue;
                  const format = codeData?.format;
                  console.log('format:', format);
                  console.log('code:', code);

                  if (!code) return;

                  // if (scannedCodes.current.has(code)) {
                  //   // message.info('Already scanned this code.please clear the history.');
                  //   return;
                  // }
                  // const now = Date.now();
                  // const { code: lastCode, timestamp: lastTime } = lastScannedRef.current;

                  // if (code === lastCode && now - lastTime < SCAN_INTERVAL_MS) {

                  //   return;
                  // }

                  // lastScannedRef.current = { code, timestamp: now };

                  // scannedCodes.current.add(code);

                  // 只和上一个扫描值比较，不使用 Set
                  if (code === lastScannedRef.current) {
                    console.log('⚠️ Same as last scanned, skipping API call.');
                    return;
                  }

                  lastScannedRef.current = code; // 更新上一个扫描值

                  // console.log('📦 New Code scanned:', code);
                  try {
                    const response = await recognizeBarcode({ type: format, content: code });

                    if (response?.success) {
                      onRecognitionSuccess(response.data);
                      message.success(response.message || `Found: ${code}`);
                    } else {
                      message.warning(
                        response.message || 'No match found. Try capturing an image.',
                      );
                    }
                  } catch (err) {
                    message.error('Scan failed. Try capturing an image.');
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  objectFit: 'cover',
                  top: 0,
                  left: 0,
                  zIndex: 2,
                }}
              />
            </div>
          ) : imgSrc ? (
            <div style={{ height: 250 }}>
              <img
                src={imgSrc}
                alt="Captured"
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: 250,
                  position: 'absolute',
                }}
              />
            </div>
          ) : (
            <div>
              <Empty
                image={`${window.ENV?.REACT_APP_IMG_URL}/image/camera.png`}
                imageStyle={{ height: 60 }}
                description={
                  <Popover
                    content={content}
                    title="Example"
                    style={{ width: '150px', height: '100px' }}
                  >
                    <Typography.Text style={{ color: '#1677FF' }}>Example Picture</Typography.Text>
                    <QuestionCircleOutlined
                      style={{ marginLeft: '4px', fontSize: '12px', color: '#1890ff' }}
                    />
                  </Popover>
                }
                style={{ width: '100%', height: 250, boxSizing: 'border-box', paddingTop: 50 }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Align items to the left
                    margin: '0 auto', // Center the container horizontally
                    // border: '1px dashed #1890ff',
                  }}
                >
                  <div
                    style={{
                      // display: 'flex',
                      // flexDirection: 'column',
                      // alignItems: 'flex-start',
                      fontSize: '12px',
                      //  color: '#888',
                      // border: '1px dashed #1890ff', // Dashed border
                      //padding: '5px',
                      // marginLeft: '65px',
                    }}
                  >
                    <div style={{ fontSize: '12px' }}>
                      <label>Select Camera:</label>
                      <Select
                        style={{ width: 150, marginLeft: '5px', height: 25 }}
                        placeholder="Select a camera"
                        value={selectedDeviceId}
                        onChange={handleDeviceChange}
                      >
                        {devices.map((device) => (
                          <Option
                            key={device.deviceId}
                            value={device.deviceId}
                            // style={{ fontSize: '12px' }}
                          >
                            {device.label || `Camera ${device.deviceId}`}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <p style={{ marginTop: '10px' }}>Turn on the camera to start.</p>
                  </div>
                </div>
              </Empty>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <Flex justify="center" style={{ marginBottom: 24, flexWrap: 'wrap' }}>
        <div
          style={{
            flex: '1 1 250px',
            minWidth: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <label style={{ marginRight: 10, fontSize: '12' }}>Camera:</label>
          {!isWebcamOpen ? (
            <Button
              type="primary"
              onClick={() => setIsWebcamOpen(true)}
              style={{ marginRight: 20 }}
            >
              Turn on
            </Button>
          ) : (
            <Button
              type="default"
              onClick={() => {
                setIsWebcamOpen(false);
                setImgSrc(null);
              }}
              style={{ marginRight: 20 }}
            >
              Turn Off
            </Button>
          )}

          <Button
            type="primary"
            onClick={capture}
            disabled={!isWebcamOpen || isUploading}
            style={{
              backgroundColor: isWebcamOpen ? '#1890ff' : '#f5f5f5', // Blue if webcam is open
              borderColor: isWebcamOpen ? '#1890ff' : '#d9d9d9',
              color: isWebcamOpen ? '#fff' : '#000',
              marginLeft: 20,
            }}
          >
            {isUploading ? 'Uploading...' : 'Capture'}
          </Button>
          {/* <Button onClick={() => scannedCodes.current.clear()} style={{ marginLeft: 15 }}>
            Clear Scan History
          </Button> */}
        </div>
      </Flex>
    </div>
  );
};

export default TakePicture;
