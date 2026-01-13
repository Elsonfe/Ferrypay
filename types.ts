
export type Role = 'EMPLOYER' | 'CONTRACTOR';

export interface User {
  id: string;
  name: string;
  role: Role;
  username: string;
}

export interface Project {
  id: string;
  title: string;
  totalValue: number;
  contractorId: string;
  startDate: string;
  description: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  description: string;
  status: 'COMPLETED' | 'PENDING';
}

export interface MaterialRequest {
  id: string;
  itemName: string;
  quantity: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'ORDERED' | 'RECEIVED';
  requestDate: string;
}

export interface WorkLog {
  id: string;
  content: string;
  date: string;
  authorId: string;
  photos: string[]; // base64 strings
}

export interface PayrollRequest {
  id: string;
  weekEnding: string;
  amount: number;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'PAID';
}
