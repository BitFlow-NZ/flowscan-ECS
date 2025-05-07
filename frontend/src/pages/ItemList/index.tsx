import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Form, Modal, Table, message, Input } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { getItemList, deleteItem, getEventItem } from '@/services/ant-design-pro/api';
import moment from 'moment';

interface SearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

const ItemList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = React.useState([]);

  const [filters, setFilters] = useState({
    search: undefined,
  } as { search?: string });

  const loadItemList = async (v: SearchParams) => {
    setLoading(true);
    const res = await getItemList(v);
    setLoading(false);
    setDataSource(res?.data?.items);
    setTotal(res?.data?.total);
  };

  // check if item is referenced in any event
  const isItemReferenced = async (itemId: number): Promise<boolean> => {
    try {
      const res = await getEventItem();
      console.log('Event Item:', res);
      if (res.success===true) {
        const events = Array.isArray(res.data) ? res.data : [];

        const referenced = events.some((event: any) => event.item?.id === itemId);
        return referenced;
      }
      message.error(res.message || 'Failed to fetch event list.');
      return false;
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('An error occurred while checking references.');
      return false;
    }
  };

  const handleDelete = async (itemId: number) => {
    const isReferenced = await isItemReferenced(itemId);
    if (isReferenced) {
      message.error('This item is referenced by an event and cannot be deleted.');
      return;
    }

    try {
      const res = await deleteItem(itemId);
      if (res.success===true) {
        message.success('Delete success!');
        await loadItemList({ ...filters, page, pageSize });
      } else {
        message.error(res.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      message.error('An error occurred while deleting the item.');
    }
  };

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created Time',
      dataIndex: 'lastEditTime',
      key: 'lastEditTime',
      render: (text: string | undefined | null) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-';
      },
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 180,
      render: (_: unknown, record: any) => (
        <div>
          <Button type="link" onClick={() => history.push(`/items/${record.id}/edit`)}>
            Edit
          </Button>
          <Button
            type="link"
            style={{ color: '#F00' }}
            onClick={() =>
              Modal.confirm({
                content: `Are your sure to delete item ${record.name}?`,
                onOk: () => handleDelete(record.id),
              })
            }
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  const { Search } = Input;

  useEffect(() => {
    loadItemList({ page: 1, pageSize, ...filters });
  }, []);

  console.log('Data Source:', dataSource);
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: 'Item List',
          },
        ]}
        style={{ marginBottom: 30 }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <Form layout="inline" style={{ display: 'flex', gap: '5px', width: '100%' }}>
          <Form.Item style={{ flex: 1, maxWidth: '400px', minWidth: '200px' }}>
            <Search
              placeholder="Search by Name or Description"
              allowClear
              enterButton
              onSearch={async (value) => {
                const f = { search: value };
                setFilters(f);
                await loadItemList({ page: 1, pageSize, ...f });
                setPage(1);
              }}
            />
          </Form.Item>
          {/* <Form.Item>
            <Button onClick={handleReset}>All</Button>
          </Form.Item> */}
        </Form>

        <Button
          // type="primary"
          icon={<PlusSquareOutlined />}
          style={{ marginLeft: 'auto' }}
          onClick={() => history.push('/create-new-item')}
        >
          Add New Item
        </Button>
      </div>

      <Table
        bordered
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          onChange: (page, pageSize) => {
            loadItemList({ ...filters, page, pageSize });
            setPageSize(pageSize);
            setPage(page);
          },
          pageSize,
          current: page,
          total,
          simple: true,
        }}
      />
    </>
  );
};

export default ItemList;
