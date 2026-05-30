import { useMemo, useState } from "react";

type User = {
  id: number;
  name: string;
  role: string;
  joinedAt: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  status: "ACTIVE" | "INACTIVE";
};

export default function Users() {
  /* ================= MOCK DATA ================= */
  const [users, setUsers] = useState<User[]>([
{
  id: 1,
  name: "Nguyễn Văn An",
  role: "MANAGER",
  joinedAt: "12/05/2024",
  email: "an.manager@gmail.com",
  phone: "0901234567",
  address: "Hà Nội",
  password: "123456",
  status: "ACTIVE",
},
{
  id: 2,
  name: "Nguyễn Văn B",
  role: "MANAGER",
  joinedAt: "12/05/2024",
  email: "an.manager@gmail.com",
  phone: "0901234567",
  address: "Hà Nội",
  password: "123456",
  status: "ACTIVE",
},
{
  id: 3,
  name: "Nguyễn Văn C",
  role: "MANAGER",
  joinedAt: "12/05/2024",
  email: "an.manager@gmail.com",
  phone: "0901234567",
  address: "Hà Nội",
  password: "123456",
  status: "ACTIVE",
},
  ]);

  /* ================= ROLE STATIC ================= */
  const roles = ["MANAGER", "HR", "CEO", "STAFF"];
  const status = ["ACTIVE"];
  /* ================= STATES ================= */
  const [selectedUser, setSelectedUser] = useState<User | null>(users[0]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const USERS_PER_PAGE = 6;

  const [showAddModal, setShowAddModal] = useState(false);
//  const [editingUserId, setEditingUserId] = useState<number | null>(null);

const emptyForm = {
  name: "",
  role: "",
  email: "",
  phone: "",
  address: "",
  joinedAt: "",
  password: "",
  status: "ACTIVE",
};

const [newUser, setNewUser] = useState(emptyForm);

  /* ================= FILTER ================= */
const filteredUsers = useMemo(() => {
  return users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
}, [users, search]);

const totalPages = Math.ceil(
  filteredUsers.length / USERS_PER_PAGE
);

const paginatedUsers = filteredUsers.slice(
  (currentPage - 1) * USERS_PER_PAGE,
  currentPage * USERS_PER_PAGE
);

  /* ================= ADD USER ================= */
  const handleAddUser = () => {
    if (!newUser.name.trim()) {
      alert("Vui lòng nhập tên");
      return;
    }

    const user: User = {
      id: Date.now(),
      name: newUser.name,
      role: newUser.role,
      joinedAt: new Date().toLocaleDateString(),
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      password: newUser.password,
      status: "ACTIVE",
    };

    setUsers((prev) => [...prev, user]);

  setNewUser(emptyForm);

    setShowAddModal(false);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "91vh",
        background: "#f4f7fb",
        overflow: "hidden",
      }}
    >
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
           Thông tin người dùng
        </h2>

        {!selectedUser ? (
          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Chọn user để xem chi tiết
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
                background:
                  "linear-gradient(135deg, #2563eb, #3b82f6)",
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
              {selectedUser.name.charAt(0)}
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
              <span
                style={{
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {selectedUser.role}
              </span>
            </div>

            {/* Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <InfoItem
                label="Email"
                value={selectedUser.email}
              />

              <InfoItem
                label="Số điện thoại"
                value={selectedUser.phone}
              />

              <InfoItem
                label="Địa chỉ"
                value={selectedUser.address}
              />
<InfoItem
  label="Mật khẩu"
  value={"•".repeat(selectedUser.password.length)}
/>
              <InfoItem
                label="Ngày tham gia"
                value={selectedUser.joinedAt}
              />

              <InfoItem
                label="Trạng thái"
                value={selectedUser.status}
              />
            </div>
            <button
            onClick={() => setShowAddModal(true)}
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)",
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 600,
              transition: "0.25s",
              boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
            }}
          >
            Chỉnh sửa thông tin
          </button>
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
              Danh sách người dùng
            </h2>

            <p style={{ color: "#6b7280" }}>
              Quản lý toàn bộ người dùng hệ thống
            </p>
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)",
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
            placeholder=" Tìm kiếm người dùng..."
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
                background:
                  "linear-gradient(135deg,#1e3a8a,#2563eb)",
                color: "#fff",
              }}
            >
              <tr>
                <th style={thStyle}>Tên</th>
                <th style={thStyle}>Vai trò</th>
                <th style={thStyle}>Ngày tham gia</th>
                <th style={thStyle}>Mật khẩu</th>
                <th style={thStyle}>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  style={{
                    cursor: "pointer",
                    transition: "0.25s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "#eff6ff";
                    e.currentTarget.style.transform =
                      "scale(1.003)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "#fff";
                    e.currentTarget.style.transform =
                      "scale(1)";
                  }}
                >
                  <td style={tdStyle}>{user.name}</td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td style={tdStyle}>{user.joinedAt}</td>
                  <td style={tdStyle}>
  {"•".repeat(user.password.length)}
</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        background:
                          user.status === "ACTIVE"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          user.status === "ACTIVE"
                            ? "#15803d"
                            : "#dc2626",
                      }}
                    >
                      {user.status}
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
    onClick={() =>
      setCurrentPage((prev) => Math.max(prev - 1, 1))
    }
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
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(prev + 1, totalPages)
      )
    }
    style={{
      padding: "8px 14px",
      borderRadius: 10,
      border: "1px solid #d1d5db",
      background:
        currentPage === totalPages
          ? "#f3f4f6"
          : "#fff",
      cursor:
        currentPage === totalPages
          ? "not-allowed"
          : "pointer",
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
              Thêm người dùng
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
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    name: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    email: e.target.value,
                  })
                }
                style={inputStyle}
              />
              <input
                placeholder="Mật khẩu"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    password: e.target.value,
                  })
                }
                style={inputStyle}
              />
              <input
                placeholder="Số điện thoại"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    phone: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                placeholder="Địa chỉ"
                value={newUser.address}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    address: e.target.value,
                  })
                }
                style={inputStyle}
              />

              {/* ROLE */}
              <select
                
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value,
                  })
                }
                style={inputStyle}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
                            <select
                
                value={newUser.status}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    status: e.target.value,
                  })
                }
                style={inputStyle}
              >
                {status.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* ACTION */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 25,
              }}
            >
              <button
                onClick={() => setShowAddModal(false)}
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
                  background:
                    "linear-gradient(135deg,#2563eb,#3b82f6)",
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
    </div>
  );
}

/* ================= COMPONENT ================= */
function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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
        {value}
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