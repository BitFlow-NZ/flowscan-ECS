export default {
  'POST /api/Img/extract-text': (req: any, res: any) => {
    res.send({
      success: true,
      data: 'This is a mocked OCR result.', 
      message: 'Success',
    });
  },
};
