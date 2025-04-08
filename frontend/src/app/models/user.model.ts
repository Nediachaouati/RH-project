export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: 'ADMIN' | 'CANDIDAT' | 'RH'; // Match the Role enum from the backend
  phoneNumber?: string;
  address?: string;
  birthDate?: Date;
  specialty?: string;
  school?: string;
  degree?: string;
  graduationYear?: string;
  experienceLevel?: string;
  photo?: string; // For profile image
  created_at: Date;
  updated_at: Date;
}