export interface LoginRequest {
  username: string;
  password: string;
  companyCode?: string; // Optional vì có thể không cần cho user thường
}

export interface RegisterCompanyRequest {
  username: string;
  email: string;
  password: string;
  nameCompany: string;
  address: string;
  numberPhone: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  numberPhone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  address?: string;
  number_phone?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Response types
export interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: string;
  companyId: string;
  companyCode: string;
  email: string;
  address: string;
  number_phone: string;
  create_at: string;
  message: string;
  name?: string;
}

export interface UserData {
  username: string;
  role: string;
  companyId: string;
  companyCode: string;
  email: string;
  address: string;
  number_phone: string;
  create_at: string;
  name?: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  companyCode?: string;
  success: boolean;
}

export interface User {
  userId?: string;
  username: string;
  role: string;
  companyId: string;
  companyCode: string;
  email: string;
  address: string;
  number_phone: string;
  create_at: string;
  name?: string;
  password?: string;
}

export interface Company {
  companyId: string;
  name: string;
  address: string;
  companyCode: string;
  createAt: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}