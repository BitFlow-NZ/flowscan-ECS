import React from 'react';
import { Button, Card, Space} from 'antd';
import { Item } from '../../type';

interface AddItemCardProps {
  items: Item[]; // Array of Item objects
  addToCart: (item: Item) => void; // Function to handle adding an item to the cart
}

// Component to render a single item as a card
const AddItemCard: React.FC<AddItemCardProps> = ({ items, addToCart }) => {
  // const defaultUnit = {items.map((item) => (item.units.find((unit) => unit.id === item.defaultUnitId))}

  return (
    <div>
      {items.map((item) => {
        const defaultUnit = item.units.find((unit) => unit.id === item.defaultUnitId);
        return (
          <Card key={item.id} style={{ width: '100%', marginTop: '10px', position: 'relative' }}>
            {item.confidence !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 12,
                  fontSize: '12px',
                  color: 'green',
                  fontWeight: 500,
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
              >
                Confidence: {item.confidence}%
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px',
              }}
            >
              {/* Left Section: Image and Details */}
              <Space align="start" size="large">
                <div>
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h3>{item.name}</h3>
                  <p
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2, // Limit text to 2 lines
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.5',
                      maxHeight: '3em',
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </Space>

              {/* Right Section: Button */}
              <Button
                type="primary"
                style={{
                  alignSelf: 'center',
                  marginLeft: '10px',
                }}
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </Button>
            </div>

            {defaultUnit && (
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '12px',
                  color: '#888',
                  textAlign: 'right',
                }}
              >
                Default Unit: <strong>{defaultUnit.name}</strong>{' '}
                <Button
                  type="link"
                  style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: '#888',
                  }}
                  onClick={() => addToCart(item)}
                >
                  Add item with different unit &gt;&gt;
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
export default AddItemCard;
