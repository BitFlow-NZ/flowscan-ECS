import React, { useState } from 'react';
import { Breadcrumb, Button, Form, Input, Modal, Radio, Table, message } from 'antd';
import { PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { getEvtList, deleteEvt, getEventById } from '@/services/ant-design-pro/api';
import moment from 'moment';
import { PDFViewer } from '@react-pdf/renderer';
import EventViewPDF from '../../components/EventViewPDF';

interface SeearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  startTime?: string;
  endTime?: string;
}
enum TimeChoice {
  ALL,
  DAY,
  WEEK,
  MONTH,
}
const transTimeChoice2Period = (val: TimeChoice) => {
  let [startTime, endTime]: [string?, string?] = [undefined, undefined];
  if (val !== TimeChoice.ALL) {
    endTime = moment().format('YYYY-MM-DD');
    switch (val) {
      case TimeChoice.DAY:
        startTime = moment().subtract(1, 'days').format('YYYY-MM-DD');
        break;
      case TimeChoice.MONTH:
        startTime = moment().subtract(1, 'months').format('YYYY-MM-DD');
        break;
      case TimeChoice.WEEK:
        startTime = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
        break;
    }
  }
  return { startTime, endTime };
};


const TableList: React.FC = () => {
  const [dataSource, setDataSource] = React.useState([]);

  const handleEditEvent = (eventId: number) => {
    history.push(`/events/${eventId}/edit`);
  };

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleExport = async (eventId: number) => {
    try {
      const response = await getEventById(eventId);

      if (response.success) {
        const { event, eventItems } = response?.data || { event: {}, eventItems: [] };
        const exportData = {
          ...event,
          eventItems: (eventItems || []).map((item: any) => ({
            itemName: item?.item?.name || 'N/A',
            quantity: item?.quantity || 0,
            unitName: item?.unit?.name || 'N/A',
          })),
        };
        console.log('Export Data:', exportData);
        setSelectedEvent(exportData);
        setIsModalVisible(true);
      } else {
        message.error('Failed to load event details.');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      message.error('An error occurred. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Event Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Doctor Name',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Editor Name',
      dataIndex: 'lastEditPerson',
      key: 'lastEditPerson',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Theater Number',
      dataIndex: 'theaterNumber',
      key: 'theaterNumber',
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 300,
      render: (_: unknown, record: any) => (
        <div>
          <Button type="link" onClick={() => handleExport(record.id)}>
            View/Export
          </Button>
          <Button type="link" onClick={() => handleEditEvent(record.id)}>
            Edit
          </Button>
          <Button
            type="link"
            style={{ color: '#F00' }}
            onClick={() =>
              Modal.confirm({
                content: `Are your sure to delete event ${record.name}?`,
                onOk: async () => {
                  const res = await deleteEvt(record.id);
                  if (!res.success) return;
                  message.success(`Delete ${record.name} success!`);
                  await loadEvtList({ ...filters, page, pageSize });
                },
              })
            }
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    async function run() {
      const res = await loadEvtList({ page: 1, pageSize, ...filters });
    }
    run();
  }, []);

  const [loading, setLoading] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(10);
  const [page, setPage] = React.useState(1);
 
  const [filters, setFilters] = React.useState({
    search: undefined,
    startTime: undefined,
    endTime: undefined,
  } as { search?: string; startTime?: string; endTime?: string });

  const [total, setTotal] = React.useState(0);
  const loadEvtList = async (v: SeearchParams) => {
    setLoading(true);
    const res = await getEvtList(v);
    setLoading(false);
    setDataSource(res?.data?.eventList);
    setTotal(res?.data?.total);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: 'Event List',
          },
        ]}
        style={{ marginBottom: 30 }}
      />

      {/* PDF Preview*/}
      <Modal
        title="Event Export"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedEvent && (
          <PDFViewer style={{ width: '100%', height: '500px' }}>
            <EventViewPDF eventData={selectedEvent} />
          </PDFViewer>
        )}
      </Modal>

      <Form
        layout="inline"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px', // Spacing between elements
          marginBottom: 20,
        }}
        onFinish={async (value) => {
          const f = { search: value.search, ...transTimeChoice2Period(value.evtTime) };
          setFilters(f);
          await loadEvtList({ page: 1, pageSize, ...f });
          setPage(1);
        }}
      >
        <Form.Item
          name="search"
          label="Keywords search"
          style={{
            flex: '1 1 250px',
            minWidth: '200px',
          }}
        >
          <Input placeholder="Event, doctor or patient name" />
        </Form.Item>
        <Form.Item
          name="evtTime"
          label="Event time"
          style={{
            flex: '1 1 auto',
            minWidth: '250px',
          }}
        >
          <Radio.Group defaultValue={TimeChoice.ALL} style={{ flexWrap: 'wrap' }}>
            <Radio.Button value={TimeChoice.ALL}>All</Radio.Button>
            <Radio.Button value={TimeChoice.DAY}>Last day</Radio.Button>
            <Radio.Button value={TimeChoice.WEEK}>Last week</Radio.Button>
            <Radio.Button value={TimeChoice.MONTH}>Last month</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          style={{
            flex: '0 1 auto',
            marginLeft: 0,
          }}
        >
          <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
        <Form.Item
          style={{
            flex: '0 1 auto',
            marginRight: 'auto',
          }}
        >
          <Button icon={<PlusSquareOutlined />} onClick={() => history.push('/create-new-event')}>
            Create New Event
          </Button>
        </Form.Item>
      </Form>
      <Table
        bordered
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          onChange: (page, pageSize) => {
            loadEvtList({ ...filters, page, pageSize });
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

export default TableList;
