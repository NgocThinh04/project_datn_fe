// services/requestService.ts
import axiosInstance from '../../api/axios';

export interface ApprovalAction {
  id: string;
  stepOrder: number;
  stepName: string;
  approvalType: 'SINGLE' | 'ALL';
  action: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approverId?: string;
  approverName?: string;
  rejectionReason?: string;
  note?: string;
  approvedAt?: string;
  requestId: string;
  canApprove: boolean;
}

export interface ApprovalRequest {
  id: string;
  requestCode: string;
  title: string;
  description?: string;
  requestType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'IN_PROGRESS';
  note?: string;
  requesterId: string;
  requesterName?: string;
  createdAt: string;
  updatedAt?: string;
  actions: ApprovalAction[];
  currentStepOrder?: number;
  currentStepName?: string;
  isCompleted: boolean;
  isPending: boolean;
}

const requestService = {
  // Lấy danh sách yêu cầu cần duyệt
  getPendingRequests: async (): Promise<ApprovalRequest[]> => {
    try {
      const response = await axiosInstance.get('/approvals/pending');
      console.log('📋 Pending requests:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get pending requests error:', error);
      throw error.response?.data || { error: 'Lấy danh sách yêu cầu thất bại' };
    }
  },

  // Lấy danh sách yêu cầu đã gửi
  getMyRequests: async (): Promise<ApprovalRequest[]> => {
    try {
      const response = await axiosInstance.get('/approvals/my-requests');
      return response.data;
    } catch (error: any) {
      console.error('Get my requests error:', error);
      throw error.response?.data || { error: 'Lấy danh sách yêu cầu thất bại' };
    }
  },

  // Lấy chi tiết yêu cầu
  getRequestDetail: async (requestId: string): Promise<ApprovalRequest> => {
    try {
      const response = await axiosInstance.get(`/approvals/requests/${requestId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get request detail error:', error);
      throw error.response?.data || { error: 'Lấy chi tiết yêu cầu thất bại' };
    }
  },
};

export default requestService;