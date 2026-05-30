import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function Requests() {
  const navigate = useNavigate();

  // SEARCH
const [search, setSearch] = useState("");

  // DATA TẠM
  const requests = [
    {
      id: 1,
      title: "Cấp lại tài khoản",
      status: "Đã duyệt",
      date: "12/05/2026",
    },

    {
      id: 2,
      title: "Yêu cầu thiết bị mới",
      status: "Đang xử lý",
      date: "10/05/2026",
    },

    {
      id: 3,
      title: "Reset mật khẩu",
      status: "Từ chối",
      date: "08/05/2026",
    },

    {
      id: 4,
      title: "Cấp quyền hệ thống",
      status: "Yêu cầu chỉnh sửa lại",
      date: "06/05/2026",
    },

    {
      id: 5,
      title: "Cập nhật thông tin",
      status: "Đã duyệt",
      date: "03/05/2026",
    },
  ];

  // FILTER
const filteredRequests =
  requests.filter((item) => {
    const keyword =
      search.toLowerCase();

    return (
      item.title
        .toLowerCase()
        .includes(keyword) ||
      item.date
        .toLowerCase()
        .includes(keyword) ||
      item.status
        .toLowerCase()
        .includes(keyword)
    );
  });

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Danh sách yêu cầu
          </h1>

          <p style={styles.subTitle}>
            Theo dõi trạng thái các yêu cầu
          </p>
        </div>
      </div>

{/* SEARCH */}
<div style={styles.searchContainer}>
  <div style={styles.searchBox}>
    <Search
      size={18}
      color="#64748b"
    />

    <input
      type="text"
      placeholder="Tìm theo tên, ngày gửi hoặc trạng thái..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      style={styles.searchInput}
    />
  </div>
</div>

      {/* LIST */}
      <div style={styles.list}>
        {filteredRequests.map((item) => (
          <div
            key={item.id}
            style={styles.card}
            onClick={() =>
              navigate(
                `/user/request/${item.id}`
              )
            }
          >
            <div>
              <h3
                style={styles.requestTitle}
              >
                {item.title}
              </h3>

              <p style={styles.date}>
                {item.date}
              </p>
            </div>

            <div
              style={{
                ...styles.status,

                background:
                  item.status ===
                  "Đã duyệt"
                    ? "#dcfce7"
                    : item.status ===
                      "Đang xử lý"
                    ? "#fef3c7"
                    : "#fee2e2",

                color:
                  item.status ===
                  "Đã duyệt"
                    ? "#166534"
                    : item.status ===
                      "Đang xử lý"
                    ? "#92400e"
                    : "#991b1b",
              }}
            >
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: {
  [key: string]: React.CSSProperties;
} = {
  container: {
    display: "flex",

    flexDirection: "column",

    gap: 24,

    height: "100%",
  },

  header: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",
  },

  title: {
    margin: 0,

    fontSize: 34,

    fontWeight: 800,

    color: "#0f172a",
  },

  subTitle: {
    marginTop: 10,

    color: "#64748b",

    fontSize: 15,
  },

  // SEARCH
searchContainer: {
  width: "100%",
},

  searchBox: {
    flex: 1,

    minWidth: 260,

    background: "white",

    display: "flex",

    alignItems: "center",

    gap: 12,

    padding: "0 16px",

    borderRadius: 18,

    border: "1px solid #e2e8f0",

    boxShadow:
      "0 4px 14px rgba(0,0,0,0.04)",
  },

  searchInput: {
    flex: 1,

    border: "none",

    outline: "none",

    padding: "16px 0",

    fontSize: 15,

    background: "transparent",
  },

  // LIST
  list: {
    display: "flex",

    flexDirection: "column",

    gap: 18,

    maxHeight: "650px",

    overflowY: "auto",

    paddingRight: 8,
  },

  card: {
    background: "rgba(255,255,255,0.85)",

    backdropFilter: "blur(12px)",

    padding: 24,

    borderRadius: 24,

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.05)",

    cursor: "pointer",

    transition: "0.2s",
  },

  requestTitle: {
    margin: 0,

    fontSize: 20,

    fontWeight: 700,

    color: "#0f172a",
  },

  date: {
    marginTop: 8,

    color: "#64748b",

    fontSize: 14,
  },

  status: {
    padding: "10px 18px",

    borderRadius: 14,

    fontWeight: 700,

    fontSize: 14,
  },
};