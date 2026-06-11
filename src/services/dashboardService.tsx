// services/admin/dashboardService.ts
import axiosInstance from '../api/axios';

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  userName: string;
  userRole: string;
  status: string;
  createdAt: string;
  formattedTime: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  recentActivities: RecentActivity[];
}

const dashboardService = {
  // Lấy thống kê dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axiosInstance.get('/admin/dashboard/stats');
      console.log('📊 Dashboard stats:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get dashboard stats error:', error);
      throw error.response?.data || { error: 'Không thể tải dữ liệu thống kê' };
    }
  },
};

export default dashboardService;