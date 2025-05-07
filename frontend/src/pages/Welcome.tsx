import { CameraOutlined, PlusSquareOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Breadcrumb, Card, theme, Space } from 'antd';
import { Button } from 'antd/lib';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  btn?: React.Element;
}> = ({ title, index, desc, btn }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          // textAlign: 'justify',
          lineHeight: '22px',
        }}
      >
        {desc}
      </div>
      {btn && <div style={{marginTop: 28, marginBottom: 10, display: 'flex', justifyContent: 'center'}}>{btn}</div>}
      </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <>
      <Breadcrumb items={[{ title: 'Welcome' }]} style={{ marginBottom: 30 }} />
      <Card
        style={{
          borderRadius: 8,
        }}
        styles={{
          body: {
            backgroundImage:
              initialState?.settings?.navTheme === 'realDark'
                ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
          },
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            // backgroundImage:
            // "url('https://www.google.com/url?sa=i&url=https%3A%2F%2F616pic.com%2Fimage%2Fshoushu.html&psig=AOvVaw0b0j4lqnXCMcrFSXaeTYzF&ust=1734658873732000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOjj5sbasooDFQAAAAAdAAAAABAI')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            Welcome to FLOWSCAN produced by BitFlow
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              // width: '65%',
            }}
          >
            FLOWSCAN is a solution combining image recognition and surgical workflow
            tools. <br />
            Based on pharmaceutical safety and workflow standards, it streamlines medication
            documentation in surgical environments.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              title="Image Recognition"
              desc="Image recognition use OCR technology to capture and record surgical medications quickly and accurately."
              btn={
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={() => {
                    history.push('/scan');
                  }}
                >
                  Quick Scan
                </Button>
              }
            />
            <InfoCard
              index={2}
              title="Surgical Events"
              desc="A comprehensive surgical event management system designed to document procedures and track medication use efficiently."
              btn={
                <Space style={{display: 'flex'}}>
                  <Button
                    type="default"
                    //style={{ marginRight: '5px' }}
                    icon={<TableOutlined />}
                    onClick={() => {
                      history.push('/events');
                    }}
                  >
                    Event List
                  </Button>
                  <Button
                    type="default"
                    icon={<PlusSquareOutlined />}
                    onClick={() => {
                      history.push('/create-new-event');
                    }}
                  >
                    Create New Event
                  </Button>
                </Space>
              }
            />
            <InfoCard
              index={3}
              title="Product Database"
              desc="A standardized medical product database built on GS1 standards, offering quick identification and verification of pharmaceutical products."
              btn={
                <Space style={{display: 'flex'}}>
                <Button
                //  disabled
                  type="default"
                  icon={<UnorderedListOutlined />}
                  onClick={() => {
                    history.push('/items');
                  }}
                >
                  Item List
                </Button>
                <Button
                    type="default"
                    icon={<PlusSquareOutlined />}
                    onClick={() => {
                      history.push('/create-new-item');
                    }}
                    //style={{ marginLeft: '5px'}}
                  >
                    Create New Item
                </Button>
                  </Space>
              }
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default Welcome;
