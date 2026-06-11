// src/pages/user/RequestDetail.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CircleCheck,
  FileText,
  User,
  Pencil,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  SendHorizontal,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import requestService, { type ApprovalRequest, type ApprovalAction } from "../../services/user/requestService";

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  
  // State cho modal yêu cầu chỉnh sửa
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [changeRequestNote, setChangeRequestNote] = useState("");

  // ==================== LOAD REQUEST DETAIL ====================
  const loadRequestDetail = async () => {
    if (!id) {
      setError("Không tìm thấy mã yêu cầu");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await requestService.getRequestDetail(id);
      setRequest(data);
      console.log("✅ Request detail loaded:", data);
    } catch (err: any) {
      console.error("Load request detail error:", err);
      setError(err.message || "Không thể tải chi tiết yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequestDetail();
  }, [id]);

  // ==================== HELPER FUNCTIONS ====================
  
  // Chuyển đổi status
  const getStatusText = (status: string): string => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt";
      case "PENDING":
        return "Đang xử lý";
      case "REJECTED":
        return "Từ chối";
      case "REQUEST_CHANGES":
        return "Yêu cầu chỉnh sửa";
      case "CANCELLED":
        return "Đã hủy";
      case "IN_PROGRESS":
        return "Đang xử lý";
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
      case "REQUEST_CHANGES":
        return { background: "#fef3c7", color: "#d97706" };
      case "CANCELLED":
        return { background: "#f1f5f9", color: "#475569" };
      default:
        return { background: "#fef3c7", color: "#92400e" };
    }
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Lấy nội dung yêu cầu chỉnh sửa từ action
  const getChangeRequestNote = (): string => {
    if (!request?.actions) return "";
    const changeRequestAction = request.actions.find(a => a.action === "REQUEST_CHANGES");
    if (changeRequestAction?.rejectionReason) {
      return changeRequestAction.rejectionReason;
    }
    return request.note || "";
  };

  // Lấy action hiện tại (bước đang xử lý)
  const getCurrentAction = (): ApprovalAction | null => {
    if (!request?.actions) return null;
    return request.actions.find(a => a.action === "PENDING") || null;
  };

  // Kiểm tra user có quyền duyệt không
  const canApprove = (): boolean => {
    const currentAction = getCurrentAction();
    return currentAction?.canApprove || false;
  };

  // Kiểm tra xem request đã được xử lý chưa
  const isAlreadyProcessed = (): boolean => {
    if (!request) return true;
    return request.status === "APPROVED" || 
           request.status === "REJECTED" || 
           request.status === "CANCELLED";
  };

  // Kiểm tra user có phải người gửi không
  const isRequester = (): boolean => {
    const userId = localStorage.getItem('userId');
    return request?.requesterId === userId;
  };

  // Xử lý duyệt yêu cầu
  const handleApprove = async () => {
    const currentAction = getCurrentAction();
    if (!currentAction) return;

    if (!window.confirm("Bạn có chắc muốn DUYỆT yêu cầu này?")) return;

    setProcessing(true);
    try {
      const result = await requestService.processApproval({
        actionId: currentAction.id,
        action: "APPROVED",
      });
      alert(`✅ ${result.message || "Duyệt yêu cầu thành công!"}`);
      await loadRequestDetail();
    } catch (err: any) {
      console.error("Approve error:", err);
      alert(err.message || "Duyệt yêu cầu thất bại");
    } finally {
      setProcessing(false);
    }
  };

  // Xử lý từ chối yêu cầu
  const handleReject = async () => {
    const currentAction = getCurrentAction();
    if (!currentAction) return;

    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    if (!window.confirm("Bạn có chắc muốn TỪ CHỐI yêu cầu này?")) return;

    setProcessing(true);
    try {
      const result = await requestService.processApproval({
        actionId: currentAction.id,
        action: "REJECTED",
        rejectionReason: reason,
      });
      alert(`❌ ${result.message || "Đã từ chối yêu cầu!"}`);
      await loadRequestDetail();
    } catch (err: any) {
      console.error("Reject error:", err);
      alert(err.message || "Từ chối yêu cầu thất bại");
    } finally {
      setProcessing(false);
    }
  };

  // Xử lý yêu cầu chỉnh sửa
  const handleRequestChanges = async () => {
    const currentAction = getCurrentAction();
    if (!currentAction) return;

    if (!changeRequestNote.trim()) {
      alert("Vui lòng nhập nội dung yêu cầu chỉnh sửa");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn YÊU CẦU CHỈNH SỬA yêu cầu này?")) return;

    setProcessing(true);
    try {
      const result = await requestService.processApproval({
        actionId: currentAction.id,
        action: "REQUEST_CHANGES",
        changeRequestNote: changeRequestNote,
      });
      alert(`✏️ ${result.message || "Đã yêu cầu chỉnh sửa!"}`);
      setShowRequestChangesModal(false);
      setChangeRequestNote("");
      await loadRequestDetail();
    } catch (err: any) {
      console.error("Request changes error:", err);
      alert(err.message || "Yêu cầu chỉnh sửa thất bại");
    } finally {
      setProcessing(false);
    }
  };

  // Xử lý chỉnh sửa - chuyển đến trang tạo với dữ liệu cũ
const handleEdit = () => {
  // Lấy đầy đủ dữ liệu từ request
  const editData = {
    id: request?.id,
    title: request?.title || "",
    description: request?.description || "",
    requestType: request?.requestType || "",
    changeRequestNote: getChangeRequestNote(), // Ghi chú chỉnh sửa từ người duyệt
  };
  
  // Lưu vào sessionStorage
  sessionStorage.setItem("editRequestData", JSON.stringify(editData));
  console.log("📝 Saved edit data:", editData);
  
  // Chuyển sang trang tạo yêu cầu với query param edit
  navigate(`/user/create-request?edit=${id}`);
};

  // ==================== RENDER ====================
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 size={40} style={styles.spinner} />
        <p>Đang tải thông tin yêu cầu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>❌</div>
        <p style={styles.errorText}>{error}</p>
        <button onClick={loadRequestDetail} style={styles.retryButton}>Thử lại</button>
        <button onClick={() => navigate("/user/requests")} style={styles.backButton}>Quay lại danh sách</button>
      </div>
    );
  }

  if (!request) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>📭</div>
        <p style={styles.errorText}>Không tìm thấy yêu cầu</p>
        <button onClick={() => navigate("/user/requests")} style={styles.backButton}>Quay lại danh sách</button>
      </div>
    );
  }

  const currentAction = getCurrentAction();
  const isPending = request.status === "PENDING" || request.status === "IN_PROGRESS";
  const showApproveButtons = isPending && canApprove();
  const isRequestChanges = request.status === "REQUEST_CHANGES";
  const changeRequestNoteContent = getChangeRequestNote();

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.headerCard}>
        <div>
          <h1 style={styles.title}>{request.title}</h1>
          <p style={styles.requestId}>Mã yêu cầu: {request.requestCode}</p>
        </div>
        <div style={{ ...styles.status, ...getStatusStyle(request.status) }}>
          {getStatusText(request.status)}
        </div>
      </div>

      {/* INFO GRID */}
      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <User size={22} color="#0284c7" />
          <div>
            <p style={styles.label}>Người gửi</p>
            <h3 style={styles.value}>{request.requesterName || "Không rõ"}</h3>
          </div>
        </div>
        <div style={styles.infoCard}>
          <CalendarDays size={22} color="#6366f1" />
          <div>
            <p style={styles.label}>Ngày tạo</p>
            <h3 style={styles.value}>{formatDate(request.createdAt)}</h3>
          </div>
        </div>
        <div style={styles.infoCard}>
          <CircleCheck size={22} color="#10b981" />
          <div>
            <p style={styles.label}>Loại yêu cầu</p>
            <h3 style={styles.value}>{request.requestType || "Không xác định"}</h3>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS - Cho người duyệt */}
      {showApproveButtons && (
        <div style={styles.actionContainer}>
          <button
            onClick={handleApprove}
            style={{ ...styles.actionButton, background: "linear-gradient(135deg,#10b981,#059669)" }}
            disabled={processing}
          >
            <CheckCircle size={18} />
            {processing ? "Đang xử lý..." : "✅ Duyệt"}
          </button>
          <button
            onClick={() => setShowRequestChangesModal(true)}
            style={{ ...styles.actionButton, background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
            disabled={processing}
          >
            <SendHorizontal size={18} />
            {processing ? "Đang xử lý..." : "✏️ Yêu cầu chỉnh sửa"}
          </button>
          <button
            onClick={handleReject}
            style={{ ...styles.actionButton, background: "linear-gradient(135deg,#ef4444,#dc2626)" }}
            disabled={processing}
          >
            <XCircle size={18} />
            {processing ? "Đang xử lý..." : "❌ Từ chối"}
          </button>
        </div>
      )}

      {/* NỘI DUNG YÊU CẦU CHỈNH SỬA - Hiển thị khi status = REQUEST_CHANGES */}
      {isRequestChanges && (
        <div style={styles.changeRequestCard}>
          <div style={styles.changeRequestHeader}>
            <AlertCircle size={20} color="#d97706" />
            <span style={styles.changeRequestTitle}>
              Yêu cầu chỉnh sửa từ người duyệt
            </span>
          </div>
          
          {/* Hiển thị nội dung cần chỉnh sửa nếu có */}
          {changeRequestNoteContent && (
            <div style={styles.changeRequestContent}>
              <strong>Nội dung cần chỉnh sửa:</strong>
              <p style={{ marginTop: 8, marginBottom: 0 }}>{changeRequestNoteContent}</p>
            </div>
          )}
          
          {/* Nút chỉnh sửa - hiển thị cho người gửi */}
          <div style={styles.changeRequestActions}>
            <button
              onClick={handleEdit}
              style={styles.editRequestButton}
            >
              <Pencil size={16} />
              Chỉnh sửa yêu cầu ngay
            </button>
            <button
              onClick={() => navigate("/user/sent-requests")}
              style={styles.backToListButton}
            >
              <ArrowLeft size={16} />
              Quay lại danh sách
            </button>
          </div>
        </div>
      )}

      {/* WORKFLOW STEPS */}
      {request.actions && request.actions.length > 0 && (
        <div style={styles.contentCard}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <Clock size={20} color="#0284c7" />
              <h2 style={styles.sectionTitle}>Quy trình duyệt</h2>
            </div>
            <div style={styles.stepsContainer}>
              {request.actions.map((action, index) => (
                <div key={action.id} style={styles.stepItem}>
                  <div style={styles.stepNumber}>{action.stepOrder}</div>
                  <div style={styles.stepContent}>
                    <div style={styles.stepHeader}>
                      <span style={styles.stepName}>{action.stepName}</span>
                      <span style={{
                        ...styles.stepStatus,
                        ...(action.action === "APPROVED" ? { background: "#dcfce7", color: "#166534" }
                          : action.action === "REJECTED" ? { background: "#fee2e2", color: "#991b1b" }
                          : action.action === "REQUEST_CHANGES" ? { background: "#fef3c7", color: "#d97706" }
                          : { background: "#fef3c7", color: "#92400e" }),
                      }}>
                        {action.action === "APPROVED" ? "Đã duyệt"
                          : action.action === "REJECTED" ? "Từ chối"
                          : action.action === "REQUEST_CHANGES" ? "Yêu cầu chỉnh sửa"
                          : action.action === "PENDING" ? "Chờ duyệt"
                          : action.action}
                      </span>
                    </div>
                    {action.approverName && <div style={styles.stepApprover}>Người duyệt: {action.approverName}</div>}
                    {action.rejectionReason && action.action === "REQUEST_CHANGES" && (
                      <div style={styles.stepChangeRequestNote}>
                        <strong>Nội dung cần chỉnh sửa:</strong> {action.rejectionReason}
                      </div>
                    )}
                    {action.rejectionReason && action.action === "REJECTED" && (
                      <div style={styles.stepReason}>Lý do từ chối: {action.rejectionReason}</div>
                    )}
                    {action.approvedAt && <div style={styles.stepTime}>{formatDate(action.approvedAt)}</div>}
                  </div>
                  {index < request.actions.length - 1 && <div style={styles.stepLine} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div style={styles.contentCard}>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <FileText size={20} color="#0284c7" />
            <h2 style={styles.sectionTitle}>Nội dung yêu cầu</h2>
          </div>
          <p style={styles.description}>{request.description || "Không có mô tả"}</p>
        </div>

        {request.note && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <FileText size={20} color="#6366f1" />
              <h2 style={styles.sectionTitle}>Ghi chú</h2>
            </div>
            <div style={styles.responseBox}>{request.note}</div>
          </div>
        )}
      </div>

      {/* MODAL YÊU CẦU CHỈNH SỬA */}
      {showRequestChangesModal && (
        <div style={styles.modalOverlay} onClick={() => setShowRequestChangesModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>✏️ Yêu cầu chỉnh sửa</h2>
            <p style={styles.modalSubText}>Vui lòng nhập nội dung cần chỉnh sửa:</p>
            <textarea
              style={styles.modalTextarea}
              rows={5}
              placeholder="Nhập nội dung cần chỉnh sửa..."
              value={changeRequestNote}
              onChange={(e) => setChangeRequestNote(e.target.value)}
            />
            <div style={styles.modalButtons}>
              <button onClick={() => setShowRequestChangesModal(false)} style={styles.modalCancelBtn}>
                Hủy
              </button>
              <button onClick={handleRequestChanges} style={styles.modalConfirmBtn} disabled={processing}>
                {processing ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
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
  },
  headerCard: {
    background: "linear-gradient(135deg,#0ea5e9,#3b82f6)",
    padding: 30,
    borderRadius: 28,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    boxShadow: "0 15px 35px rgba(14,165,233,0.25)",
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    margin: 0,
    fontSize: 28,
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
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: 20,
  },
  infoCard: {
    background: "rgba(255,255,255,0.8)",
    padding: 24,
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },
  label: {
    margin: 0,
    color: "#64748b",
    fontSize: 13,
  },
  value: {
    marginTop: 8,
    marginBottom: 0,
    color: "#0f172a",
    fontSize: 18,
  },
  contentCard: {
    background: "rgba(255,255,255,0.85)",
    borderRadius: 28,
    padding: 30,
    display: "flex",
    flexDirection: "column",
    gap: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
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
    flexWrap: "wrap",
  },
  actionButton: {
    border: "none",
    padding: "14px 24px",
    borderRadius: 18,
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    transition: "0.2s",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  changeRequestCard: {
    background: "#fffbeb",
    borderRadius: 20,
    padding: 24,
    border: "1px solid #fde68a",
    boxShadow: "0 4px 12px rgba(251,191,36,0.1)",
  },
  changeRequestHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  changeRequestTitle: {
    fontWeight: 700,
    fontSize: 18,
    color: "#d97706",
  },
  changeRequestContent: {
    background: "#fef3c7",
    padding: 16,
    borderRadius: 16,
    fontSize: 15,
    color: "#92400e",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    marginBottom: 20,
  },
  changeRequestActions: {
    display: "flex",
    gap: 16,
    justifyContent: "flex-end",
  },
  editRequestButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    color: "white",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  backToListButton: {
    padding: "12px 24px",
    background: "white",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  stepsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  stepItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 16,
    position: "relative",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#475569",
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
    background: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    border: "1px solid #e2e8f0",
  },
  stepHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  stepName: {
    fontWeight: 700,
    color: "#0f172a",
  },
  stepStatus: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  stepApprover: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 8,
  },
  stepReason: {
    fontSize: 13,
    color: "#dc2626",
    marginTop: 8,
  },
  stepChangeRequestNote: {
    fontSize: 13,
    color: "#d97706",
    marginTop: 8,
    padding: 8,
    background: "#fffbeb",
    borderRadius: 8,
  },
  stepTime: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 8,
  },
  stepLine: {
    position: "absolute",
    left: 15,
    top: 40,
    width: 2,
    height: 30,
    background: "#e2e8f0",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
    gap: 16,
  },
  spinner: {
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
  backButton: {
    padding: "10px 20px",
    background: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    borderRadius: 24,
    padding: 28,
    width: 450,
    maxWidth: "90%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a",
  },
  modalSubText: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 14,
  },
  modalTextarea: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    resize: "vertical",
    marginTop: 16,
    fontFamily: "inherit",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  modalCancelBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "white",
    cursor: "pointer",
    fontSize: 14,
  },
  modalConfirmBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#f59e0b,#d97706)",
    color: "white",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
};