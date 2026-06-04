
import axiosInstance from '../api/axios';

export interface UserData {
  userId?: string;
  name: string;
  userName: string;      
  email: string;
  password?: string;
  phone: string;
  address: string;
  position?: string;
  status: string;
  companyId?: string;
  companyCode?: string;
  create_at?: string;
}

const userService = {
  // Lấy tất cả users theo companyId
  getAllUsers: async (): Promise<UserData[]> => {
    try {
      const companyId = localStorage.getItem('companyId');
      const response = await axiosInstance.get('/users', {
        params: { companyId }
      });
      // Đảm bảo dữ liệu trả về có userName
      return response.data;
    } catch (error: any) {
      console.error('Get users error:', error);
      throw error.response?.data || { error: 'Failed to get users' };
    }
  },

  // Tạo user mới
  createUser: async (user: Partial<UserData>): Promise<UserData> => {
    try {
      const companyId = localStorage.getItem('companyId');
      const payload = {
        name: user.name,
        userName: user.userName,  // ✅ THÊM userName
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        position: user.position || "",
        status: user.status || "ACTIVE",
        companyId: companyId
      };
      
      console.log('📤 Creating user payload:', payload);
      const response = await axiosInstance.post('/users', payload);
      return response.data;
    } catch (error: any) {
      console.error('Create user error:', error);
      throw error.response?.data || { error: 'Failed to create user' };
    }
  },

  // Cập nhật user
  updateUser: async (userId: string, user: Partial<UserData>): Promise<UserData> => {
    try {
      const payload: any = {
        name: user.name,
        userName: user.userName,  // ✅ THÊM userName
        email: user.email,
        phone: user.phone,
        address: user.address,
        position: user.position || "",
        status: user.status,
      };
      
      if (user.password) {
        payload.password = user.password;
      }
      
      console.log('📤 Updating user payload:', payload);
      const response = await axiosInstance.put(`/users/${userId}`, payload);
      return response.data;
    } catch (error: any) {
      console.error('Update user error:', error);
      throw error.response?.data || { error: 'Failed to update user' };
    }
  },

  // Xóa user
  deleteUser: async (userId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
    } catch (error: any) {
      console.error('Delete user error:', error);
      throw error.response?.data || { error: 'Failed to delete user' };
    }
  },
};

export default userService;