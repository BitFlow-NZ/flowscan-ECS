// mock/event.ts

export default {
  'PUT /api/Event': (req:any, res:any) => {
    const { event, eventItems } = req.body;

  
    if (event && event.id) {
      res.send({
        success: true,
        message: 'Event updated successfully',
        data: {
          event,
          eventItems,
        },
      });
    } else {
      res.status(400).send({
        success: false,
        message: 'Invalid event data',
      });
    }
  },
};
