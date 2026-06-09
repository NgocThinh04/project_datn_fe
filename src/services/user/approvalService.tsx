// services/approvalService.ts
import axiosInstance from '../../api/axios';

export interface ApprovalRequestDTO {
  token: string;
  companyId: string;
  title: string;
  description: string;
  requestType: string;
  note?: string;
}

export interface ApprovalActionRequestDTO {
  actionId: string;
  action: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  note?: string;
}

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
  requestCode: string;
  requestTitle: string;
  canApprove: boolean;
}

export interface ApprovalResponseDTO {
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

export interface WorkflowDTO {
  workflowId: string;
  name: string;
  description: string;
  status: string;
  companyId: string;
  nodes: string;
  edges: string;
  version: number;
  createAt: string;
}

const approvalService = {
  // Lấy token từ localStorage
  getToken: (): string => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Không tìm thấy token đăng nhập');
    }
    return token;
  },

  // Tạo yêu cầu duyệt mới
  submitRequest: async (data: Omit<ApprovalRequestDTO, 'token'>): Promise<{ message: string; requestId: string; requestCode: string; status: string }> => {
    try {
      const token = approvalService.getToken();
      const payload: ApprovalRequestDTO = {
        ...data,
        token,
      };
      
      const response = await axiosInstance.post('/approvals/submit', payload);
      return response.data;
    } catch (error: any) {
      console.error('Submit request error:', error);
      throw error.response?.data || { error: 'Gửi yêu cầu thất bại' };
    }
  },

  // Xử lý duyệt (approve/reject)
  processApproval: async (data: ApprovalActionRequestDTO): Promise<any> => {
    try {
      const response = await axiosInstance.post('/approvals/process', data, {
        headers: {
          'X-User-Id': localStorage.getItem('userId') || '',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Process approval error:', error);
      throw error.response?.data || { error: 'Xử lý duyệt thất bại' };
    }
  },

  // Lấy danh sách yêu cầu cần duyệt
  getPendingRequests: async (): Promise<ApprovalResponseDTO[]> => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.get(`/approvals/pending?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get pending requests error:', error);
      throw error.response?.data || { error: 'Lấy danh sách thất bại' };
    }
  },

  // Lấy chi tiết yêu cầu
  getRequestDetail: async (requestId: string): Promise<ApprovalResponseDTO> => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.get(`/approvals/${requestId}?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get request detail error:', error);
      throw error.response?.data || { error: 'Lấy chi tiết thất bại' };
    }
  },

  // Lấy yêu cầu do tôi gửi
  getMyRequests: async (): Promise<ApprovalResponseDTO[]> => {
    try {
      const requesterId = localStorage.getItem('userId');
      const response = await axiosInstance.get(`/approvals/my-requests?requesterId=${requesterId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get my requests error:', error);
      throw error.response?.data || { error: 'Lấy danh sách thất bại' };
    }
  },

  // Lấy tất cả workflow của công ty
  getWorkflowsByCompany: async (): Promise<WorkflowDTO[]> => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await axiosInstance.get(`/approvals/workflows?companyId=${companyId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get workflows error:', error);
      throw error.response?.data || { error: 'Lấy danh sách quy trình thất bại' };
    }
  },

  // Lấy workflow active theo tên
  getActiveWorkflow: async (name: string): Promise<WorkflowDTO> => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await axiosInstance.get(`/approvals/workflows/active?companyId=${companyId}&name=${name}`);
      return response.data;
    } catch (error: any) {
      console.error('Get active workflow error:', error);
      throw error.response?.data || { error: 'Lấy quy trình thất bại' };
    }
  },
};

export default approvalService;