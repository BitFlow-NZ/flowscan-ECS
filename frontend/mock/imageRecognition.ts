export default {
  'post /api/Img/recognize': {
    success: true,
    data: [
      {
        id: 5,
        name: 'Dry SEALED EDGE EYE PAD',
        description: 'description of SEALED EDGE EYE PAD',
        img: 'https://s2.loli.net/2024/12/03/NVk1oX9gIfqpuPb.jpg',
        lastEditTime: '2025-05-18T01:44:48.050Z',
        defaultUnitId: 4,
        units: [
          {
            id: 4,
            name: 'pack',
            img: 'https://s2.loli.net/2024/12/03/NVk1oX9gIfqpuPb.jpg',
            itemId: 5,
          },
        ],
        confidence: 92.35, // 百分比格式
      },
      {
        id: 6,
        name: 'Sample BANDAGE',
        description: 'description of BANDAGE',
        img: 'https://s2.loli.net/2024/12/03/NVk1oX9gIfqpuPb.jpg',
        lastEditTime: '2025-05-18T01:45:00.000Z',
        defaultUnitId: 6,
        units: [
          {
            id: 6,
            name: 'box',
            img: 'https://s2.loli.net/2024/12/03/NVk1oX9gIfqpuPb.jpg',
            itemId: 6,
          },
        ],
        confidence: 87.12,
      },
    ],
    message: 'Success',
  },
};
