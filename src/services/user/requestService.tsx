// services/requestService.ts
import axiosInstance from '../../api/axios';

export interface ApprovalAction {
  id: string;
  stepOrder: number;
  stepName: string;
  approvalType: 'SINGLE' | 'ALL';
  action: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES' | 'CANCELLED';  // THÊM REQUEST_CHANGES
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES' | 'CANCELLED' | 'IN_PROGRESS';  // THÊM REQUEST_CHANGES
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

export interface CreateApprovalRequestDTO {
  token: string;
  title: string;
  description?: string;
  requestType: string;
  note?: string;
}

export interface ProcessApprovalDTO {
  actionId: string;
  action: 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES';  // THÊM REQUEST_CHANGES
  note?: string;
  rejectionReason?: string;
  changeRequestNote?: string;  // THÊM field này cho yêu cầu chỉnh sửa
}

export interface ProcessApprovalResponse {
  message: string;
  status: string;
  requestId: string;
  currentStep?: number;
  nextStep?: number;
}
const requestService = {
  // ==================== YÊU CẦU CẦN DUYỆT ====================
  
  /**
   * Lấy danh sách yêu cầu cần duyệt (dành cho người dùng)
   * GET /approvals/pending
   */
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

  // ==================== YÊU CẦU TÔI ĐÃ GỬI ====================
  
  /**
   * Lấy danh sách yêu cầu do tôi gửi
   * GET /approvals/my-requests
   */
  getMyRequests: async (): Promise<ApprovalRequest[]> => {
    try {
      const response = await axiosInstance.get('/approvals/my-requests');
      console.log('📋 My requests:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get my requests error:', error);
      throw error.response?.data || { error: 'Lấy danh sách yêu cầu thất bại' };
    }
  },

  // ==================== CHI TIẾT YÊU CẦU ====================
  
  /**
   * Lấy chi tiết một yêu cầu
   * GET /approvals/requests/{requestId}
   */
  getRequestDetail: async (requestId: string): Promise<ApprovalRequest> => {
    try {
      const response = await axiosInstance.get(`/approvals/requests/${requestId}`);
      console.log('📋 Request detail:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get request detail error:', error);
      throw error.response?.data || { error: 'Lấy chi tiết yêu cầu thất bại' };
    }
  },

  // ==================== TẠO YÊU CẦU MỚI ====================
  
  /**
   * Tạo yêu cầu mới
   * POST /approvals/requests
   */
  createRequest: async (data: CreateApprovalRequestDTO): Promise<ApprovalRequest> => {
    try {
      const response = await axiosInstance.post('/approvals/requests', data);
      console.log('✅ Created request:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Create request error:', error);
      throw error.response?.data || { error: 'Tạo yêu cầu thất bại' };
    }
  },

  // ==================== XỬ LÝ DUYỆT ====================
  
  /**
   * Xử lý duyệt / từ chối yêu cầu
   * POST /approvals/process
   */
  processApproval: async (data: ProcessApprovalDTO): Promise<{ message: string; status: string; requestId: string }> => {
    try {
      const response = await axiosInstance.post('/approvals/process', data);
      console.log('✅ Processed approval:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Process approval error:', error);
      throw error.response?.data || { error: 'Xử lý duyệt thất bại' };
    }
  },

  // ==================== YÊU CẦU CỦA CÔNG TY (ADMIN) ====================
  
  /**
   * Lấy danh sách yêu cầu của công ty (dành cho Admin)
   * GET /approvals/company-requests?status={status}
   */
  getCompanyRequests: async (status?: string): Promise<ApprovalRequest[]> => {
    try {
      const params = status ? { status } : {};
      const response = await axiosInstance.get('/approvals/company-requests', { params });
      console.log('📋 Company requests:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get company requests error:', error);
      throw error.response?.data || { error: 'Lấy danh sách yêu cầu thất bại' };
    }
  },

  // ==================== WORKFLOW ====================
  
  /**
   * Lấy danh sách workflow theo companyId
   * GET /approvals/workflows?companyId={companyId}
   */
  getWorkflows: async (): Promise<any[]> => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await axiosInstance.get('/approvals/workflows', {
        params: { companyId }
      });
      console.log('📋 Workflows:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get workflows error:', error);
      throw error.response?.data || { error: 'Lấy danh sách workflow thất bại' };
    }
  },

  /**
   * Lấy workflow active theo tên
   * GET /approvals/workflows/active?companyId={companyId}&name={name}
   */
  getActiveWorkflowByName: async (name: string): Promise<any> => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await axiosInstance.get('/approvals/workflows/active', {
        params: { companyId, name }
      });
      return response.data;
    } catch (error: any) {
      console.error('Get active workflow error:', error);
      throw error.response?.data || { error: 'Lấy workflow thất bại' };
    }
  },

  // ==================== THỐNG KÊ ====================
  
  /**
   * Lấy thống kê yêu cầu của công ty
   * GET /approvals/statistics?companyId={companyId}
   */
  getRequestStatistics: async (): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    inProgress: number;
  }> => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await axiosInstance.get('/approvals/statistics', {
        params: { companyId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Get statistics error:', error);
      throw error.response?.data || { error: 'Lấy thống kê thất bại' };
    }
  },

  // ==================== HỦY YÊU CẦU ====================
  
  /**
   * Hủy yêu cầu (chỉ khi đang PENDING)
   * DELETE /approvals/requests/{requestId}
   */
  cancelRequest: async (requestId: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.delete(`/approvals/requests/${requestId}`);
      console.log('✅ Cancelled request:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Cancel request error:', error);
      throw error.response?.data || { error: 'Hủy yêu cầu thất bại' };
    }
  },

  // ==================== CẬP NHẬT YÊU CẦU ====================
  
  /**
   * Cập nhật yêu cầu (chỉ khi đang PENDING và là người gửi)
   * PUT /approvals/requests/{requestId}
   */
  updateRequest: async (requestId: string, data: Partial<CreateApprovalRequestDTO>): Promise<ApprovalRequest> => {
    try {
      const response = await axiosInstance.put(`/approvals/requests/${requestId}`, data);
      console.log('✅ Updated request:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Update request error:', error);
      throw error.response?.data || { error: 'Cập nhật yêu cầu thất bại' };
    }
  },
};

export default requestService;