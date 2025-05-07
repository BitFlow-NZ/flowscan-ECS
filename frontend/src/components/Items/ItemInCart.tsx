import React from 'react';
import { Button, Card, Select, Popover } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Item } from '../../type';

interface ItemInCartProps {
  cart: Item[];
  removeFromCart: (itemKey: string) => void;
  updateQuantity: (itemKey: string, newQuantity: number) => void;
  updateUnit: (itemKey: string, newUnitId: number) => void;
}

const { Option } = Select;

const ItemInCart: React.FC<ItemInCartProps> = ({
  cart,
  removeFromCart,
  updateQuantity,
  updateUnit,
}) => {
  return (
    <div>
      {cart.map((item) => (
        <Card
          key={item.key}
          style={{
            width: '100%',
            marginTop: '10px',
            borderRadius: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* Image and Details Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flex: 1,
              }}
            >
              <div>
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <p
                  style={{
                    margin: '5px 0 0 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.5',
                    maxHeight: '3em',
                    fontSize: '14px',
                    color: '#555',
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>

            {/* Quantity Control */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Button
                onClick={() => updateQuantity(item.key, Math.max(item.quantity - 1, 1))}
                size="small"
              >
                -
              </Button>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.quantity}</span>
              <Button onClick={() => updateQuantity(item.key, item.quantity + 1)} size="small">
                +
              </Button>
            </div>

            {/* Unit Selection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Select
                value={item.selectedUnit ? item.selectedUnit.id : undefined}
                onChange={(value) => updateUnit(item.key, value)}
                style={{ width: 120 }}
              >
                {item.units.map((unit) => (
                  <Option key={unit.id} value={unit.id}>
                    {unit.name}
                  </Option>
                ))}
              </Select>

              {/* Popover for Unit Image */}
              <Popover
                content={
                  item.selectedUnit ? (
                    <img
                      src={item.selectedUnit.img}
                      alt={item.selectedUnit.name}
                      style={{
                        display: 'block',
                        margin: '0 auto', // Center horizontally
                        width: '100px',
                        height: '80px',
                      }}
                    />
                  ) : (
                    'No unit selected'
                  )
                }
                title={item.selectedUnit?.name || 'Unit Image'}
                overlayStyle={{ maxWidth: '150px' }}
              >
                <QuestionCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
              </Popover>
            </div>

            {/* Remove Button */}
            <div
              style={{
                fontSize: '12px',
                alignSelf: 'start',
                cursor: 'pointer',
              }}
            >
              <DeleteOutlined onClick={() => removeFromCart(item.key)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ItemInCart;
