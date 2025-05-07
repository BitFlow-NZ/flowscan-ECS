export default {
  'GET /api/Event/:id': {
    success: true,
    data: {
      eventItems: [
        {
          id: 1,
          item: {
            id: 1,
            name: 'COTTON APPLICATOR 15CM',
            barcode: null,
            description: 'description of COTTON APPLICATOR 15CM',
            img: 'https://s2.loli.net/2024/12/03/mcKlnifJC7RbHoF.jpg',
          },
          unit: {
            id: 1,
            name: 'pack',
            img: 'https://s2.loli.net/2024/12/03/mcKlnifJC7RbHoF.jpg',
          },
          editTime: '2024-12-13 16:11:24',
          quantity: 1,
          units: [
            {
              id: 1,
              name: 'pack',
              img: 'https://s2.loli.net/2024/12/03/k1tnKq9zIZb7UoR.jpg',
              itemId: 1,
            },
            {
              id: 2,
              name: 'Box',
              img: 'https://s2.loli.net/2024/12/03/k1tnKq9zIZb7UoR.jpg',
              itemId: 1,
            },
          ],
        },
        {
          id: 2,
          item: {
            id: 2,
            name: 'Air Injection & Irrigation Cannula',
            barcode: '18906025963094',
            description: 'description of Air Injection & Irrigation Cannula',
            img: 'https://s2.loli.net/2024/12/03/k1tnKq9zIZb7UoR.jpg',
          },
          unit: {
            id: 2,
            name: 'Box',
            img: 'https://s2.loli.net/2024/12/03/k1tnKq9zIZb7UoR.jpg',
          },
          editTime: '2024-12-13 16:11:24',
          quantity: 2,
          units: [
            {
              id: 1,
              name: 'pack',
              img: 'https://s2.loli.net/2024/12/03/k1tnKq9zIZb7UoR.jpg',
              itemId: 2,
            },
            {
              id: 2,
              name: 'Box',
              img: 'https://s2.loli.net/2024/12/03/k1tnKq9zIZb7UoR.jpg',
              itemId: 2,
            },
          ],
        },
        {
          id: 3,
          item: {
            id: 3,
            name: 'APPLICATOR 7.5CM SINGLE-ENDED',
            barcode: null,
            description: 'description of APPLICATOR 7.5CM SINGLE-ENDED',
            img: 'https://s2.loli.net/2024/12/03/UzSwDJQevNIpX4q.jpg',
          },
          unit: {
            id: 3,
            name: 'pack',
            img: 'https://s2.loli.net/2024/12/03/UzSwDJQevNIpX4q.jpg',
          },
          editTime: '2024-12-13 16:11:24',
          quantity: 3,
          units: [
            {
              id: 1,
              name: 'string',
              img: 'string',
              itemId: 3,
            },
            {
              id: 2,
              name: 'box',
              img: 'string',
              itemId: 3,
            },
            {
              id: 3,
              name: 'pack',
              img: 'string',
              itemId: 3,
            },
          ],
        },
      ],
      event: {
        time: '2024-12-13 16:11:24',
        lastEditTime: '2024-12-13 16:11:24',
        id: 1,
        name: 'Surgery 1',
        doctorName: 'Doctor',
        patientName: 'Patient',
        theaterNumber: 'Theater1',
        lastEditPerson: 'Doctor',
      },
    },
    message: 'Success',
  },
};