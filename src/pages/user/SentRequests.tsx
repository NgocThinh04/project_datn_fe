import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function SentRequests() {
  const navigate = useNavigate();

  // DATA TẠM
  const requests = [
    {
      id: 1,
      title: "Yêu cầu cấp tài khoản",

      date: "12/05/2026",

      status: "Đang xử lý",
    },

    {
      id: 2,
      title: "Reset mật khẩu",

      date: "10/05/2026",

      status: "Đã duyệt",
    },

    {
      id: 3,
      title: "Cấp thiết bị mới",

      date: "08/05/2026",

      status: "Từ chối",
    },

    {
      id: 4,
      title: "Cập nhật thông tin",

      date: "05/05/2026",

      status: "Đang xử lý",
    },

    {
      id: 5,
      title: "Cấp quyền truy cập",

      date: "03/05/2026",

      status: "Đã duyệt",
    },
  ];

  const getStatusIcon = (
    status: string
  ) => {
    if (status === "Đã duyệt")
      return (
        <CheckCircle2
          size={18}
          color="#16a34a"
        />
      );

    if (status === "Từ chối")
      return (
        <XCircle
          size={18}
          color="#dc2626"
        />
      );

    return (
      <Clock3
        size={18}
        color="#d97706"
      />
    );
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Yêu cầu đã gửi
          </h1>

          <p style={styles.subTitle}>
            Danh sách các yêu cầu bạn đã gửi
          </p>
        </div>
      </div>

      {/* LIST */}
      <div style={styles.listContainer}>
        {requests.map((item) => (
          <div
            key={item.id}
            style={styles.card}
            onClick={() =>
              navigate(
                `/user/request/${item.id}`
              )
            }
          >
            <div style={styles.left}>
              <div
                style={styles.iconBox}
              >
                {getStatusIcon(
                  item.status
                )}
              </div>

              <div>
                <h3
                  style={
                    styles.requestTitle
                  }
                >
                  {item.title}
                </h3>

                <p style={styles.date}>
                  Gửi ngày: {item.date}
                </p>
              </div>
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

    justifyContent:
      "space-between",

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

  headerIcon: {
    width: 60,

    height: 60,

    borderRadius: 20,

    background:
      "linear-gradient(135deg,#0ea5e9,#2563eb)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    boxShadow:
      "0 12px 30px rgba(37,99,235,0.25)",
  },

  listContainer: {
    display: "flex",

    flexDirection: "column",

    gap: 18,

    overflowY: "auto",

    maxHeight: "700px",

    paddingRight: 8,
  },

  card: {
    background: "white",

    borderRadius: 24,

    padding: 24,

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    cursor: "pointer",

    boxShadow:
      "0 8px 24px rgba(0,0,0,0.05)",

    transition: "0.2s",
  },

  left: {
    display: "flex",

    alignItems: "center",

    gap: 18,
  },

  iconBox: {
    width: 50,

    height: 50,

    borderRadius: 16,

    background: "#f1f5f9",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",
  },

  requestTitle: {
    margin: 0,

    fontSize: 18,

    fontWeight: 700,

    color: "#0f172a",
  },

  date: {
    marginTop: 8,

    color: "#64748b",

    fontSize: 14,
  },

  status: {
    padding: "10px 16px",

    borderRadius: 14,

    fontWeight: 700,

    fontSize: 14,
  },
};