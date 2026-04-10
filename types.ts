
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
  sellerEmail?: string;
  category: string;
  createdAt: number;
  views?: number;
  clicks?: number;
  isPremium?: boolean;
  expiryDate?: number;
}

export interface AppSettings {
  premiumPrice: number;
  freeDurationDays: number;
  premiumDurationDays: number;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  danaNumber: string;
  ovoNumber: string;
  gopayNumber: string;
}

export type ViewType = 'visitor' | 'admin' | 'favorites' | 'search' | 'profile';

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
  sellerEmail?: string;
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
  isPremium?: boolean;
  paymentMethod?: string;
  paymentProof?: string;
}

export interface UserRecord {
  sub: string;
  email: string;
  name: string;
  picture: string;
  firstLogin: number;
  lastLogin: number;
}
