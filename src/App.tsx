
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import WorkflowBuilder from "./pages/admin/WorkflowBuilder";
import RegisterCompany from "./pages/RegisterCompany";
import Users from "./pages/admin/Users";
import CompanyInfo from "./pages/admin/CompanyInfo";
//
import UserLayout from "./components/layout/UserLayout";
import HomePage from "./pages/user/HomePage";
import CreateRequest from "./pages/user/CreateRequest";
import Requests from "./pages/user/Requests";
import RequestDetail from "./pages/user/RequestDetail";
import SentRequests from "./pages/user/SentRequests";
function App() {
  return (
   
      <Routes>
        //Admin
        <Route path="/" element={<Login />} />
        <Route path="/register-company" element={<RegisterCompany />}/>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/workflow"
          element={
            <AdminLayout>
              <WorkflowBuilder />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          }
        />
        <Route
  path="/admin/company"
  element={
    <AdminLayout>
      <CompanyInfo />
    </AdminLayout>
  }
/>
//User
        <Route
  path="/user"
  element={
    <UserLayout>
      <HomePage />
    </UserLayout>
  }
/>
<Route
  path="/user/create-request"
  element={
    <UserLayout>
      <CreateRequest />
    </UserLayout>
  }
/>
<Route
  path="/user/requests"
  element={
    <UserLayout>
      <Requests />
    </UserLayout>
  }
/>
<Route
  path="/user/request/:id"
  element={
    <UserLayout>
      <RequestDetail />
    </UserLayout>
  }
/>
<Route
  path="/user/sent-requests"
  element={
    <UserLayout>
      <SentRequests />
    </UserLayout>
  }
/>
      </Routes>
      
   
  );
}

export default App;