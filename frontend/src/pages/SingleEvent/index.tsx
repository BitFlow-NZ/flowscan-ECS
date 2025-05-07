import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventViewPDF from '../../components/EventViewPDF';
import { getEventById } from '@/services/ant-design-pro/api';
import { message, Modal } from 'antd';
import { PDFViewer } from '@react-pdf/renderer';
import { history } from '@umijs/max';

const SingleEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClose = () => {
    history.push('/events');
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await getEventById(Number(id));

        if (response?.success) {
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
        message.error('An error occurred while fetching event details.');
      }
    };

    if (id) {
      fetchEventData();
    }
  }, [id]);

  return (
    <div>
      <Modal
        title="Event Export"
        open={isModalVisible}
        onCancel={handleClose}
        footer={null}
        width={800}
      >
        {selectedEvent && (
          <PDFViewer style={{ width: '100%', height: '500px' }}>
            <EventViewPDF eventData={selectedEvent} />
          </PDFViewer>
        )}
      </Modal>
    </div>
  );
};

export default SingleEvent;
