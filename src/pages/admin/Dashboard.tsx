// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  Bell,
  Activity,
  TrendingUp,
  XCircle,
  UserPlus,
  Send,
} from "lucide-react";
import dashboardService, { type DashboardStats, type RecentActivity } from "../../services/dashboardService";

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboardStats();
      setStats(data);
      console.log("✅ Dashboard stats loaded:", data);
    } catch (err: any) {
      console.error("Load dashboard error:", err);
      setError(err.message || "Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "REQUEST_CREATED":
        return <Send size={16} color="#0284c7" />;
      case "REQUEST_APPROVED":
        return <CheckCircle size={16} color="#10b981" />;
      case "REQUEST_REJECTED":
        return <XCircle size={16} color="#ef4444" />;
      case "USER_CREATED":
        return <UserPlus size={16} color="#8b5cf6" />;
      default:
        return <Activity size={16} color="#6b7280" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "REQUEST_CREATED":
        return "#e0f2fe";
      case "REQUEST_APPROVED":
        return "#d1fae5";
      case "REQUEST_REJECTED":
        return "#fee2e2";
      case "USER_CREATED":
        return "#ede9fe";
      default:
        return "#f1f5f9";
    }
  };

  const statsCards = [
    {
      title: "Tổng nhân viên",
      value: stats?.totalEmployees || 0,
      icon: <Users size={34} color="#8b5cf6" />,
      color: "#ede9fe",
    },
    {
      title: "Tổng yêu cầu",
      value: stats?.totalRequests || 0,
      icon: <FileText size={34} color="#0284c7" />,
      color: "#e0f2fe",
    },
    {
      title: "Đang chờ duyệt",
      value: stats?.pendingRequests || 0,
      icon: <Clock size={34} color="#f59e0b" />,
      color: "#fef3c7",
    },
    {
      title: "Đã duyệt",
      value: stats?.approvedRequests || 0,
      icon: <CheckCircle size={34} color="#10b981" />,
      color: "#d1fae5",
    },
    {
      title: "Từ chối",
      value: stats?.rejectedRequests || 0,
      icon: <XCircle size={34} color="#ef4444" />,
      color: "#fee2e2",
    },
  ];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Đang tải dữ liệu thống kê...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>❌</div>
        <p style={styles.errorText}>{error}</p>
        <button onClick={loadDashboardStats} style={styles.retryButton}>
          Thử lại
        </button>
      </div>
    );
  }

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

      {/* STATS CARDS */}
      <div style={styles.statsGrid}>
        {statsCards.map((item, index) => (
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
        {/* LEFT - Recent Activities */}
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
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((item, index) => (
                <div key={index} style={styles.activityItem}>
                  <div style={styles.activityLeft}>
                    <div
                      style={{
                        ...styles.activityCircle,
                        backgroundColor: getActivityColor(item.type),
                      }}
                    >
                      {getActivityIcon(item.type)}
                    </div>
                    <div>
                      <p style={styles.activityTitle}>
                        <strong>{item.userName}</strong> {getActivityMessage(item.type, item.title)}
                      </p>
                      <p style={styles.activityTime}>{item.formattedTime}</p>
                    </div>
                  </div>
                  <span
                    style={{
                      ...styles.activityStatus,
                      ...(item.status === "Đã duyệt"
                        ? { background: "#d1fae5", color: "#166534" }
                        : item.status === "Từ chối"
                        ? { background: "#fee2e2", color: "#991b1b" }
                        : { background: "#fef3c7", color: "#92400e" }),
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <p>Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - Summary */}
        <div style={styles.rightPanel}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>📊 Tóm tắt nhanh</h3>
            <div style={styles.summaryItem}>
              <span>✅ Tỷ lệ duyệt</span>
              <strong>
                {stats?.totalRequests && stats.totalRequests > 0
                  ? Math.round(((stats.approvedRequests || 0) / stats.totalRequests) * 100)
                  : 0}%
              </strong>
            </div>
            <div style={styles.summaryItem}>
              <span>⏳ Chờ xử lý</span>
              <strong>{stats?.pendingRequests || 0}</strong>
            </div>
            <div style={styles.summaryItem}>
              <span>👥 Tổng nhân viên</span>
              <strong>{stats?.totalEmployees || 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
const getActivityMessage = (type: string, title: string): string => {
  switch (type) {
    case "REQUEST_CREATED":
      return `đã gửi yêu cầu "${title}"`;
    case "REQUEST_APPROVED":
      return `đã duyệt yêu cầu "${title}"`;
    case "REQUEST_REJECTED":
      return `đã từ chối yêu cầu "${title}"`;
    case "USER_CREATED":
      return `đã thêm nhân viên mới "${title}"`;
    default:
      return `đã thực hiện hành động trên "${title}"`;
  }
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)",
    padding: 30,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: 16,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
  },
  retryButton: {
    padding: "10px 20px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  header: {
    background: "linear-gradient(135deg,#0ea5e9 0%, #38bdf8 50%, #60a5fa 100%)",
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
    background: "linear-gradient(135deg,#0284c7,#38bdf8)",
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
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
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
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  activityTitle: {
    margin: 0,
    fontSize: 14,
    color: "#1e293b",
  },
  activityTime: {
    marginTop: 5,
    fontSize: 12,
    color: "#94a3b8",
  },
  activityStatus: {
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  summaryCard: {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(14px)",
    borderRadius: 30,
    padding: 28,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  summaryTitle: {
    margin: "0 0 20px 0",
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  emptyState: {
    textAlign: "center",
    padding: 40,
    color: "#94a3b8",
  },
};

// Thêm animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;