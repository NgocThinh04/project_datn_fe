import axiosInstance from './axios';
import type { Company } from '../types';

const companyApi = {
  // Lấy thông tin công ty
  getCompanyInfo: async (companyId: string): Promise<Company> => {
    try {
      const response = await axiosInstance.get(`/company/${companyId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  },

  // Cập nhật thông tin công ty
  updateCompanyInfo: async (companyId: string, data: Partial<Company>) => {
    try {
      const response = await axiosInstance.put(`/company/${companyId}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  },

  // Kiểm tra mã công ty
  checkCompanyCode: async (code: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.get(`/company/check-code/${code}`);
      return response.data.exists;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
};

export default companyApi;