import { Footer } from '@/components';
import type { RunTimeLayoutConfig } from '@umijs/max';
// import { history } from '@umijs/max';
import React, { useEffect } from 'react';
import { errorConfig } from './requestErrorConfig';
const logo =
  'https://bitflow-image-upload.s3.ap-southeast-2.amazonaws.com/user+manual+/IconLogo.jpg';

// const isDev = process.env.NODE_ENV === 'development';
// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }: any) => {
  return {
    logo,
    // actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    actionRender: () => <></>,
    footerRender: () => <Footer />,
    // onPageChange: () => {
    //   const { location } = history;
    // },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
