import React, { useState } from 'react';
import { Flex, Breadcrumb, Button, Form, Input, message, Space } from 'antd';
import { history } from '@umijs/max';
import PhotoUploader from '@/components/PhotoUploader';
import OCRKeywordsForm from '@/components/OCRKeywordsForm';
import UnitsForm from '@/components/UnitsForm';
import { createItem } from '@/services/ant-design-pro/api';
import { Unit, Keyword } from '../../type';

const DEFAULT_IMAGE_URL =
  'https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/backend-image/DefaultProductPhoto.png';

const AddNewEvent: React.FC = () => {
  const [form] = Form.useForm();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitReferences, setUnitReferences] = useState<{ [key: string]: number }>({});

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };

  const handleUploadSuccess = (imageUrl: string | null) => {
    form.setFieldsValue({
      displayImg: imageUrl || DEFAULT_IMAGE_URL,
    });
    console.log('Image URL:', imageUrl);
  };

  const handleUnitsChange = (updatedUnits: Unit[]) => {
    
    
    setUnits(updatedUnits);
    form.setFieldsValue({ units: updatedUnits });
    console.log('Updated Units:', updatedUnits);
  };

  const handleSubmit = async () => {
    const names = units.map((unit) => unit.name.trim().toLowerCase());
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);

    if (duplicates.length > 0) {
      message.error('Duplicate unit names detected. Please resolve them before submitting.');
      return; 
    }
    try {
      const formData = await form.validateFields();
      console.log('Form Data:', formData);

      if (formData.keywords) {
        const hasEmptyKeywords = formData.keywords.some(
          (keyword: Keyword) =>
            typeof keyword.ocrKeyword !== 'string' || keyword.ocrKeyword.trim() === '',
        );

        if (hasEmptyKeywords) {
          message.error('All OCR Keywords must be filled out.');
          return;
        }
      }
      const SubmmitedData = {
        name: formData.itemName,
        description: formData.description,
        img: formData.displayImg,
        units: formData.units,
        ocrItems: formData.keywords || [],
      };

      const response = await createItem(SubmmitedData);
      if (response?.success===true) {
        message.success('Item created successfully!');
        history.push('/items');
        console.log('Submitted Data:', formData);
      }else{
        message.error(response.message || 'Please check the form and try again.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      message.error('Failed to create item. Please check the form and try again.');
    }
  };

  const onReset = () => {
    form.resetFields();
    setUnits([]);
    setKeywords([]);
    setUnitReferences({});
  };

  const updateUnitReferences = (unitName: string | null, change: number) => {
    if (!unitName) return;

    setUnitReferences((prev) => {
      const updatedReferences = { ...prev };
      updatedReferences[unitName] = (updatedReferences[unitName] || 0) + change;

      if (updatedReferences[unitName] <= 0) {
        delete updatedReferences[unitName];
      }

      return updatedReferences;
    });
  };

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <a onClick={() => history.push('/items')}>Item List</a>,
          },
          {
            title: 'Create new Item',
          },
        ]}
        style={{ marginBottom: 30 }}
      />
      <Flex justify="center">
        <Form
          {...formItemLayout}
          style={{ width: 400 }}
          form={form}
          initialValues={{
            itemName: '',
            description: '',
            displayImg: DEFAULT_IMAGE_URL,
          }}
          layout="vertical"
        >
          <Form.Item
            name="itemName"
            label="Item Name"
            rules={[
              { required: true, message: 'Item Name is required' },
            
              { min: 2, max: 100, message: '2-100 characters allowed' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Description is required' },
              { min: 10, max: 1000, message: '10-1000 characters allowed' },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="displayImg"
            label="Product Photo"
            rules={[{ required: false }]}
            initialValue={DEFAULT_IMAGE_URL}
          >
            <PhotoUploader onUploadSuccess={handleUploadSuccess} />
          </Form.Item>

          <Form.Item name="units" label="Units" rules={[{ required: true }]}>
            <UnitsForm
              value={units}
              onChange={handleUnitsChange}
            //  defaultUnitImg={form.getFieldValue('displayImg') || ''}
              unitReferences={unitReferences}
            
            />
          </Form.Item>

          <Form.Item name="keywords" label="OCR Keywords">
            <OCRKeywordsForm
              units={units}
              value={keywords}
              onChange={setKeywords}
              updateUnitReferences={updateUnitReferences}
            />
          </Form.Item>
          <Flex justify="center" style={{ marginTop: 20 }}>
            <Space>
              <Button onClick={onReset}>Reset</Button>
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Space>
          </Flex>
        </Form>
      </Flex>
    </div>
  );
};

export default AddNewEvent;
