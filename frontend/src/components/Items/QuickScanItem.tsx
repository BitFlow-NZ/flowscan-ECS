import React from 'react';
import { Card, Space } from 'antd';
import { Item } from '../../type';

interface AddItemCardProps {
  items: Item[]; // Array of Item objects

}

// Component to render a single item as a card
const AddItemCard: React.FC<AddItemCardProps> = ({ items}) => {
  console.log("items",items)
  return (
    <div>
      {items.map((item) => (
        console.log("item",item),
        console.log(item.id),
        console.log(item.name),
        console.log(item.description),
        console.log(item.img),
        <Card key={item.id} style={{ width: '100%', marginTop: '10px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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

           
          </div>
        </Card>
      ))}
    </div>
  );
};
export default AddItemCard;
