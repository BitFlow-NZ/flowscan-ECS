let mockData = {
  success: true,
  data: {
    items: [
      {
        units: [
          {
            id: 1000001,
            name: 'Box',
            img: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/f5a26c491e4d48199ab116a69a969be3.jpg',
          },
        ],
        ocrItems: [
          {
            id: 1000001,
            ocrKeyword:
              'Rx Bevacizumab Injection pimg Avastin TM 400 mg/16 ml 1 vial of 16 ml of concentrate for solution for infusion Roche',
            unitName: 'box',
          },
        ],
        id: 1000001,
        name: 'Avastin 400mg Injection',
        lastEditTime: '2025-01-15T05:31:15.097Z',
        description:
          'Composition: Bevacizumab (400mg) Uses:  Cancer of colon and rectum Non-small cell lung cancer Kidney cancer Brain tumor Ovarian cancer Cervical cancer',
        img: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/f5a26c491e4d48199ab116a69a969be3.jpg',
      },
      {
        units: [
          {
            id: 1000002,
            name: 'Box',
            img: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/wy2y9bdipmh6rgkrj0zm.jpg',
          },
        ],
        ocrItems: [
          {
            id: 1000002,
            ocrKeyword:
              'AMOXYCILLIN AND POTASSIUM Mfg. Lic. No.: KTK/28/418/2014 SCHEDULE H PRESCRIPTION CLAVULANATE TABLETS IP DRUG - CAUTION AUGMENTIN 625 DUO Not to be sold by retail without the prescription of a Registered Medical Co-amoxiclav Practitioner Manufactured by: Medreich Limited Survey No. 14 & 15, Gundarahali Village, Sulbele Hobli, Hoskote Taluk Bangalore Rural District 562 114 Marketed by: GlaxoSmithKline Pharmaceuticals Limited, Regd. Office Dr. Annie Besant Road Worli, Mumbai 400 030 Information for Registered medical practitioners: For latest Prescribing Information visit www.gsk-india.com/ product-prescribing-information.asp OR scan QR code provided in the pack. QR code reader can be downloaded using smart phone. :',
          },
        ],
        id: 1000002,
        name: 'Augmentin 625 Duo Tablet',
        lastEditTime: '2025-01-15T05:31:15.097Z',
        description:
          'Composition: Amoxycillin  (500mg) +  Clavulanic Acid (125mg) Uses: Treatment of Bacterial infections',
        img: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/wy2y9bdipmh6rgkrj0zm.jpg',
      },
      {
        units: [
          {
            id: 1000003,
            name: 'Box',
            img: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/cropped/kqkouvaqejbyk47dvjfu.jpg',
            ocrItems: [
              {
                id: 1000003,
                ocrKeyword:
                  'Timg 6x6x5 Tablets Azithromycin Tablets IP 500 mg Azithral-500 Alembic',
              },
            ],
          },
        ],
        id: 1000003,
        name: 'Azithral 500 Tablet',
        lastEditTime: '2025-01-15T05:31:15.097Z',
        description: 'Composition: Azithromycin (500mg) Uses: Treatment of Bacterial infections',
        img: 'https://onemg.gumlet.io/l_watermark_346,w_480,h_480/a_ignore,w_480,h_480,c_fit,q_auto,f_auto/cropped/kqkouvaqejbyk47dvjfu.jpg',
      },
      
    ],
    total: 3,
  },
};
           
   export default {
     'GET /api/Item': (req: any, res: any) => {
       res.send(mockData);
     },

    'DELETE /api/Item/:id': (req: any, res: any) => {
  const { id } = req.params;
  const itemId = parseInt(id, 10); 
  console.log('Delete Request ID:', itemId);

  const index = mockData.data.items.findIndex((item) => item.id === itemId);

  if (index !== -1) {
    mockData.data.items.splice(index, 1); 
    mockData.data.total = mockData.data.items.length; 
    res.send({ success: true });
  } else {
    console.error('Item not found:', itemId);
    res.status(404).send({ success: false, message: 'Item not found' });
  }
},


     'POST /api/Item': (req: any, res: any) => {
       const newItem = { ...req.body, id: mockData.data.total + 1 };
       mockData.data.items.push(newItem);
       mockData.data.total += 1;
       res.send({ success: true, data: newItem });
     },

     'PUT /api/Item': (req:any, res:any) => {
       const updatedItem = req.body;
     console.log('Received Request:', updatedItem);

  

       if (updatedItem ) { 
         res.send({
           success: true,
           message: 'Item updated successfully',
           data: {
              event: updatedItem,
           },
         });
       } else {
         res.status(400).send({
           success: false,
           message: 'Invalid Item data',
         });
       }
     },

     'GET /api/Item/:id': (req: any, res: any) => {
       const { id } = req.params;
       const itemId = parseInt(id, 10);
       const item = mockData.data.items.find((item) => item.id === itemId);

       if (item) {
         res.send({ success: true, data: item });
       } else {
         res.status(404).send({ success: false, message: 'Item not found' });
       }
     },
   };