import { getItemById, updateItem } from '@/services/ant-design-pro/api';
import PhotoUploader from '@/components/PhotoUploader';
import OCRKeywordsForm from '@/components/OCRKeywordsForm';
import UnitsFormForEdit from '@/components/UnitsFormForEdit';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { history } from '@umijs/max';
import { Unit, Keyword } from '../../type';

import { Flex, Breadcrumb, Button, Form, Input, Space, message } from 'antd';
const DEFAULT_IMAGE_URL =
  'https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/backend-image/DefaultProductPhoto.png';

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitReferences, setUnitReferences] = useState<{ [key: string]: number }>({});
  const [originalUnits, setOriginalUnits] = useState<Unit[]>([]);
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!id) {
          throw new Error('Item ID is undefined');
        }
        const response = await getItemById(id);
        console.log('Response:', response);
        if (response.success) {
          const data = response.data;
          setOriginalUnits(response.data.units);
          const mappedUnits = data.units.map((unit: any) => ({
            id: unit.id,
            name: unit.name,
            img: unit.img,
          }));

          const mappedKeywords = data.ocrItems.map((ocrItem: any) => {
            const unit = data.units.find((u: any) => u.id === ocrItem.unitId);
            return {
              id: ocrItem.id,
              ocrKeyword: ocrItem.ocrKeyword,
              unitName: unit ? unit.name : null,
            };
          });
          setUnits(mappedUnits);
          setKeywords(mappedKeywords);

          form.setFieldsValue({
            id: data.id,
            itemName: data.name,
            description: data.description,
            displayImg: data.img,
            units: mappedUnits,
            keywords: mappedKeywords,
          });
          console.log('Form Data:', form.getFieldsValue());
        } else {
          throw new Error(response.message || 'Failed to load item');
        }
      } catch (error) {
        message.error('Failed to load item data.');
      }
    };

    fetchItem();
  }, [id, form]);

  const handleCancel = () => {
    history.push('/items');
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
  };

  const handleSubmit = async () => {
    const names = units.map((unit) => unit.name.trim().toLowerCase());
    const duplicates = names.find((name, index) => names.indexOf(name) !== index);

    if (duplicates) {
      message.warning('Duplicate unit names detected. Please resolve them before submitting.');
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
      const processedUnits = formData.units.map((unit: Unit) => {
        const originalUnit = originalUnits.find(
          (u: Unit) => u.name.trim().toLowerCase() === unit.name.trim().toLowerCase(),
        );

        if (originalUnit) {
          if (originalUnit.name.trim().toLowerCase() === unit.name.trim().toLowerCase()) {
            return { ...unit, id: originalUnit.id };
          } else {
            return { ...unit, id: null };
          }
        } else {
          return { ...unit, id: null }; 
        }
      });

      const submmitedData = {
        id: id,
        name: formData.itemName,
        description: formData.description,
        img: formData.displayImg,
        units: processedUnits,
        ocrItems: formData.keywords,
      };

      const response = await updateItem(submmitedData);
      console.log('update item units:', processedUnits);
      if (response.success===true) {
        message.success('Item updated successfully!');
        history.push('/items');
        console.log('Submitted Data:', formData);
      } else {
       message.error(response.message || 'Failed to update item');
      }
    } catch (error) {
      message.error('Failed to update item. Please check your input.');
    }
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
            title: 'Edit Item',
          },
        ]}
        style={{ marginBottom: 30 }}
      />
      <Flex justify="center">
        <Form {...formItemLayout} style={{ width: 400 }} form={form} layout="vertical">
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
            <PhotoUploader
              onUploadSuccess={handleUploadSuccess}
              initialImage={form.getFieldValue('displayImg')}
            />
          </Form.Item>

          <Form.Item name="units" label="Units" rules={[{ required: true }]}>
            
            <UnitsFormForEdit
              value={units}
              onChange={handleUnitsChange}
              //  defaultUnitImg={form.getFieldValue('displayImg') || ''}
              unitReferences={unitReferences}
              originalUnits={originalUnits}
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

          <Flex justify="center">
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleSubmit}>
                Update
              </Button>
            </Space>
          </Flex>
        </Form>
      </Flex>
    </div>
  );
};

export default EditItem;
