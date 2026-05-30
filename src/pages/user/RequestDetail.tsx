// src/pages/user/RequestDetail.tsx

import React from "react";
import {
  CalendarDays,
  CircleCheck,
  FileText,
  User,
//   
  Pencil,
  Paperclip,
  Download,
} from "lucide-react";

export default function RequestDetail() {
  // SAU NÀY LẤY THEO ID API
  const request = {
    id: "REQ-001",

    title: "Yêu cầu cấp lại tài khoản",

    description:
      "Tôi không thể đăng nhập vào hệ thống do quên mật khẩu. Mong admin hỗ trợ cấp lại tài khoản.",

    status: "Đang xử lý",

    createdDate: "12/05/2026",

    createdBy: "Nguyễn Văn A",

    response:
      "Admin đã reset mật khẩu và gửi thông tin qua email.",
    attachment:
  "HopDongYeuCau.pdf",
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.headerCard}>
        <div>
          <h1 style={styles.title}>
            {request.title}
          </h1>

          <p style={styles.requestId}>
            Mã yêu cầu: {request.id}
          </p>
        </div>

        <div
          style={{
            ...styles.status,

            background: "#dcfce7",

            color: "#166534",
          }}
        >
          {request.status}
        </div>
      </div>

      {/* INFO */}
      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <User size={22} color="#0284c7" />

          <div>
            <p style={styles.label}>
              Người gửi
            </p>

            <h3 style={styles.value}>
              {request.createdBy}
            </h3>
          </div>
        </div>

        <div style={styles.infoCard}>
          <CalendarDays
            size={22}
            color="#6366f1"
          />

          <div>
            <p style={styles.label}>
              Ngày tạo
            </p>

            <h3 style={styles.value}>
              {request.createdDate}
            </h3>
          </div>
        </div>

        <div style={styles.infoCard}>
          <CircleCheck
            size={22}
            color="#10b981"
          />

          <div>
            <p style={styles.label}>
              Trạng thái
            </p>

            <h3 style={styles.value}>
              {request.status}
            </h3>
          </div>
        </div>
      </div>
{/* ACTION BUTTONS */}
<div style={styles.actionContainer}>
  {/* EDIT */}
  <button
    style={{
      ...styles.actionButton,

      background:
        "linear-gradient(135deg,#3b82f6,#2563eb)",
    }}
  >
    <Pencil size={18} />

    Chỉnh sửa yêu cầu
  </button>

  {/* APPROVE / REJECT */}
  {request.status ===
    "Đang xử lý" && (
    <>
      <button
        style={{
          ...styles.actionButton,

          background:
            "linear-gradient(135deg,#10b981,#059669)",
        }}
      >
        Duyệt yêu cầu
      </button>

      <button
        style={{
          ...styles.actionButton,

          background:
            "linear-gradient(135deg,#ef4444,#dc2626)",
        }}
      >
        Không duyệt
      </button>
    </>
  )}
</div>
      {/* CONTENT */}
      <div style={styles.contentCard}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FileText
              size={20}
              color="#0284c7"
            />

            <h2 style={styles.sectionTitle}>
              Nội dung yêu cầu
            </h2>
          </div>

          <p style={styles.description}>
            {request.description}
          </p>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <CircleCheck
              size={20}
              color="#10b981"
            />

            <h2 style={styles.sectionTitle}>
              Phản hồi
            </h2>
          </div>

          <div style={styles.responseBox}>
            {request.response}
          </div>
          {/* ATTACHMENT */}
<div style={styles.section}>
  <div style={styles.sectionHeader}>
    <Paperclip
      size={20}
      color="#0284c7"
    />

    <h2 style={styles.sectionTitle}>
      Tệp đính kèm
    </h2>
  </div>

  <div style={styles.attachmentBox}>
    <div style={styles.fileInfo}>
      <Paperclip
        size={18}
        color="#0284c7"
      />

      <span>
        {request.attachment}
      </span>
    </div>

    <button
      style={styles.downloadButton}
    >
      <Download size={16} />

      Tải xuống
    </button>
  </div>
</div>
        </div>
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
  },

  headerCard: {
    background:
      "linear-gradient(135deg,#0ea5e9,#3b82f6)",

    padding: 30,

    borderRadius: 28,

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    color: "white",

    boxShadow:
      "0 15px 35px rgba(14,165,233,0.25)",
  },

  title: {
    margin: 0,

    fontSize: 34,

    fontWeight: 800,
  },

  requestId: {
    marginTop: 10,

    color: "#dbeafe",
  },

  status: {
    padding: "12px 18px",

    borderRadius: 16,

    fontWeight: 700,

    fontSize: 15,
  },

  infoGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",

    gap: 20,
  },

  infoCard: {
    background: "rgba(255,255,255,0.8)",

    padding: 24,

    borderRadius: 24,

    display: "flex",

    alignItems: "center",

    gap: 16,

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.05)",
  },

  label: {
    margin: 0,

    color: "#64748b",
  },

  value: {
    marginTop: 8,

    color: "#0f172a",
  },

  contentCard: {
    background: "rgba(255,255,255,0.85)",

    borderRadius: 28,

    padding: 30,

    display: "flex",

    flexDirection: "column",

    gap: 30,

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  },

  section: {
    display: "flex",

    flexDirection: "column",

    gap: 18,
  },

  sectionHeader: {
    display: "flex",

    alignItems: "center",

    gap: 12,
  },

  sectionTitle: {
    margin: 0,

    fontSize: 22,

    fontWeight: 700,

    color: "#0f172a",
  },

  description: {
    margin: 0,

    lineHeight: 1.8,

    color: "#334155",

    fontSize: 16,
  },

  responseBox: {
    background: "#f8fafc",

    padding: 22,

    borderRadius: 20,

    color: "#0f172a",

    lineHeight: 1.8,

    border: "1px solid #e2e8f0",
  },
  actionContainer: {
  display: "flex",

  gap: 16,
},

actionButton: {
  border: "none",

  padding: "16px 28px",

  borderRadius: 18,

  color: "white",

  fontWeight: 700,

  fontSize: 15,

  cursor: "pointer",

  boxShadow:
    "0 10px 25px rgba(0,0,0,0.15)",

  transition: "0.2s",
},
attachmentBox: {
  background: "#f8fafc",

  border: "1px solid #e2e8f0",

  borderRadius: 20,

  padding: 20,

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  gap: 20,

  flexWrap: "wrap",
},

fileInfo: {
  display: "flex",

  alignItems: "center",

  gap: 12,

  color: "#0f172a",

  fontWeight: 600,
},

downloadButton: {
  border: "none",

  background:
    "linear-gradient(135deg,#0ea5e9,#3b82f6)",

  color: "white",

  padding: "12px 18px",

  borderRadius: 14,

  cursor: "pointer",

  display: "flex",

  alignItems: "center",

  gap: 8,

  fontWeight: 700,
},
};