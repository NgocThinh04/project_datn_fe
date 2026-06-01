
export const getDraftWorkflowsKey = (): string => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const companyId = user.companyId || user.companyCode || 'default';
      return `draft_workflows_${companyId}`;
    }
    return 'draft_workflows_default';
  } catch (error) {
    console.error('Error getting draft key:', error);
    return 'draft_workflows_default';
  }
};

export const getCurrentCompanyId = (): string | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.companyId || user.companyCode || null;
    }
    return null;
  } catch (error) {
    return null;
  }
};
export const getCompanyId = (): string | null => {
  // Cách 1: Lấy từ localStorage riêng
  const companyId = localStorage.getItem('companyId');
  if (companyId) return companyId;
  
  // Cách 2: Lấy từ object user
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.companyId || null;
    }
  } catch (error) {
    console.error('Error getting companyId:', error);
  }
  
  return null;
};

export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error getting user:', error);
  }
  return null;
};