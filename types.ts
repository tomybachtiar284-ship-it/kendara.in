
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
  views?: number;
  clicks?: number;
}

export type ViewType = 'visitor' | 'admin' | 'favorites' | 'search';

export interface AdminCredentials {
  username: string;
  isAuthenticated: boolean;
}

export interface PendingSubmission {
  id: string;
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  // Seller info
  sellerName: string;
  sellerPhone: string;
  // Vehicle info
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  condition: 'Mulus' | 'Standar' | 'Modifikasi';
  category: string;
  location: string;
  description: string;
  images: string[];
  views?: number;
  clicks?: number;
}
