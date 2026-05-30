// src/pages/admin/Dashboard.tsx

import React from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  Bell,
  Activity,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Tổng yêu cầu",
      value: "1",
      icon: <FileText size={34} color="#0284c7" />,
      color: "#e0f2fe",
    },
    {
      title: "Đang chờ duyệt",
      value: "1",
      icon: <Clock size={34} color="#f59e0b" />,
      color: "#fef3c7",
    },
    {
      title: "Đã duyệt",
      value: "1",
      icon: <CheckCircle size={34} color="#10b981" />,
      color: "#d1fae5",
    },
    {
      title: "Người dùng",
      value: "1",
      icon: <Users size={34} color="#8b5cf6" />,
      color: "#ede9fe",
    },
  ];

  const activities = [
    "Nguyễn Văn A gửi yêu cầu mới",
    "Yêu cầu #REQ-203 đã được phê duyệt",
    "Admin cập nhật quyền người dùng",
    "Có 12 yêu cầu đang chờ xử lý",
  ];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Dashboard Quản Trị</h1>

          <p style={styles.headerSubtitle}>
            Theo dõi hoạt động hệ thống và quản lý người dùng
          </p>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.dateBox}>
            <TrendingUp size={18} color="#0284c7" />

            <span style={styles.dateText}>Hệ thống hoạt động ổn định</span>
          </div>

          <div style={styles.notificationButton}>
            <Bell size={20} color="white" />

            <div style={styles.notificationDot} />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        {stats.map((item, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <p style={styles.cardLabel}>{item.title}</p>

                <h2 style={styles.cardValue}>{item.value}</h2>
              </div>

              <div
                style={{
                  ...styles.iconWrapper,
                  backgroundColor: item.color,
                }}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div style={styles.contentGrid}>
        {/* LEFT */}
        <div style={styles.largeCard}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Hoạt động gần đây</h2>

              <p style={styles.sectionSubtitle}>
                Các hoạt động mới nhất của hệ thống
              </p>
            </div>

            <div style={styles.activityIcon}>
              <Activity size={22} color="#0284c7" />
            </div>
          </div>

          <div style={styles.activityList}>
            {activities.map((item, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.activityLeft}>
                  <div style={styles.activityCircle} />

                  <div>
                    <p style={styles.activityTitle}>{item}</p>

                    <p style={styles.activityTime}>5 phút trước</p>
                  </div>
                </div>

                <button style={styles.viewButton}>Xem</button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.rightPanel}>
          {/* STATUS */}
          {/* <div style={styles.statusCard}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Trạng thái hệ thống</h2>

                <p style={styles.sectionSubtitle}>
                  Hiệu suất realtime
                </p>
              </div>

              <div style={styles.shieldIcon}>
                <ShieldCheck size={22} color="#0284c7" />
              </div>
            </div>

            <div style={styles.progressGroup}>
              <div>
                <div style={styles.progressHeader}>
                  <span style={styles.progressLabel}>
                    Hiệu suất server
                  </span>

                  <span style={styles.progressPercent}>92%</span>
                </div>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: "92%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={styles.progressHeader}>
                  <span style={styles.progressLabel}>
                    Dung lượng hệ thống
                  </span>

                  <span style={styles.progressPercent}>68%</span>
                </div>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: "68%",
                      background:
                        "linear-gradient(90deg,#10b981,#34d399)",
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={styles.progressHeader}>
                  <span style={styles.progressLabel}>
                    Bảo mật
                  </span>

                  <span style={styles.progressPercent}>100%</span>
                </div>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: "100%",
                      background:
                        "linear-gradient(90deg,#8b5cf6,#a78bfa)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div> */}

          {/* INFO BOX
          <div style={styles.infoBox}>
            <h2 style={styles.infoTitle}>
              Hệ thống đang hoạt động tốt
            </h2>

            <p style={styles.infoText}>
              Không phát hiện lỗi nghiêm trọng trong 24 giờ qua.
              Có 12 yêu cầu mới cần được xử lý hôm nay.
            </p>

            <button style={styles.reportButton}>
              Xem báo cáo
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
container: {
  height: "100vh",
  overflowY: "auto",
  overflowX: "hidden",

  background:
    "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)",

  padding: 30,
  fontFamily: "Arial, sans-serif",
},

  header: {
    background:
      "linear-gradient(135deg,#0ea5e9 0%, #38bdf8 50%, #60a5fa 100%)",
    borderRadius: 30,
    padding: 35,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    boxShadow: "0 10px 30px rgba(14,165,233,0.25)",
  },

  headerTitle: {
    color: "white",
    fontSize: 42,
    fontWeight: 800,
    margin: 0,
  },

  headerSubtitle: {
    color: "#e0f2fe",
    marginTop: 10,
    fontSize: 17,
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },

  dateBox: {
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(12px)",
    padding: "14px 18px",
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  dateText: {
    color: "white",
    fontWeight: 600,
  },

  notificationButton: {
    width: 55,
    height: 55,
    borderRadius: 18,
    background:
      "linear-gradient(135deg,#0284c7,#38bdf8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(2,132,199,0.35)",
  },

  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#ef4444",
    position: "absolute",
    top: 10,
    right: 10,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: 22,
    marginBottom: 30,
  },

  card: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: 28,
    padding: 25,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid rgba(255,255,255,0.6)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  cardLabel: {
    color: "#64748b",
    fontSize: 15,
    marginBottom: 10,
  },

  cardValue: {
    fontSize: 42,
    fontWeight: 800,
    color: "#0f172a",
    margin: 0,
  },

  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  growthBox: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 15,
  },

  growthText: {
    color: "#10b981",
    fontWeight: 700,
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 24,
  },

  largeCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: 30,
    padding: 28,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },

  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a",
  },

  sectionSubtitle: {
    marginTop: 6,
    color: "#94a3b8",
    fontSize: 14,
  },

  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    background: "#e0f2fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  activityItem: {
    background: "#f8fafc",
    borderRadius: 22,
    padding: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityLeft: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  activityCircle: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "#0ea5e9",
  },

  activityTitle: {
    margin: 0,
    fontWeight: 600,
    color: "#1e293b",
  },

  activityTime: {
    marginTop: 5,
    fontSize: 13,
    color: "#94a3b8",
  },

  viewButton: {
    border: "none",
    background: "#e0f2fe",
    color: "#0284c7",
    padding: "10px 16px",
    borderRadius: 14,
    fontWeight: 700,
    cursor: "pointer",
  },

  statusCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: 30,
    padding: 28,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },

  shieldIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    background: "#e0f2fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  progressGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressLabel: {
    color: "#475569",
    fontWeight: 500,
  },

  progressPercent: {
    color: "#0f172a",
    fontWeight: 700,
  },

  progressBar: {
    height: 12,
    borderRadius: 999,
    background: "#e2e8f0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    background:
      "linear-gradient(90deg,#0ea5e9,#38bdf8)",
  },

  infoBox: {
    borderRadius: 30,
    padding: 30,
    background:
      "linear-gradient(135deg,#0ea5e9,#38bdf8,#60a5fa)",
    color: "white",
    boxShadow: "0 12px 30px rgba(14,165,233,0.25)",
  },

  infoTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
  },

  infoText: {
    marginTop: 16,
    lineHeight: 1.7,
    color: "#e0f2fe",
  },

  reportButton: {
    marginTop: 24,
    border: "none",
    background: "white",
    color: "#0284c7",
    padding: "14px 22px",
    borderRadius: 18,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
  },
};

export default AdminDashboard;