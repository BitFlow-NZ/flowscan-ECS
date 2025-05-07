import { history } from '@umijs/max';
import { Button, Space } from 'antd';
import * as React from 'react';

const Footer: React.FC = () => {
  return (
    <Space style={{ display: 'flex', justifyContent: 'center', color: '#aaa' }}>
      <Button type="link" style={{ color: '#aaa' }} onClick={() => history.push('/member')}>
        Team BitFlow
      </Button>
      /
      <Button
        type="link"
        style={{ color: '#aaa' }}
        onClick={() => (location.href = 'https://www.ictgraduateschool.ac.nz/')}
      >
        Auckland ICT Graduate School
      </Button>
    </Space>
  );
};

export default Footer;
