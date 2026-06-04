// services/positionService.ts
import axiosInstance from '../api/axios';

export interface PositionType { 
  positionId?: string;
  positionName: string;
  companyId?: string;
}

export interface PositionRequest {
  positionName: string;
  companyId?: string;
}

const positionService = {
  // Lấy tất cả chức vụ theo companyId
  getAllPositions: async (): Promise<PositionType[]> => {
    try {
      const companyId = localStorage.getItem('companyId');
      console.log('🏢 Getting positions for companyId:', companyId);
      
      const response = await axiosInstance.get('/positions', {
        params: { companyId: companyId }
      });
      
      console.log('📡 Positions response:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error: any) {
      console.error('Get positions error:', error);
      throw error.response?.data || { error: 'Failed to get positions' };
    }
  },

  // Tạo chức vụ mới
  createPosition: async (data: PositionRequest): Promise<PositionType> => {
    try {
      const companyId = localStorage.getItem('companyId');
      const payload = {
        positionName: data.positionName,
        companyId: companyId
      };
      
      console.log('📤 Creating position:', payload);
      const response = await axiosInstance.post('/positions', payload);
      return response.data;
    } catch (error: any) {
      console.error('Create position error:', error);
      throw error.response?.data || { error: 'Failed to create position' };
    }
  },

  // Xóa chức vụ
  deletePosition: async (positionId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/positions/${positionId}`);
    } catch (error: any) {
      console.error('Delete position error:', error);
      throw error.response?.data || { error: 'Failed to delete position' };
    }
  }
};

export default positionService;