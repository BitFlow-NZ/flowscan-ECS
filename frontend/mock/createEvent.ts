// mock/event.ts

export default {
  'POST /api/Event': (req:any, res:any) => {
    const { event, eventItems } = req.body;

    if (!event || !event.name || !event.time || !event.doctorName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields in event data.',
      });
    }

    if (!eventItems || !Array.isArray(eventItems) || eventItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Event items must be provided and should be an array.',
      });
    }

    const mockEventId = Math.floor(Math.random() * 1000); 
    const responseData = {
      success: true,
      message: 'Event created successfully.',
      data: {
        eventId: mockEventId,
        ...event,
        eventItems: eventItems.map((item, index) => ({
          ...item,
          eventId: mockEventId,
          itemId: item.itemId || index + 1, 
        })),
      },
    };

    console.log('Mock Event Data:', responseData);

    return res.status(200).json(responseData);
  },
};
