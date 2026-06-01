// services/workflowService.ts
import axiosInstance from '../api/axios';

export interface WorkflowNode {
  id: string;
  position: { x: number; y: number };
  data: {
    label: string;
    assignedRole: string;
    description: string;
  };
  type: string;
}

export interface WorkflowEdge {
  id: string;  // THÊM id bắt buộc cho ReactFlow
  source: string;
  target: string;
  type: string;
  animated: boolean;
  data?: {
    type: string;
    label: string;
  };
  style?: any;
  markerEnd?: any;
}

export interface WorkflowData {
  workflowId: string;  // CHỈ DÙNG workflowId (từ database)
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status?: 'draft' | 'active' | 'inactive';
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

const workflowService = {
  // Lấy tất cả workflows theo companyId
getAllWorkflows: async (): Promise<WorkflowData[]> => {
  try {
    const companyId = localStorage.getItem('companyId');
    console.log('🏢 Getting workflows for companyId:', companyId);
    
    const response = await axiosInstance.get('/workflows', {
      params: { companyId: companyId }
    });
    
    console.log('📡 Workflows response:', response.data);
    
    let workflowsData: any[] = [];
    if (Array.isArray(response.data)) {
      workflowsData = response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      workflowsData = response.data.data;
    } else if (response.data?.content && Array.isArray(response.data.content)) {
      workflowsData = response.data.content;
    }
    
    // Đảm bảo mỗi workflow có dữ liệu đúng format
    return workflowsData.map((wf: any) => {
      // Xử lý nodes
      let nodesArray: any[] = [];
      if (wf.nodes) {
        if (Array.isArray(wf.nodes)) {
          nodesArray = wf.nodes;
        } else if (typeof wf.nodes === 'string') {
          try {
            nodesArray = JSON.parse(wf.nodes);
          } catch (e) {
            nodesArray = [];
          }
        }
      }
      
      // Xử lý edges
      let edgesArray: any[] = [];
      if (wf.edges) {
        if (Array.isArray(wf.edges)) {
          edgesArray = wf.edges;
        } else if (typeof wf.edges === 'string') {
          try {
            edgesArray = JSON.parse(wf.edges);
          } catch (e) {
            edgesArray = [];
          }
        } else if (typeof wf.edges === 'object') {
          edgesArray = Object.values(wf.edges);
        }
      }
      
      // Đảm bảo mỗi edge có id
      edgesArray = edgesArray.map((edge: any, index: number) => ({
        ...edge,
        id: edge.id || `${edge.source}-${edge.target}-${index}`
      }));
      
      return {
        ...wf,
        workflowId: wf.workflowId || wf.id,
        nodes: nodesArray,
        edges: edgesArray
      };
    });
  } catch (error: any) {
    console.error('Get workflows error:', error);
    throw error.response?.data || { error: 'Failed to get workflows' };
  }
},

  // Lấy workflow theo workflowId
getWorkflowById: async (workflowId: string): Promise<WorkflowData> => {
  try {
    console.log('🔍 Getting workflow by id:', workflowId);
    const response = await axiosInstance.get(`/workflows/${workflowId}`);
    console.log('📡 Raw response:', response.data);
    
    const wf = response.data;
    
    // Xử lý nodes - đảm bảo là mảng
    let nodesArray: any[] = [];
    if (wf.nodes) {
      if (Array.isArray(wf.nodes)) {
        nodesArray = wf.nodes;
      } else if (typeof wf.nodes === 'string') {
        try {
          nodesArray = JSON.parse(wf.nodes);
        } catch (e) {
          nodesArray = [];
        }
      } else {
        nodesArray = [];
      }
    }
    
    // Xử lý edges - đảm bảo là mảng
    let edgesArray: any[] = [];
    if (wf.edges) {
      if (Array.isArray(wf.edges)) {
        edgesArray = wf.edges;
      } else if (typeof wf.edges === 'string') {
        try {
          edgesArray = JSON.parse(wf.edges);
        } catch (e) {
          edgesArray = [];
        }
      } else {
        edgesArray = [];
      }
    }
    
    // Đảm bảo mỗi edge có id
    edgesArray = edgesArray.map((edge: any, index: number) => ({
      ...edge,
      id: edge.id || `${edge.source}-${edge.target}-${index}`
    }));
    
    console.log('✅ Processed nodes:', nodesArray.length);
    console.log('✅ Processed edges:', edgesArray.length);
    
    return {
      workflowId: wf.workflowId,
      name: wf.name,
      description: wf.description || '',
      status: wf.status || 'draft',
      version: wf.version || 1,
      createdBy: wf.createdBy,
      createdAt: wf.createdAt,
      updatedAt: wf.updatedAt,
      nodes: nodesArray,
      edges: edgesArray
    };
  } catch (error: any) {
    console.error('Get workflow by id error:', error);
    throw error.response?.data || { error: 'Failed to get workflow' };
  }
},

  // Tạo mới workflow
  createWorkflow: async (workflow: Omit<WorkflowData, 'workflowId'>): Promise<WorkflowData> => {
    try {
      const companyId = localStorage.getItem('companyId');
      console.log('CompanyId from localStorage:', companyId);
      
      if (!companyId) {
        console.warn('⚠️ No companyId found in localStorage');
      }
      
      const payload = {
        companyId: companyId,
        name: workflow.name,
        description: workflow.description || '',
        nodes: JSON.stringify(workflow.nodes),
        edges: JSON.stringify(workflow.edges),
        status: workflow.status || 'draft',
        version: workflow.version || 1,
        createdBy: workflow.createdBy || 'admin'
      };
      
      console.log('📦 Create workflow payload:', payload);
      const response = await axiosInstance.post('/workflows', payload);
      
      let createdWorkflow = response.data?.data || response.data;
      
      // Parse lại nodes và edges từ JSON string nếu cần
      if (createdWorkflow.nodes && typeof createdWorkflow.nodes === 'string') {
        createdWorkflow.nodes = JSON.parse(createdWorkflow.nodes);
      }
      if (createdWorkflow.edges && typeof createdWorkflow.edges === 'string') {
        createdWorkflow.edges = JSON.parse(createdWorkflow.edges);
      }
      
      // Đảm bảo edges có id
      if (createdWorkflow.edges) {
        createdWorkflow.edges = createdWorkflow.edges.map((edge: any) => ({
          ...edge,
          id: edge.id || `${edge.source}-${edge.target}-${Date.now()}`
        }));
      }
      
      return {
        ...createdWorkflow,
        workflowId: createdWorkflow.workflowId || createdWorkflow.id,
        nodes: Array.isArray(createdWorkflow.nodes) ? createdWorkflow.nodes : [],
        edges: Array.isArray(createdWorkflow.edges) ? createdWorkflow.edges : []
      };
    } catch (error: any) {
      console.error('Create workflow error:', error);
      throw error.response?.data || { error: 'Failed to create workflow' };
    }
  },

  // Cập nhật workflow
  updateWorkflow: async (workflowId: string, workflow: Partial<WorkflowData>): Promise<WorkflowData> => {
    try {
      const companyId = localStorage.getItem('companyId');
      const payload = {
        companyId: companyId,
        name: workflow.name,
        description: workflow.description || '',
        nodes: workflow.nodes ? JSON.stringify(workflow.nodes) : undefined,
        edges: workflow.edges ? JSON.stringify(workflow.edges) : undefined,
        status: workflow.status || 'draft',
        version: (workflow.version || 1) + 1,
        updatedBy: workflow.createdBy || 'admin'
      };
      
      console.log('📦 Update workflow payload:', payload);
      const response = await axiosInstance.put(`/workflows/${workflowId}`, payload);
      
      let updatedWorkflow = response.data?.data || response.data;
      
      // Parse lại nodes và edges từ JSON string nếu cần
      if (updatedWorkflow.nodes && typeof updatedWorkflow.nodes === 'string') {
        updatedWorkflow.nodes = JSON.parse(updatedWorkflow.nodes);
      }
      if (updatedWorkflow.edges && typeof updatedWorkflow.edges === 'string') {
        updatedWorkflow.edges = JSON.parse(updatedWorkflow.edges);
      }
      
      // Đảm bảo edges có id
      if (updatedWorkflow.edges) {
        updatedWorkflow.edges = updatedWorkflow.edges.map((edge: any) => ({
          ...edge,
          id: edge.id || `${edge.source}-${edge.target}-${Date.now()}`
        }));
      }
      
      return {
        ...updatedWorkflow,
        workflowId: updatedWorkflow.workflowId || updatedWorkflow.id,
        nodes: Array.isArray(updatedWorkflow.nodes) ? updatedWorkflow.nodes : [],
        edges: Array.isArray(updatedWorkflow.edges) ? updatedWorkflow.edges : []
      };
    } catch (error: any) {
      console.error('Update workflow error:', error);
      throw error.response?.data || { error: 'Failed to update workflow' };
    }
  },

  // Xóa workflow
  deleteWorkflow: async (workflowId: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🗑️ Deleting workflow:', workflowId);
      const response = await axiosInstance.delete(`/workflows/${workflowId}`);
      if (response.data?.success !== undefined) {
        return response.data;
      }
      return { success: true, message: 'Workflow deleted successfully' };
    } catch (error: any) {
      console.error('Delete workflow error:', error);
      throw error.response?.data || { error: 'Failed to delete workflow' };
    }
  },

  // Cập nhật status workflow
  updateWorkflowStatus: async (workflowId: string, status: 'active' | 'inactive'): Promise<WorkflowData> => {
    try {
      const response = await axiosInstance.patch(`/workflows/${workflowId}/status`, { status });
      
      let updatedWorkflow = response.data?.data || response.data;
      
      return {
        ...updatedWorkflow,
        workflowId: updatedWorkflow.workflowId || updatedWorkflow.id,
        nodes: Array.isArray(updatedWorkflow.nodes) ? updatedWorkflow.nodes : [],
        edges: Array.isArray(updatedWorkflow.edges) ? updatedWorkflow.edges : []
      };
    } catch (error: any) {
      console.error('Update status error:', error);
      throw error.response?.data || { error: 'Failed to update status' };
    }
  },

  // Duplicate workflow
  duplicateWorkflow: async (workflowId: string, newName: string): Promise<WorkflowData> => {
    try {
      console.log('📋 Duplicating workflow:', workflowId);
      const response = await axiosInstance.post(`/workflows/${workflowId}/duplicate`, { name: newName });
      
      let duplicatedWorkflow = response.data?.data || response.data;
      
      // Đảm bảo edges có id
      if (duplicatedWorkflow.edges) {
        duplicatedWorkflow.edges = duplicatedWorkflow.edges.map((edge: any) => ({
          ...edge,
          id: edge.id || `${edge.source}-${edge.target}-${Date.now()}`
        }));
      }
      
      return {
        ...duplicatedWorkflow,
        workflowId: duplicatedWorkflow.workflowId || duplicatedWorkflow.id,
        nodes: Array.isArray(duplicatedWorkflow.nodes) ? duplicatedWorkflow.nodes : [],
        edges: Array.isArray(duplicatedWorkflow.edges) ? duplicatedWorkflow.edges : []
      };
    } catch (error: any) {
      console.error('Duplicate workflow error:', error);
      throw error.response?.data || { error: 'Failed to duplicate workflow' };
    }
  },

  // Validate workflow trước khi save
  validateWorkflowData: (workflow: Partial<WorkflowData>): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!workflow.name || workflow.name.trim() === '') {
      errors.push('Tên workflow không được để trống');
    }
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      errors.push('Workflow phải có ít nhất 1 node');
    }
    
    const hasStart = workflow.nodes?.some(n => n.data.label === 'START');
    if (!hasStart) {
      errors.push('Workflow phải có node START');
    }
    
    const hasEnd = workflow.nodes?.some(n => n.data.label === 'END');
    if (!hasEnd) {
      errors.push('Workflow phải có node END');
    }
    
    const hasApproval = workflow.nodes?.some(n => n.data.label === 'APPROVAL');
    if (!hasApproval) {
      errors.push('Workflow phải có ít nhất 1 node APPROVAL');
    }
    
    const nodesWithoutRole = workflow.nodes?.filter(
      n => n.data.label === 'APPROVAL' && !n.data.assignedRole
    );
    if (nodesWithoutRole && nodesWithoutRole.length > 0) {
      errors.push(`Có ${nodesWithoutRole.length} node APPROVAL chưa được gán vai trò`);
    }
    
    return { valid: errors.length === 0, errors };
  }
};

export default workflowService;