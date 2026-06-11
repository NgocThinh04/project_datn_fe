// services/sentRequestService.ts
import axiosInstance from '../../api/axios';

export interface ApprovalActionDTO {
  id: string;
  stepOrder: number;
  stepName: string;
  approvalType: string;
  action: string;
  approverId: string | null;
  approverName: string | null;
  rejectionReason: string | null;
  note: string | null;
  approvedAt: string | null;
  requestId: string;
  canApprove: boolean;
}

export interface SentRequestDTO {
  id: string;
  requestCode: string;
  title: string;
  description: string;
  requestType: string;
  status: string;
  note: string | null;
  requesterId: string;
  requesterName: string;
  createdAt: string;
  updatedAt: string;
  actions: ApprovalActionDTO[];
  currentStepOrder: number | null;
  currentStepName: string | null;
  isCompleted: boolean;
  isPending: boolean;
}

const sentRequestService = {
  // Lấy danh sách yêu cầu đã gửi (lấy từ token)
  getMyRequests: async (): Promise<SentRequestDTO[]> => {
    try {
      const response = await axiosInstance.get('/approvals/my-requests');
      console.log('📋 My requests response:', response.data);
      
      let requestsData: any[] = [];
      if (Array.isArray(response.data)) {
        requestsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        requestsData = response.data.data;
      } else if (response.data?.content && Array.isArray(response.data.content)) {
        requestsData = response.data.content;
      }
      
      return requestsData;
    } catch (error: any) {
      console.error('Get my requests error:', error);
      throw error.response?.data || { error: 'Failed to get my requests' };
    }
  },

  // Lấy chi tiết yêu cầu đã gửi
  getSentRequestDetail: async (requestId: string): Promise<SentRequestDTO> => {
    try {
      const response = await axiosInstance.get(`/approvals/requests/${requestId}`);
      console.log('📋 Sent request detail:', response.data);
      
      let requestData = response.data?.data || response.data;
      return requestData;
    } catch (error: any) {
      console.error('Get sent request detail error:', error);
      throw error.response?.data || { error: 'Failed to get request detail' };
    }
  },

  // Hủy yêu cầu
  cancelRequest: async (requestId: string, reason?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.post(`/approvals/requests/${requestId}/cancel`, { reason });
      return response.data;
    } catch (error: any) {
      console.error('Cancel request error:', error);
      throw error.response?.data || { error: 'Failed to cancel request' };
    }
  },
};

export default sentRequestService;