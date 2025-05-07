// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

//get events
export async function getEvtList(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/Event', {
    method: 'GET',
    params: {
      ...(options || {}),
    },
  });
}

//get event items
export async function getEventItem(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/EventItem', {
    method: 'GET',
    params: {
      ...(options || {}),
    },
  });
}

//get event by id
export async function getEventById(eventId: number) {
  return request<Record<string, any>>(`/api/Event/${eventId}`, {
    method: 'GET',
  });
}

//delete event
export async function deleteEvt(id: number) {
  return request<Record<string, any>>(`/api/Event/${id}`, {
    method: 'DELETE',
  });
}

// image recognition
export async function imageRecognition(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/Img/recognize', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
    skipErrorHandler: true,
  });
}

//Search Items by name

export async function searchItem(name: string) {
  return request<Record<string, any>>(`/api/Item/search`, {
    method: 'GET',
    params: { name },
  });
}

//submit event
export async function createEvent(eventData: {
  event: {
    name: string;
    time: string;
    doctorName: string;
    patientName: string;
    theaterNumber: string;
    lastEditPerson: string;
  };
  eventItems: {
    quantity: number;
    itemId: number;
    unitId: number | null;
  }[];
}) {
  return request<Record<string, any>>('/api/Event', {
    method: 'POST',
    data: eventData,
  });
}

// edit event
export async function updateEvent(eventData: any) {
  return request<Record<string, any>>('/api/Event', {
    method: 'PUT',
    data: eventData,
  });
}

//get Items
export async function getItemList(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/Item', {
    method: 'GET',
    params: {
      ...(options || {}),
    },
  });
}

//delete Item
export async function deleteItem(id: number) {
  return request<Record<string, any>>(`/api/Item/${id}`, {
    method: 'DELETE',
  });
}

//Orc Keywords

export async function OCRKeywords(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/Img/extract-text', {
    method: 'POST',
    data: {
      ...(options || {}),
    },
    skipErrorHandler: true,
  });
}

//create new Item

export async function createItem(data: any) {
  return request('/api/Item', { method: 'POST', data });
}

// edit item
export async function updateItem(itemData: any) {
  return request<Record<string, any>>('/api/Item', {
    method: 'PUT',
    data: itemData,
  });
}

export async function getItemById(id: string) {
  return request(`/api/Item/${id}`, {
    method: 'GET',
  });
}


// export async function recognizeBarcode(options?: { type: string; content: string }) {
//   return request('/api/BarCode/recognize', {
//     method: 'POST',
//     data: options,
//     skipErrorHandler: true,
//   });
// }

export async function recognizeBarcode(options?: { type: string; content: string }) {
  try {
    const response = await request('/api/BarCode/recognize', {
      method: 'POST',
      data: options,
      skipErrorHandler: true,
    });

    return {
      success: true,
      data: response.data,
      message: response.message || 'Item found',
    };
  } catch (error: any) {
  
    // console.error('Barcode recognition error:', error);

    return {
      success: false,
      data: null,
      message:
        error?.data?.message ||
        error?.response?.data?.message || 
        'Scan failed. Try capturing an image.',
    };
  }
}

