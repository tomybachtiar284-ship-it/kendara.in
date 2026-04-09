
export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  condition: 'Mulus' | 'Standar' | 'Modifikasi';
  images: string[];
  description: string;
  status: 'Tersedia' | 'Terjual';
  location: string;
  sellerPhone: string;
  category: string;
  createdAt: number;
}

export type ViewType = 'visitor' | 'admin' | 'favorites' | 'search';

export interface AdminCredentials {
  username: string;
  isAuthenticated: boolean;
}
