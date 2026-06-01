// src/layout/AdminLayout.tsx

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Workflow,
  Users,
  ShieldCheck,
  Building2,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  children: ReactNode;
}

export function AdminLayout({ children }: Props) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        {/* LOGO */}
        <div style={styles.logoContainer}>
          <div style={styles.logoCircle}>
            <ShieldCheck size={28} color="white" />
          </div>

          <div>
            <h2 style={styles.logoText}>Admin Panel</h2>
            <p style={styles.logoSubText}>Management System</p>
          </div>
        </div>

        {/* MENU */}
        <div style={styles.menuContainer}>
          <a href="/admin" style={styles.menuItem}>
            <LayoutDashboard size={20} />
            <span>Trang chủ</span>
          </a>

          <a href="/admin/workflow" style={styles.menuItem}>
            <Workflow size={20} />
            <span>Quy trình</span>
          </a>

          <a href="/admin/users" style={styles.menuItem}>
            <Users size={20} />
            <span>Người dùng</span>
          </a>

          <a href="/admin/company" style={styles.menuItem}>
            <Building2 size={20} />
            <span>Thông tin công ty</span>
          </a>
        </div>

        {/* LOGOUT BUTTON - Đặt ở cuối sidebar */}
        <div style={styles.logoutContainer}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h3 style={styles.headerTitle}>Admin Panel</h3>
            <p style={styles.headerSubtitle}>Quản lý hệ thống và người dùng</p>
          </div>

          <div style={styles.userBox}>
            <div style={styles.avatar}>
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <p style={styles.userName}>{user?.username || "Administrator"}</p>
              <p style={styles.userRole}>{user?.role || "Admin"}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  /* LAYOUT */
  container: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    background: "#e0f2fe",
  },

  /* SIDEBAR */
  sidebar: {
    width: 270,
    minWidth: 270,
    background: "linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    padding: 24,
    boxShadow: "4px 0 25px rgba(0,0,0,0.15)",
    zIndex: 10,
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 40,
  },

  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 20,
    background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(14,165,233,0.35)",
  },

  logoText: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
  },

  logoSubText: {
    marginTop: 4,
    fontSize: 13,
    color: "#cbd5e1",
  },

  menuContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    flex: 1,
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 18px",
    borderRadius: 18,
    color: "#e2e8f0",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 15,
    transition: "all 0.3s ease",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  /* LOGOUT BUTTON */
  logoutContainer: {
    marginTop: "auto",
    paddingTop: 20,
  },

  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
    padding: "16px 18px",
    borderRadius: 18,
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },

  sidebarFooter: {
    marginTop: "auto",
    paddingTop: 20,
  },

  footerText: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
  },

  /* MAIN */
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  /* HEADER */
  header: {
    height: 85,
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    borderBottom: "1px solid rgba(255,255,255,0.5)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    zIndex: 5,
  },

  headerTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
  },

  headerSubtitle: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 14,
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "white",
    padding: "10px 16px",
    borderRadius: 18,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
  },

  userName: {
    margin: 0,
    fontWeight: 700,
    color: "#0f172a",
  },

  userRole: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
  },

  /* CONTENT */
  content: {
    flex: 1,
    overflowY: "auto",
    padding: 24,
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)",
    scrollbarWidth: "thin",
  },
};

export default AdminLayout;