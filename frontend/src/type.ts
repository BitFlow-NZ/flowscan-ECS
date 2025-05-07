// Unit type for an item's unit details
export interface Unit {
  id?: number | null;
  name: string;
  img?: string;
}

// Item type for products
export interface Item {
  key: string;
  id: number;
  name: string;
  img: string;
  description: string;
  defaultUnitId: number | null;
  barcode: string | null;
  qrcode: string | null;
  units: Unit[];
  quantity: number;
  selectedUnit: Unit | null;
}

export interface GlobalValue {
  evtName: string;
  doctorName: string;
  patientName: string;
  eventTime: string;
  theaterNumber: string;
  editorName: string;
}

export interface EditEventData extends GlobalValue {
  id: number;
}

export interface AddNewItem {
  name: string;
  description: string;
  img: string;
  units: Unit[];
  ocrItems: Keyword[];
}

export type Keyword = {
  ocrKeyword: string;
  unitName: string | null;
};

// Properly extend the global Window interface
declare global {
  interface Window {
    ENV?: {
      REACT_APP_IMG_URL?: string;
      REACT_APP_API_URL?: string;
      REACT_APP_ENV?: string;
      REACT_APP_AWS_REGION?: string;
      REACT_APP_AWS_BUCKET_NAME?: string;
    };
  }
}

// Make TypeScript export declarations from this file
export {};
