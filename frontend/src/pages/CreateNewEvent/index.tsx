import React, { useState, useCallback,useEffect} from 'react';
import { history } from '@umijs/max';
import {
  Flex,
  Breadcrumb,
  Button,
  Form,
  Input,
  Space,
  DatePicker,
  Typography,
  message,
  Modal,
  Empty,
} from 'antd';
import TakePicture from '../../components/TakePicture';
import AddItemCard from '../../components/Items/AddItemCard';
import ItemInCart from '../../components/Items/ItemInCart';
//import items from '../../data/items.json';
import { Item as ItemType, Unit, GlobalValue } from '../../type';
import SearchItem from '../../components/SearchItem';
import { createEvent } from '../../services/ant-design-pro/api';

const MemoizedTakePicture = React.memo(TakePicture);

const { Title } = Typography;

const CreateNewEvent: React.FC = () => {
  const [step, setStep] = React.useState<number>(1);

  const [globalValue, setGlobalValue] = useState<GlobalValue>({
    evtName: '',
    doctorName: '',
    patientName: '',
    eventTime: '',
    theaterNumber: '',
    editorName: '',
  });


  const [firstForm] = Form.useForm();
  const [secondForm] = Form.useForm();

  const [cart, setCart] = useState<ItemType[]>([]);
  const [searchResults, setSearchResults] = useState<ItemType[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRecognitionSuccess = useCallback((recognizedItems: ItemType[]) => {
    setSearchResults(recognizedItems);
  }, []);
  
  useEffect(() => {
    console.log('📸 TakePicture mounted');
    return () => console.log('📸 TakePicture unmounted');
  }, []);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    // wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 14 },
    // },
  };

  const onReset = () => {
    firstForm.resetFields();
    secondForm.resetFields();
  };

  const onFinishStep1 = (value: any) => {
    setGlobalValue({ ...globalValue, ...value });
    setStep(2);
  };

  // Add item to cart
  const addToCart = (item: ItemType) => {
    // const existingItem = cart.find((ItemType) => ItemType.id === item.id);
    // if (existingItem) {
    //   // Update the quantity of the existing item
    //   setCart(
    //     cart.map((ItemType) =>
    //       ItemType.id === item.id ? { ...ItemType, quantity: ItemType.quantity + 1 } : ItemType,
    //     ),
    //   );
    // } else {
    // Add the new item to the top of the cart
    const selectedUnit: Unit | null =
      item.defaultUnitId !== null
        ? item.units.find((unit) => unit.id === item.defaultUnitId) || null
        : item.units[0] || null;
    setCart([{ ...item, quantity: 1, selectedUnit, key: '' + item.id + Date.now() }, ...cart]);
    // }
  };

  // Remove item from cart
  const removeFromCart = (itemKey: string) => {
    setCart(cart.filter((item) => item.key !== itemKey));
  };

  // Update quantity
  const updateQuantity = (itemKey: string, newQuantity: number) => {
    setCart(cart.map((item) => (item.key === itemKey ? { ...item, quantity: newQuantity } : item)));
  };

  // Update selected unit
  const updateUnit = (itemKey: string, newUnitId: number) => {
    setCart(
      cart.map((item) =>
        item.key === itemKey
          ? {
              ...item,
              selectedUnit: item.units.find((unit) => unit.id === newUnitId) || null,
            }
          : item,
      ),
    );
  };

  const validateEventItems = (eventItems: ItemType[]): boolean => {
    const seen = new Set<string>();

    for (const item of eventItems) {
      const key = `${item.id}-${item.selectedUnit?.id}`;
      if (seen.has(key)) {
        message.warning('Duplicate items detected! Please remove first.');
        return false;
      }
      seen.add(key);
    }

    return true;
  };

  const handleConfirm = async () => {
    try {
      const values = await secondForm.validateFields();
      const eventData = {
        event: {
          name: globalValue.evtName,
          time: globalValue.eventTime,
          doctorName: globalValue.doctorName,
          patientName: globalValue.patientName,
          theaterNumber: globalValue.theaterNumber,
          lastEditPerson: values.editorName,
        },
        eventItems: cart.map((item) => ({
          quantity: item.quantity,
          itemId: item.id,
          unitId: item.selectedUnit?.id || null,
        })),
      };

      console.log('Submitting Event Data:', eventData);

      // submit event
      const response = await createEvent(eventData);

      if (response.success===true) {
        message.success('Event submitted successfully!');

        firstForm.resetFields();
        secondForm.resetFields();
        setGlobalValue({
          evtName: '',
          doctorName: '',
          patientName: '',
          eventTime: '',
          theaterNumber: '',
          editorName: '',
        });
        setCart([]);
        setStep(1);
        setIsModalVisible(false);
        history.push('/events');
      } else {
        message.error(response.message || 'Failed to submit the event.');
      }
    } catch (err) {
      console.error('Validation failed or submission error:', err);
      message.error('Please correct the errors in the form.');
    }
  };

  // Show modal if cart is valid
  const handleSubmit = () => {
    if (validateEventItems(cart)) {
      setIsModalVisible(true);
    }
  };

  // Hide the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: 'Create New Event',
          },
          {
            title: step === 2 ? 'Item Cart' : 'Basic Info',
          },
        ]}
        style={{ marginBottom: 30 }}
      />
      {step === 1 && (
        <Flex justify="center">
          <Form
            {...formItemLayout}
            style={{ width: 400 }}
            form={firstForm}
            onFinish={onFinishStep1}
            initialValues={{
              evtName: '',
              doctorName: '',
              patientName: '',
              eventTime: null,
              theaterNumber: '',
            }}
          >
            <Form.Item
              name="evtName"
              label="Event Name"
              rules={[
                { required: true, message: 'Event Name is required' },
                {
                  pattern: /^[A-Za-z0-9\s-_]+$/,
                  message: 'Use letters, numbers, -/_ only',
                },
                { max: 50, message: 'Maximum 50 characters allowed' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="doctorName"
              label="Doctor Name"
              rules={[
                { required: true, message: 'Doctor Name is required' },
                {
                  pattern: /^[a-zA-Z .]+$/,
                  message: 'Use letters, spaces, and periods only',
                },
                { max: 100, message: 'Maximum 100 characters allowed' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="patientName"
              label="Patient Name"
              rules={[
                { required: true, message: 'Patient Name is required' },
                {
                  pattern: /^[a-zA-Z ]+$/,
                  message: 'Use letters and spaces only',
                },
                { max: 100, message: 'Maximum 100 characters allowed' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="eventTime"
              label="Event Time"
              rules={[{ required: true, message: 'Event Time is required' }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="theaterNumber"
              label="Theater Number"
              rules={[{ required: false }, { max: 50, message: 'Maximum 50 characters allowed' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Flex justify="end">
                <Space>
                  <Button htmlType="button" onClick={onReset}>
                    Reset
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                </Space>
              </Flex>
            </Form.Item>
          </Form>
        </Flex>
      )}
      {step === 2 && (
        <Flex vertical>
          <Flex style={{ width: '100%', flexGrow: 1, maxWidth: 1300 }}>
            <Flex vertical style={{ marginRight: 'auto', width: 600 }}>
              <div>
                <Title level={5}>Image Camera</Title>
                {/* <TakePicture onRecognitionSuccess={handleRecognitionSuccess} /> */}
                <MemoizedTakePicture onRecognitionSuccess={handleRecognitionSuccess} />
              </div>

              <div>
                <SearchItem onSearchResults={setSearchResults} />
                <div>
                  {!(searchResults && searchResults.length > 0) ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <AddItemCard items={searchResults} addToCart={addToCart} />
                  )}
                </div>
              </div>
            </Flex>
            <Flex vertical style={{ width: '100%', marginLeft: 40, maxWidth: 600 }}>
              <Title level={5}>In Cart List</Title>
              <div>
                {!(cart && cart.length > 0) ? (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <ItemInCart
                    cart={cart}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                    updateUnit={updateUnit}
                  />
                )}
              </div>
            </Flex>
          </Flex>
          <Flex justify="end">
            <div
              style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                display: 'flex',
                gap: '10px',
              }}
            >
              <Button htmlType="button" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </Flex>
        </Flex>
      )}
      {/* Modal for Editor Name */}
      <Modal
        title="Confirm Submission"
        open={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        <Form form={secondForm} layout="vertical" initialValues={{ editorName: '' }}>
          <Form.Item
            name="editorName"
            label="Editor Name"
            rules={[
              { required: true, message: 'Editor Name is required' },
              {
                pattern: /^[a-zA-Z .]+$/,
                message: 'Use letters, spaces, and periods only',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateNewEvent;
