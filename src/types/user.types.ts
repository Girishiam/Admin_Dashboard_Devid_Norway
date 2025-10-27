export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isActive: boolean;
}

export interface Administrator extends UserProfile {
  permissions: string[];
  department: string;
}
