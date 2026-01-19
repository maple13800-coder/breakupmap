export interface Location {
  lat: number;
  lng: number;
}

export interface Story {
  id: string;
  location: Location;
  content: string;
  createdAt: number;
  likes: number; // Just a warm touch, though we might not fully implement incrementing in this MVP
}

export type ModalMode = 'CREATE' | 'READ' | 'CLOSED';
