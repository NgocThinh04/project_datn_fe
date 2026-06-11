import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Calendar, SortAsc, SortDesc } from "lucide-react";
import requestService, { type ApprovalRequest } from "../../services/user/requestService";

export default function Requests() {
  const navigate = useNavigate();

  // ==================== STATES ====================
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "title" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDateRange, setFilterDateRange] = useState<"all" | "today" | "week" | "month">("all");
  
  const ITEMS_PER_PAGE = 5;

  // ==================== LOAD DATA ====================
  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestService.getPendingRequests();
      setRequests(data);
      console.log("✅ Loaded requests:", data);
    } catch (err: any) {
      console.error("Load requests error:", err);
      setError(err.message || "Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ==================== HELPER FUNCTIONS ====================
  
  // Chuyển đổi status từ BE sang tiếng Việt
  const getStatusText = (status: string): string => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt";
      case "PENDING":
        return "Đang xử lý";
      case "REJECTED":
        return "Từ chối";
      case "CANCELLED":
        return "Đã hủy";
      case "IN_PROGRESS":
        return "Đang xử lý";
      case "REQUEST_CHANGES":
        return "Yêu cầu chỉnh sửa";
      default:
        return status;
    }
  };

  // Lấy style cho status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return { background: "#dcfce7", color: "#166534" };
      case "PENDING":
        return { background: "#fef3c7", color: "#92400e" };
      case "REJECTED":
        return { background: "#fee2e2", color: "#991b1b" };
      default:
        return { background: "#fef3c7", color: "#92400e" };
    }
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  // Lọc theo ngày
  const filterByDate = (dateStr: string, range: string): boolean => {
    if (range === "all" || !dateStr) return true;
    
    const today = new Date();
    const itemDate = new Date(dateStr);
    const diffTime = today.getTime() - itemDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    switch (range) {
      case "today":
        return diffDays < 1;
      case "week":
        return diffDays <= 7;
      case "month":
        return diffDays <= 30;
      default:
        return true;
    }
  };

  // Lọc và sắp xếp dữ liệu
  const filteredAndSortedRequests = useMemo(() => {
    let result = [...requests];
    
    // 1. Lọc theo từ khóa tìm kiếm
    if (search) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          getStatusText(item.status).toLowerCase().includes(keyword) ||
          formatDate(item.createdAt).includes(keyword) ||
          item.requestCode?.toLowerCase().includes(keyword) ||
          item.requestType?.toLowerCase().includes(keyword) ||
          item.requesterName?.toLowerCase().includes(keyword)
      );
    }
    
    // 2. Lọc theo trạng thái
    if (filterStatus !== "all") {
      result = result.filter((item) => getStatusText(item.status) === filterStatus);
    }
    
    // 3. Lọc theo thời gian
    result = result.filter((item) => filterByDate(item.createdAt, filterDateRange));
    
    // 4. Sắp xếp
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        comparison = dateA.getTime() - dateB.getTime();
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "status") {
        comparison = getStatusText(a.status).localeCompare(getStatusText(b.status));
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    return result;
  }, [requests, search, filterStatus, filterDateRange, sortBy, sortOrder]);

  // Phân trang
  const totalPages = Math.ceil(filteredAndSortedRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredAndSortedRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const toggleSort = (field: "date" | "title" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Xử lý click vào yêu cầu
  const handleRequestClick = (requestId: string) => {
    navigate(`/user/request/${requestId}`);
  };

  // ==================== RENDER ====================
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Đang tải danh sách yêu cầu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>❌</div>
        <p style={styles.errorText}>{error}</p>
        <button onClick={loadRequests} style={styles.retryButton}>
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
          <h1 style={styles.title}>Danh sách yêu cầu</h1>
          <p style={styles.subTitle}>Theo dõi trạng thái các yêu cầu của bạn</p>
        </div>
        <div style={styles.stats}>
          <span style={styles.statsBadge}>
            Tổng: {filteredAndSortedRequests.length} yêu cầu
          </span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Tìm theo tên, người gửi, loại, trạng thái..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.searchInput}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            handleFilterChange();
          }}
          style={styles.filterSelect}
        >
          <option value="all">📋 Tất cả trạng thái</option>
          <option value="Đã duyệt">✅ Đã duyệt</option>
          <option value="Đang xử lý">🔄 Đang xử lý</option>
          <option value="Từ chối">❌ Từ chối</option>
        </select>

        <select
          value={filterDateRange}
          onChange={(e) => {
            setFilterDateRange(e.target.value as any);
            handleFilterChange();
          }}
          style={styles.filterSelect}
        >
          <option value="all">📅 Tất cả thời gian</option>
          <option value="today">📆 Hôm nay</option>
          <option value="week">📊 7 ngày qua</option>
          <option value="month">📈 30 ngày qua</option>
        </select>
      </div>

      {/* SORT BAR */}
      <div style={styles.sortBar}>
        <span style={styles.sortLabel}>Sắp xếp theo:</span>
        <button
          onClick={() => toggleSort("date")}
          style={{
            ...styles.sortButton,
            background: sortBy === "date" ? "#e2e8f0" : "#fff",
          }}
        >
          <Calendar size={16} />
          Ngày tạo
          {sortBy === "date" && (
            sortOrder === "asc" ? <SortAsc size={14} /> : <SortDesc size={14} />
          )}
        </button>
        <button
          onClick={() => toggleSort("title")}
          style={{
            ...styles.sortButton,
            background: sortBy === "title" ? "#e2e8f0" : "#fff",
          }}
        >
          Tên yêu cầu
          {sortBy === "title" && (
            sortOrder === "asc" ? <SortAsc size={14} /> : <SortDesc size={14} />
          )}
        </button>
        <button
          onClick={() => toggleSort("status")}
          style={{
            ...styles.sortButton,
            background: sortBy === "status" ? "#e2e8f0" : "#fff",
          }}
        >
          Trạng thái
          {sortBy === "status" && (
            sortOrder === "asc" ? <SortAsc size={14} /> : <SortDesc size={14} />
          )}
        </button>
      </div>

      {/* LIST */}
      <div style={styles.list}>
        {paginatedRequests.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p style={styles.emptyText}>Không tìm thấy yêu cầu nào</p>
            <p style={styles.emptySubText}>Hãy thử thay đổi bộ lọc hoặc tạo yêu cầu mới</p>
          </div>
        ) : (
          paginatedRequests.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => handleRequestClick(item.id)}
            >
              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.requestTitle}>{item.title}</h3>
                    <span style={styles.requestCode}>{item.requestCode}</span>
                  </div>
                  <div style={{ ...styles.status, ...getStatusStyle(item.status) }}>
                    {getStatusText(item.status)}
                  </div>
                </div>
                <div style={styles.cardDetails}>
                  <span style={styles.detailItem}>
                    👤 {item.requesterName || "Không rõ"}
                  </span>
                  <span style={styles.detailItem}>
                    📂 {item.requestType || "Không xác định"}
                  </span>
                  <span style={styles.detailItem}>
                    📅 {formatDate(item.createdAt)}
                  </span>
                  {item.currentStepName && (
                    <span style={styles.detailItem}>
                      ⚡ Bước: {item.currentStepName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              ...styles.pageButton,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            <ChevronLeft size={18} />
            Trước
          </button>

          <div style={styles.pageNumbers}>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    ...styles.pageNumber,
                    background: currentPage === pageNum ? "#3b82f6" : "#fff",
                    color: currentPage === pageNum ? "#fff" : "#374151",
                    borderColor: currentPage === pageNum ? "#3b82f6" : "#e2e8f0",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span style={styles.pageDots}>...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  style={styles.pageNumber}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              ...styles.pageButton,
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Sau
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    height: "100%",
    padding: "0 4px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
    color: "#0f172a",
  },
  subTitle: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 15,
  },
  stats: {
    display: "flex",
    gap: 12,
  },
  statsBadge: {
    padding: "8px 16px",
    background: "rgba(59,130,246,0.1)",
    borderRadius: 20,
    color: "#2563eb",
    fontWeight: 600,
    fontSize: 14,
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  searchBox: {
    flex: 2,
    minWidth: 260,
    background: "white",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 16px",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "14px 0",
    fontSize: 14,
    background: "transparent",
  },
  filterSelect: {
    padding: "12px 16px",
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    background: "white",
    fontSize: 14,
    fontWeight: 500,
    color: "#334155",
    cursor: "pointer",
    outline: "none",
    minWidth: 160,
  },
  sortBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    padding: "12px 0",
    borderTop: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
  },
  sortButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: 13,
    fontWeight: 500,
    color: "#334155",
    cursor: "pointer",
    transition: "0.2s",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    maxHeight: "calc(100vh - 400px)",
    minHeight: 400,
    overflowY: "auto",
    paddingRight: 8,
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    padding: "20px 24px",
    borderRadius: 20,
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid rgba(255,255,255,0.5)",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  requestTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
  },
  requestCode: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    display: "block",
  },
  status: {
    padding: "6px 14px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 13,
  },
  cardDetails: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
  },
  detailItem: {
    fontSize: 13,
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingTop: 20,
    borderTop: "1px solid #e2e8f0",
  },
  pageButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    transition: "0.2s",
  },
  pageNumbers: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  pageNumber: {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    transition: "0.2s",
  },
  pageDots: {
    padding: "0 4px",
    color: "#64748b",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255,255,255,0.6)",
    borderRadius: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#64748b",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    minHeight: 400,
    gap: 16,
  },
  loadingSpinner: {
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
    height: "100%",
    minHeight: 400,
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
};