import { useMemo, useState, useEffect } from "react";
import userService, { type UserData } from "../../services/userService";
import positionService, { type PositionType } from "../../services/positionService";
import { useAuth } from "../../contexts/AuthContext";

/* ================= TYPES ================= */
type User = {
  userId?: string;
  name: string;
  userName: string;        // ✅ THÊM userName
  role: string;
  joinedAt?: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  status: "ACTIVE" | "INACTIVE";
  companyId?: string;
  companyCode?: string;
  create_at?: string;
  position?: string;
};

/* ================= MAIN COMPONENT ================= */
export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= STATES ================= */
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 6;

  /* ================= POSITIONS STATE ================= */
  const [positions, setPositions] = useState<PositionType[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);

  /* ================= MODAL STATES ================= */
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  /* ================= STATUS OPTIONS ================= */
  const statusOptions = ["ACTIVE", "INACTIVE"];

  /* ================= TOAST/MESSAGE STATE ================= */
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ================= FORM STATE ================= */
  const emptyForm = {
    name: "",
    userName: "",        // ✅ THÊM userName
    position: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    status: "ACTIVE",
  };
  const [newUser, setNewUser] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  /* ================= LOAD POSITIONS FROM BACKEND ================= */
  const loadPositions = async () => {
    setPositionsLoading(true);
    try {
      const positionsFromBE = await positionService.getAllPositions();
      console.log("📋 Positions from BE:", positionsFromBE);
      setPositions(positionsFromBE);
    } catch (err: any) {
      console.error("Load positions error:", err);
    } finally {
      setPositionsLoading(false);
    }
  };

  /* ================= LOAD USERS FROM BACKEND ================= */
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersFromBE = await userService.getAllUsers();
      console.log("📋 Users from BE:", usersFromBE);
      
      const formattedUsers: User[] = usersFromBE.map((u: any) => ({
        userId: u.userId || u.id,
        name: u.name || u.fullName || "",
        userName: u.userName || u.username || "",  // ✅ THÊM userName
        role: u.role || "STAFF",
        position: u.position || "",
        email: u.email || "",
        phone: u.phone || u.number || "",
        address: u.address || "",
        password: "********",
        status: u.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        joinedAt: u.createAt ? new Date(u.createAt).toLocaleDateString() : new Date().toLocaleDateString(),
        companyId: u.companyId,
        companyCode: u.companyCode,
        create_at: u.createAt,
      }));
      
      setUsers(formattedUsers);
      
      if (formattedUsers.length > 0 && !selectedUser) {
        setSelectedUser(formattedUsers[0]);
      }
    } catch (err: any) {
      console.error("Load users error:", err);
      setError(err.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VALIDATE FORM ================= */
  const validateForm = (data: typeof emptyForm): boolean => {
    const errors: Record<string, string> = {};
    
    if (!data.name.trim()) {
      errors.name = "Họ tên không được để trống";
    }
    
    if (!data.userName.trim()) {
      errors.userName = "Tên đăng nhập không được để trống";
    }
    
    if (!data.email.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Email không đúng định dạng";
    }
    
    if (!data.password.trim()) {
      errors.password = "Mật khẩu không được để trống";
    } else if (data.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    if (!data.phone.trim()) {
      errors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }
    
    if (!data.address.trim()) {
      errors.address = "Địa chỉ không được để trống";
    }
    
    if (!data.position) {
      errors.position = "Vui lòng chọn chức vụ";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ================= ADD USER ================= */
  const handleAddUser = async () => {
    if (!validateForm(newUser)) {
      showToast("Vui lòng điền đầy đủ và chính xác tất cả thông tin!", "error");
      return;
    }

    try {
      const userData = {
        name: newUser.name,
        userName: newUser.userName,  // ✅ THÊM userName
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone,
        address: newUser.address,
        position: newUser.position,
        status: newUser.status,
      };
      
      console.log("📤 Sending user data:", userData);
      
      const created = await userService.createUser(userData);
      console.log("✅ Created user:", created);
      
      await loadUsers();
      
      setNewUser(emptyForm);
      setFormErrors({});
      setShowAddModal(false);
      showToast("Thêm người dùng thành công!", "success");
    } catch (err: any) {
      console.error("Add user error:", err);
      const errorMsg = err?.error || err?.message || "Thêm người dùng thất bại";
      showToast(errorMsg, "error");
    }
  };

  /* ================= UPDATE USER ================= */
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    if (!editingUser.name.trim()) {
      showToast("Vui lòng nhập họ tên", "error");
      return;
    }
    if (!editingUser.userName.trim()) {
      showToast("Vui lòng nhập tên đăng nhập", "error");
      return;
    }
    if (!editingUser.email.trim()) {
      showToast("Vui lòng nhập email", "error");
      return;
    }
    if (!editingUser.phone.trim()) {
      showToast("Vui lòng nhập số điện thoại", "error");
      return;
    }
    if (!editingUser.address.trim()) {
      showToast("Vui lòng nhập địa chỉ", "error");
      return;
    }

    try {
      const updateData: any = {
        name: editingUser.name,
        userName: editingUser.userName,  // ✅ THÊM userName
        email: editingUser.email,
        phone: editingUser.phone,
        address: editingUser.address,
        position: editingUser.position || "",
        status: editingUser.status,
      };
      
      if (editingUser.password && editingUser.password !== "********") {
        if (editingUser.password.length < 6) {
          showToast("Mật khẩu mới phải có ít nhất 6 ký tự", "error");
          return;
        }
        updateData.password = editingUser.password;
      }
      
      console.log("📤 Updating user data:", updateData);
      
      const updated = await userService.updateUser(editingUser.userId!, updateData);
      console.log("✅ Updated user:", updated);
      
      await loadUsers();
      
      if (selectedUser?.userId === editingUser.userId) {
        setSelectedUser({ ...editingUser, ...updateData });
      }
      
      setEditingUser(null);
      setShowEditModal(false);
      showToast("Cập nhật thông tin thành công!", "success");
    } catch (err: any) {
      console.error("Update user error:", err);
      const errorMsg = err?.error || err?.message || "Cập nhật thông tin thất bại";
      showToast(errorMsg, "error");
    }
  };

  /* ================= DELETE USER ================= */
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${userName}"?`)) return;
    
    try {
      await userService.deleteUser(userId);
      console.log("✅ Deleted user:", userId);
      
      await loadUsers();
      
      if (selectedUser?.userId === userId) {
        setSelectedUser(null);
      }
      
      showToast("Xóa người dùng thành công!", "success");
    } catch (err: any) {
      console.error("Delete user error:", err);
      let errorMsg = "Xóa người dùng thất bại";
      
      if (err?.error) {
        errorMsg = err.error;
      } else if (err?.message) {
        errorMsg = err.message;
      } else if (typeof err === "string") {
        errorMsg = err;
      }
      
      if (errorMsg.toLowerCase().includes("admin") || errorMsg.toLowerCase().includes("không thể xóa")) {
        showToast(errorMsg, "warning");
      } else {
        showToast(errorMsg, "error");
      }
    }
  };

  /* ================= OPEN EDIT MODAL ================= */
  const openEditModal = () => {
    if (selectedUser) {
      setEditingUser({ ...selectedUser, password: "" });
      setShowEditModal(true);
    }
  };

  /* ================= FILTER USERS ================= */
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.position?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadUsers();
    loadPositions();
  }, []);

  /* ================= RENDER LOADING ================= */
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "91vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>⏳</div>
          <div>Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "91vh" }}>
        <div style={{ textAlign: "center", color: "#ef4444" }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>❌</div>
          <div>{error}</div>
          <button 
            onClick={loadUsers}
            style={{ marginTop: 16, padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "91vh",
        background: "#f4f7fb",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 10000,
            padding: "12px 20px",
            borderRadius: 12,
            backgroundColor: toast.type === "success" ? "#10b981" : toast.type === "warning" ? "#f59e0b" : "#ef4444",
            color: "#fff",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "slideIn 0.3s ease",
            maxWidth: 400,
          }}
        >
          <span>
            {toast.type === "success" ? "✅" : toast.type === "warning" ? "⚠️" : "❌"}
          </span>
          <span style={{ flex: 1, fontSize: 14 }}>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ================= LEFT PANEL ================= */}
      <div
        style={{
          width: 340,
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 10px rgba(0,0,0,0.03)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <h2
          style={{
            marginBottom: 20,
            fontSize: 24,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          📋 Thông tin người dùng
        </h2>

        {!selectedUser ? (
          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            👈 Chọn user để xem chi tiết
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              animation: "fadeIn 0.25s ease",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 700,
                margin: "0 auto 20px",
                boxShadow: "0 10px 20px rgba(37,99,235,0.25)",
              }}
            >
              {selectedUser.name?.charAt(0) || "?"}
            </div>

            <h3
              style={{
                textAlign: "center",
                marginBottom: 8,
                fontSize: 22,
              }}
            >
              {selectedUser.name}
            </h3>

            <div
              style={{
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {selectedUser.position && (
                <span
                  style={{
                    background: "#e0e7ff",
                    color: "#4338ca",
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  📌 {selectedUser.position}
                </span>
              )}
            </div>

            {/* Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <InfoItem label="Tên đăng nhập" value={selectedUser.userName} />
              <InfoItem label="Email" value={selectedUser.email} />
              <InfoItem label="Số điện thoại" value={selectedUser.phone} />
              <InfoItem label="Địa chỉ" value={selectedUser.address} />
              <InfoItem label="Mật khẩu" value={"•".repeat(8)} />
              <InfoItem label="Ngày tham gia" value={selectedUser.joinedAt || "Chưa cập nhật"} />
              <InfoItem label="Trạng thái" value={selectedUser.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"} />
            </div>
            
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={openEditModal}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "0.25s",
                  boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
                }}
              >
                ✏️ Chỉnh sửa
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser.userId!, selectedUser.userName)}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg,#dc2626,#ef4444)",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "0.25s",
                }}
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div
        style={{
          flex: 1,
          padding: 25,
          overflow: "auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 25,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 5,
              }}
            >
              👥 Danh sách người dùng
            </h2>
            <p style={{ color: "#6b7280" }}>Quản lý toàn bộ người dùng hệ thống</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: "linear-gradient(135deg,#2563eb,#3b82f6)",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 600,
              transition: "0.25s",
              boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
            }}
          >
            + Thêm User
          </button>
        </div>

        {/* SEARCH */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            gap: 10,
          }}
        >
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên, tên đăng nhập, email hoặc chức vụ..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              flex: 1,
              padding: "14px 18px",
              borderRadius: 14,
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: 15,
              transition: "0.25s",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
            }}
          />
        </div>

        {/* TABLE */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                color: "#fff",
              }}
            >
              <tr>
                <th style={thStyle}>Tên</th>
                <th style={thStyle}>Tên đăng nhập</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Chức vụ</th>
                <th style={thStyle}>Số điện thoại</th>
                <th style={thStyle}>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.userId}
                  onClick={() => setSelectedUser(user)}
                  style={{
                    cursor: "pointer",
                    transition: "0.25s",
                    background: selectedUser?.userId === user.userId ? "#eff6ff" : "#fff",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUser?.userId !== user.userId) {
                      e.currentTarget.style.background = "#eff6ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser?.userId !== user.userId) {
                      e.currentTarget.style.background = "#fff";
                    }
                  }}
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                  </td>
                  <td style={tdStyle}>{user.userName}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    {user.position ? (
                      <span
                        style={{
                          background: "#e0e7ff",
                          color: "#4338ca",
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {user.position}
                      </span>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>{user.phone}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        background: user.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                        color: user.status === "ACTIVE" ? "#15803d" : "#dc2626",
                      }}
                    >
                      {user.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                </tr>
                
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              padding: 20,
              background: "#fff",
            }}
          >
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: currentPage === 1 ? "#f3f4f6" : "#fff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Prev
            </button>

            <span
              style={{
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Trang {currentPage} / {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: currentPage === totalPages ? "#f3f4f6" : "#fff",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL ADD USER ================= */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            style={{
              width: 500,
              background: "#fff",
              borderRadius: 20,
              padding: 25,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                marginBottom: 20,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              ➕ Thêm người dùng
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <input
                  placeholder="Họ tên *"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.name ? "#ef4444" : "#d1d5db" }}
                />
                {formErrors.name && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formErrors.name}</div>}
              </div>

              <div>
                <input
                  placeholder="Tên đăng nhập *"
                  value={newUser.userName}
                  onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.userName ? "#ef4444" : "#d1d5db" }}
                />
                {formErrors.userName && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formErrors.userName}</div>}
              </div>

              <div>
                <input
                  placeholder="Email *"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.email ? "#ef4444" : "#d1d5db" }}
                />
                {formErrors.email && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formErrors.email}</div>}
              </div>

              <div>
                <input
                  placeholder="Mật khẩu * (ít nhất 6 ký tự)"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.password ? "#ef4444" : "#d1d5db" }}
                />
                {formErrors.password && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formErrors.password}</div>}
              </div>

              <div>
                <input
                  placeholder="Số điện thoại *"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.phone ? "#ef4444" : "#d1d5db" }}
                />
                {formErrors.phone && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formErrors.phone}</div>}
              </div>

              <div>
                <input
                  placeholder="Địa chỉ *"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.address ? "#ef4444" : "#d1d5db" }}
                />
                {formErrors.address && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formErrors.address}</div>}
              </div>

              <div>
                <select
                  value={newUser.position}
                  onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                  style={{ ...inputStyle, borderColor: formErrors.position ? "#ef4444" : "#d1d5db" }}
                >
                  <option value="">-- Chọn chức vụ * --</option>
                  {positionsLoading ? (
                    <option disabled>Đang tải...</option>
                  ) : (
                    positions.map((position) => (
                      <option key={position.positionId} value={position.positionName}>
                        {position.positionName}
                      </option>
                    ))
                  )}
                </select>
                {formErrors.position && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{formErrors.position}</div>}
              </div>

              <select
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                style={inputStyle}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}</option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 25,
              }}
            >
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewUser(emptyForm);
                  setFormErrors({});
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>

              <button
                onClick={handleAddUser}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Thêm User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT USER ================= */}
      {showEditModal && editingUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            style={{
              width: 480,
              background: "#fff",
              borderRadius: 20,
              padding: 25,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                marginBottom: 20,
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              ✏️ Cập nhật thông tin
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <input
                placeholder="Họ tên"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Tên đăng nhập"
                value={editingUser.userName}
                onChange={(e) => setEditingUser({ ...editingUser, userName: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Mật khẩu mới"
                type="password"
                value={editingUser.password === "********" ? "" : editingUser.password}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                style={inputStyle}
              />
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: -8, marginBottom: 0 }}>
                * Để trống nếu không muốn đổi mật khẩu (tối thiểu 6 ký tự nếu nhập)
              </p>

              <input
                placeholder="Số điện thoại"
                value={editingUser.phone}
                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Địa chỉ"
                value={editingUser.address}
                onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                style={inputStyle}
              />

              <select
                value={editingUser.position || ""}
                onChange={(e) => setEditingUser({ ...editingUser, position: e.target.value })}
                style={inputStyle}
              >
                <option value="">-- Chọn chức vụ --</option>
                {positionsLoading ? (
                  <option disabled>Đang tải...</option>
                ) : (
                  positions.map((position) => (
                    <option key={position.positionId} value={position.positionName}>
                      {position.positionName}
                    </option>
                  ))
                )}
              </select>

              <select
                value={editingUser.status}
                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                style={inputStyle}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}</option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 25,
              }}
            >
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>

              <button
                onClick={handleUpdateUser}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg,#2563eb,#3b82f6)",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ================= COMPONENT ================= */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#f9fafb",
        padding: 12,
        borderRadius: 12,
        transition: "0.2s",
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#6b7280",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontWeight: 600,
          color: "#111827",
        }}
      >
        {value || "Chưa cập nhật"}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const thStyle: React.CSSProperties = {
  padding: "18px",
  textAlign: "left",
  fontSize: 14,
};

const tdStyle: React.CSSProperties = {
  padding: "18px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: 14,
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "95%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: 14,
};