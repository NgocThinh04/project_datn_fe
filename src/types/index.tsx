
export interface LoginRequest {
  username: string;
  password: string;
  companyCode: string;
}

export interface RegisterCompanyRequest {
  username: string;
  email: string;
  password: string;
  nameCompany: string;
  address: string;
  numberPhone: string;
}

// Response types
export interface LoginResponse {
  token: string;
  email: string;
  message: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  companyCode?: string;
}

export interface User {
  userId: string;
  name: string;
  userName: string;
  email: string;
  role: string;
  address?: string;
  number?: string;
}

export interface Company {
  companyId: string;
  name: string;
  address: string;
  companyCode: string;
  createAt: string;
}