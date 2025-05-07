import React, { useState } from 'react';
import { Flex, Breadcrumb, Typography, Empty } from 'antd';
import TakePicture from '../../components/TakePicture';
import SearchItem from '../../components/SearchItem';
import { Item } from '../../type';

import QuickScanItem from '../../components/Items/QuickScanItem';

const { Title } = Typography;

const QuickScan: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Item[]>([]);

  return (
    <div>
      <div>
        <Breadcrumb items={[{ title: 'Quick Scan' }]} style={{ marginBottom: 30 }} />
      </div>
      <Flex vertical>
        <Flex style={{ width: '100%', flexGrow: 1, maxWidth: 1300 }}>
          <Flex vertical style={{ marginRight: 'auto', width: 600 }}>
            <div>
              <Title level={5}>Image Camera</Title>
              <TakePicture
                onRecognitionSuccess={(recognizedItems: Item[]) =>
                  
                  setSearchResults(recognizedItems)
                }
              />
            </div>
          </Flex>
          <Flex vertical style={{ width: '100%', marginLeft: 40, maxWidth: 600 }}>
            <Title level={5}>Search Item</Title>
            <div>
              <SearchItem onSearchResults={setSearchResults} />
            </div>
            <div>
              {!(searchResults && searchResults.length > 0) ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <QuickScanItem items={searchResults} />
              )}
            </div>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default QuickScan;
