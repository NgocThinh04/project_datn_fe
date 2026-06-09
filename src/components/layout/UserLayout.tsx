// src/layout/UserLayout.tsx
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  House,
  FilePlus2,
  ClipboardList,
  Bell,
  CircleUserRound,
  UserCog,
  LogOut,
  ChevronDown,
  Send,
} from "lucide-react";
import authService from "../../api/authApi";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  children: ReactNode;
}
const getUserFromStorage = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }
  return null;
};

export default function UserLayout({ children }: Props) {
  const navigate = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Lấy thông tin user từ context
  const storageUser = getUserFromStorage();
  const user = storageUser || authUser;

  const userName = user?.name || user?.username || "Người dùng";
  const userRole = user?.position === "Admin" ? "Quản trị viên" : (user?.position || "Nhân viên");
  const userEmail = user?.email || "";
  const userPhone = user?.number_phone || user?.phone || "";
  const userAvatar = userName?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowUserMenu(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Gọi API logout (nếu có)
       authService.logout();
      
      // Gọi logout từ context
      if (authLogout) {
        authLogout();
      }
      
      // Chuyển hướng về trang login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn chuyển hướng dù có lỗi
      navigate("/login");
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        {/* LEFT */}
        <div style={styles.logoSection}>
          <div style={styles.logoBox}>
            <CircleUserRound size={28} color="white" />
          </div>
          <div>
            <h2 style={styles.logoTitle}>User</h2>
            <p style={styles.logoSubTitle}>Hệ thống quản lý yêu cầu</p>
          </div>
        </div>

        {/* MENU */}
        <div style={styles.menu}>
          <a href="/user" style={styles.menuItem}>
            <House size={18} />
            <span>Trang chủ</span>
          </a>
          <a href="/user/create-request" style={styles.menuItem}>
            <FilePlus2 size={18} />
            <span>Tạo yêu cầu</span>
          </a>
          <a href="/user/requests" style={styles.menuItem}>
            <ClipboardList size={18} />
            <span>Yêu cầu</span>
          </a>
          <a href="/user/sent-requests" style={styles.menuItem}>
            <Send size={18} />
            <span>Yêu cầu đã gửi</span>
          </a>
        </div>

        {/* RIGHT */}
        <div style={styles.rightSection}>
          {/* NOTIFICATION */}
          <div style={styles.notificationWrapper}>
            <button
              style={styles.notificationButton}
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
            >
              <Bell size={20} />
              <div style={styles.notificationDot} />
            </button>

            {showNotifications && (
              <div style={styles.notificationDropdown}>
                <h4 style={styles.notificationTitle}>Thông báo</h4>
                <div style={styles.notificationItem}>
                  <div style={styles.notificationAvatar}>A</div>
                  <div>
                    <p style={styles.notificationText}>Yêu cầu của bạn đã được duyệt</p>
                    <span style={styles.notificationTime}>5 phút trước</span>
                  </div>
                </div>
                <div style={styles.notificationItem}>
                  <div style={styles.notificationAvatar}>S</div>
                  <div>
                    <p style={styles.notificationText}>Admin vừa phản hồi yêu cầu</p>
                    <span style={styles.notificationTime}>10 phút trước</span>
                  </div>
                </div>
                <div style={styles.notificationItem}>
                  <div style={styles.notificationAvatar}>H</div>
                  <div>
                    <p style={styles.notificationText}>Có cập nhật mới từ hệ thống</p>
                    <span style={styles.notificationTime}>30 phút trước</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* USER */}
          <div style={styles.userWrapper}>
            <div
              style={styles.userBox}
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
            >
              <div style={styles.avatar}>{userAvatar}</div>
              <div>
                <p style={styles.userName}>{userName}</p>
                <p style={styles.userRole}>{userRole}</p>
              </div>
              <ChevronDown size={18} />
            </div>

            {showUserMenu && (
              <div style={styles.userDropdown}>
                <button
                  style={styles.dropdownItem}
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserMenu(false);
                  }}
                >
                  <UserCog size={18} />
                  <span>Cập nhật cá nhân</span>
                </button>
                <button 
                  style={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>{children}</div>

      {/* PROFILE MODAL */}
      {showProfileModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Cập nhật thông tin</h2>
                <p style={styles.modalSubTitle}>Chỉnh sửa thông tin cá nhân</p>
              </div>
              <button
                style={styles.closeButton}
                onClick={() => setShowProfileModal(false)}
              >
                ✕
              </button>
            </div>

            {/* AVATAR */}
            <div style={styles.modalAvatarWrapper}>
              <div style={styles.modalAvatar}>{userAvatar}</div>
              <button style={styles.changeAvatarBtn}>Đổi ảnh đại diện</button>
            </div>

            {/* EMAIL */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={userEmail}
                style={styles.input}
                readOnly
              />
            </div>

            {/* PHONE */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Số điện thoại</label>
              <input
                type="text"
                value={userPhone}
                style={styles.input}
                placeholder="Chưa cập nhật"
              />
            </div>

            {/* PASSWORD */}
            <div style={styles.passwordSection}>
              <h3 style={styles.sectionTitle}>Đổi mật khẩu</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mật khẩu cũ</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu cũ"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  style={styles.input}
                />
              </div>
            </div>

            {/* BUTTON */}
            <button style={styles.updateButton}>Cập nhật thông tin</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ... styles giữ nguyên
const styles: {
  [key: string]: React.CSSProperties;
} = {
  container: {
    height: "100vh",

    display: "flex",
    flexDirection: "column",

    background:
      "linear-gradient(135deg,#eff6ff,#dbeafe,#e0f2fe)",

    overflow: "hidden",
  },

  /* HEADER */
  header: {
    height: 80,

    background: "rgba(255,255,255,0.75)",

    backdropFilter: "blur(14px)",

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    padding: "0 28px",

    boxShadow: "0 4px 18px rgba(0,0,0,0.05)",

    borderBottom:
      "1px solid rgba(255,255,255,0.5)",

    zIndex: 10,
  },

  /* LOGO */
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  logoBox: {
    width: 55,
    height: 55,

    borderRadius: 18,

    background:
      "linear-gradient(135deg,#0ea5e9,#3b82f6)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    boxShadow:
      "0 8px 20px rgba(14,165,233,0.3)",
  },

  logoTitle: {
    margin: 0,

    fontSize: 22,

    fontWeight: 800,

    color: "#0f172a",
  },

  logoSubTitle: {
    marginTop: 4,

    color: "#64748b",

    fontSize: 13,
  },

  /* MENU */
  menu: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,

    padding: "12px 18px",

    borderRadius: 14,

    textDecoration: "none",

    color: "#334155",

    fontWeight: 600,

    background: "rgba(255,255,255,0.5)",

    transition: "0.3s",

    boxShadow:
      "0 4px 12px rgba(0,0,0,0.04)",
  },

  /* RIGHT */
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 20,
  },

  /* NOTIFICATION */
  notificationWrapper: {
    position: "relative",
  },

  notificationButton: {
    width: 50,
    height: 50,

    borderRadius: "50%",

    border: "none",

    background: "white",

    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    position: "relative",

    boxShadow:
      "0 6px 16px rgba(0,0,0,0.06)",
  },

  notificationDot: {
    width: 10,
    height: 10,

    borderRadius: "50%",

    background: "#ef4444",

    position: "absolute",

    top: 12,
    right: 12,
  },

  notificationDropdown: {
    position: "absolute",

    top: 65,
    right: 0,

    width: 340,

    background: "white",

    borderRadius: 24,

    padding: 20,

    boxShadow:
      "0 20px 40px rgba(0,0,0,0.12)",

    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  notificationTitle: {
    margin: 0,

    fontSize: 20,

    fontWeight: 700,

    color: "#0f172a",
  },

  notificationItem: {
    display: "flex",
    gap: 14,

    padding: 14,

    borderRadius: 16,

    background: "#f8fafc",
  },

  notificationAvatar: {
    width: 45,
    height: 45,

    borderRadius: "50%",

    background:
      "linear-gradient(135deg,#38bdf8,#3b82f6)",

    color: "white",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontWeight: 700,
  },

  notificationText: {
    margin: 0,

    fontWeight: 600,

    color: "#0f172a",
  },

  notificationTime: {
    fontSize: 13,

    color: "#64748b",
  },

  /* USER */
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,

    background: "white",

    padding: "10px 16px",

    borderRadius: 18,

    boxShadow:
      "0 6px 16px rgba(0,0,0,0.05)",
  },

  avatar: {
    width: 48,
    height: 48,

    borderRadius: "50%",

    background:
      "linear-gradient(135deg,#0ea5e9,#6366f1)",

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
  },
  userWrapper: {
  position: "relative",
},

userDropdown: {
  position: "absolute",

  top: 70,
  right: 0,

  width: 230,

  background: "white",

  borderRadius: 20,

  padding: 12,

  display: "flex",
  flexDirection: "column",
  gap: 8,

  boxShadow:
    "0 20px 40px rgba(0,0,0,0.12)",

  zIndex: 100,
},

dropdownItem: {
  display: "flex",
  alignItems: "center",
  gap: 12,

  padding: "14px 16px",

  border: "none",

  background: "#f8fafc",

  borderRadius: 14,

  cursor: "pointer",

  fontSize: 14,

  fontWeight: 600,

  color: "#0f172a",

  transition: "0.2s",
},
modalOverlay: {
  position: "fixed",

  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  background: "rgba(0,0,0,0.35)",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  zIndex: 999,
},

modal: {
  width: 450,

  background: "white",

  borderRadius: 30,

  padding: 30,

  boxShadow:
    "0 25px 50px rgba(0,0,0,0.2)",

  display: "flex",
  flexDirection: "column",
  gap: 20,
},

modalHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
},

modalTitle: {
  margin: 0,

  fontSize: 28,

  fontWeight: 800,

  color: "#0f172a",
},

modalSubTitle: {
  marginTop: 4,

  color: "#64748b",

  fontSize: 14,
},

closeButton: {
  border: "none",

  background: "#f1f5f9",

  width: 36,
  height: 36,

  borderRadius: "50%",

  cursor: "pointer",
},

modalAvatarWrapper: {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  gap: 12,
},

modalAvatar: {
  width: 100,
  height: 100,

  borderRadius: "50%",

  background:
    "linear-gradient(135deg,#0ea5e9,#6366f1)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  color: "white",

  fontSize: 36,

  fontWeight: 800,
},

changeAvatarBtn: {
  border: "none",

  background: "#e0f2fe",

  color: "#0284c7",

  padding: "10px 18px",

  borderRadius: 12,

  cursor: "pointer",

  fontWeight: 700,
},

formGroup: {
  display: "flex",
  flexDirection: "column",

  gap: 8,
},

label: {
  fontWeight: 700,

  color: "#334155",
},

input: {
  padding: 14,

  borderRadius: 14,

  border: "1px solid #cbd5e1",

  outline: "none",

  fontSize: 15,
},

passwordSection: {
  marginTop: 10,

  paddingTop: 20,

  borderTop: "1px solid #e2e8f0",

  display: "flex",
  flexDirection: "column",

  gap: 16,
},

sectionTitle: {
  margin: 0,

  fontSize: 18,

  fontWeight: 700,

  color: "#0f172a",
},

updateButton: {
  marginTop: 10,

  padding: 16,

  borderRadius: 18,

  border: "none",

  background:
    "linear-gradient(135deg,#0ea5e9,#3b82f6)",

  color: "white",

  fontWeight: 700,

  fontSize: 15,

  cursor: "pointer",

  boxShadow:
    "0 10px 25px rgba(14,165,233,0.3)",
},
};