import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import WorkflowBuilder from "./pages/admin/WorkflowBuilder";
import RegisterCompany from "./pages/RegisterCompany";
import Users from "./pages/admin/Users";
import CompanyInfo from "./pages/admin/CompanyInfo";
import UserLayout from "./components/layout/UserLayout";
import HomePage from "./pages/user/HomePage";
import CreateRequest from "./pages/user/CreateRequest";
import Requests from "./pages/user/Requests";
import RequestDetail from "./pages/user/RequestDetail";
import SentRequests from "./pages/user/SentRequests";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./route/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

// Component để redirect dựa trên role
const RedirectBasedOnRole = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role === "Admin" || user?.role === "ADMIN" || user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/user" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register-company" element={<RegisterCompany />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Root redirect */}
        <Route path="/" element={<RedirectBasedOnRole />} />
        
        {/* Admin routes - chỉ Admin mới vào được */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin", "ADMIN", "admin"]}>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workflow"
          element={
            <ProtectedRoute allowedRoles={["Admin", "ADMIN", "admin"]}>
              <AdminLayout>
                <WorkflowBuilder />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["Admin", "ADMIN", "admin"]}>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/company"
          element={
            <ProtectedRoute allowedRoles={["Admin", "ADMIN", "admin"]}>
              <AdminLayout>
                <CompanyInfo />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        {/* User routes - chỉ User mới vào được */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["User", "USER", "user"]}>
              <UserLayout>
                <HomePage />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/create-request"
          element={
            <ProtectedRoute allowedRoles={["User", "USER", "user"]}>
              <UserLayout>
                <CreateRequest />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/requests"
          element={
            <ProtectedRoute allowedRoles={["User", "USER", "user"]}>
              <UserLayout>
                <Requests />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/request/:id"
          element={
            <ProtectedRoute allowedRoles={["User", "USER", "user"]}>
              <UserLayout>
                <RequestDetail />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/sent-requests"
          element={
            <ProtectedRoute allowedRoles={["User", "USER", "user"]}>
              <UserLayout>
                <SentRequests />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

// Component 404
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">Trang bạn tìm không tồn tại.</p>
      <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Về trang chủ
      </Link>
    </div>
  );
};

export default App;