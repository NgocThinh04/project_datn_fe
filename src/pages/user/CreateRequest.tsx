import React, { useState, useEffect } from "react";
import { Paperclip, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import approvalService, { type WorkflowDTO } from "../../services/user/approvalService"
import requestService from "../../services/user/requestService";

export default function CreateRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowDTO[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(true);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    requestType: "",
    note: "",
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // State cho edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [changeRequestNote, setChangeRequestNote] = useState("");

  // Load workflows khi component mount
  useEffect(() => {
    loadWorkflows();
    checkEditMode();
  }, []);

  // Kiểm tra edit mode và load dữ liệu
  const checkEditMode = async () => {
    const params = new URLSearchParams(location.search);
    const editIdParam = params.get('edit');
    
    if (editIdParam) {
      setIsEditMode(true);
      setEditId(editIdParam);
      
      // Đọc dữ liệu từ sessionStorage
      const savedData = sessionStorage.getItem("editRequestData");
      console.log("📖 Loaded edit data from sessionStorage:", savedData);
      
      if (savedData) {
        try {
          const editData = JSON.parse(savedData);
          setForm({
            title: editData.title || "",
            description: editData.description || "",
            requestType: editData.requestType || "",
            note: "",
          });
          
          if (editData.changeRequestNote) {
            setChangeRequestNote(editData.changeRequestNote);
            // Hiển thị thông báo cho người dùng
            setTimeout(() => {
              showToast(`📝 Yêu cầu chỉnh sửa: ${editData.changeRequestNote}`, "error");
            }, 500);
          }
          
          // Xóa dữ liệu sau khi đọc
          sessionStorage.removeItem("editRequestData");
        } catch (error) {
          console.error("Error parsing edit data:", error);
        }
      } else {
        // Nếu không có trong sessionStorage, thử load từ API
        await loadRequestData(editIdParam);
      }
    }
  };

  // Load dữ liệu request từ API
  const loadRequestData = async (requestId: string) => {
    try {
      const data = await requestService.getRequestDetail(requestId);
      setForm({
        title: data.title || "",
        description: data.description || "",
        requestType: data.requestType || "",
        note: "",
      });
      
      // Tìm nội dung chỉnh sửa từ actions
      const changeAction = data.actions?.find(a => a.action === "REQUEST_CHANGES");
      if (changeAction?.rejectionReason) {
        setChangeRequestNote(changeAction.rejectionReason);
        setTimeout(() => {
          showToast(`📝 Yêu cầu chỉnh sửa: ${changeAction.rejectionReason}`, "error");
        }, 500);
      }
    } catch (error) {
      console.error("Error loading request data:", error);
    }
  };

  const loadWorkflows = async () => {
    setLoadingWorkflows(true);
    try {
      const data = await approvalService.getWorkflowsByCompany();
      // Chỉ lấy workflow có status = ACTIVE
      const activeWorkflows = data.filter(w => w.status === "active");
      setWorkflows(activeWorkflows);
      
      // Nếu có workflow và chưa chọn, chọn mặc định cái đầu tiên
      if (activeWorkflows.length > 0 && !form.requestType) {
        setForm(prev => ({ ...prev, requestType: activeWorkflows[0].name }));
      }
    } catch (error: any) {
      showToast(error.error || "Không thể tải danh sách quy trình", "error");
    } finally {
      setLoadingWorkflows(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async () => {
    // Validate
    if (!form.title.trim()) {
      showToast("Vui lòng nhập tiêu đề", "error");
      return;
    }
    if (!form.description.trim()) {
      showToast("Vui lòng nhập mô tả", "error");
      return;
    }
    if (!form.requestType) {
      showToast("Vui lòng chọn loại yêu cầu", "error");
      return;
    }

    setLoading(true);
    try {
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        throw new Error("Không tìm thấy thông tin công ty");
      }

      if (isEditMode && editId) {
        // Cập nhật yêu cầu đã chỉnh sửa
        await requestService.updateRequest(editId, {
          title: form.title,
          description: form.description,
          requestType: form.requestType,
          note: form.note,
        });
        showToast("Cập nhật yêu cầu thành công!", "success");
        navigate("/user/sent-requests");
      } else {
        // Tạo yêu cầu mới
        const result = await approvalService.submitRequest({
          companyId,
          title: form.title,
          description: form.description,
          requestType: form.requestType,
          note: form.note,
        });
        showToast(result.message || "Gửi yêu cầu thành công!", "success");
        
        // Reset form
        setForm({
          title: "",
          description: "",
          requestType: workflows.length > 0 ? workflows[0].name : "",
          note: "",
        });
        setSelectedFile(null);
      }
      
    } catch (error: any) {
      showToast(error.error || (isEditMode ? "Cập nhật thất bại" : "Gửi yêu cầu thất bại"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
        }}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} style={styles.toastClose}>✕</button>
        </div>
      )}

      <div style={styles.card}>
        {/* Header với nút back */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 style={styles.title}>
            {isEditMode ? "✏️ Chỉnh sửa yêu cầu" : "📝 Tạo yêu cầu mới"}
          </h1>
          <div style={{ width: 40 }} />
        </div>

        {/* Thông báo yêu cầu chỉnh sửa */}
        {changeRequestNote && (
          <div style={styles.changeRequestAlert}>
            <AlertCircle size={18} color="#d97706" />
            <div style={styles.changeRequestAlertContent}>
              <strong>Yêu cầu chỉnh sửa từ người duyệt:</strong>
              <p style={styles.changeRequestAlertText}>{changeRequestNote}</p>
            </div>
          </div>
        )}

        <input
          placeholder="Tiêu đề yêu cầu *"
          style={styles.input}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Mô tả yêu cầu *"
          style={styles.textarea}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Loại quy trình - dynamic từ API */}
        <div>
          <label style={styles.label}>Loại yêu cầu *</label>
          <select
            style={styles.select}
            value={form.requestType}
            onChange={(e) => setForm({ ...form, requestType: e.target.value })}
            disabled={loadingWorkflows}
          >
            {loadingWorkflows ? (
              <option>Đang tải quy trình...</option>
            ) : workflows.length === 0 ? (
              <option>Không có quy trình nào</option>
            ) : (
              workflows.map((workflow) => (
                <option key={workflow.workflowId} value={workflow.name}>
                  {workflow.name} {workflow.description ? `- ${workflow.description}` : ""}
                </option>
              ))
            )}
          </select>
        </div>

        <textarea
          placeholder="Ghi chú (không bắt buộc)"
          style={{ ...styles.textarea, minHeight: 80 }}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />

        {/* FILE ATTACHMENT */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Tệp đính kèm</label>
          <label style={styles.fileUpload}>
            <Paperclip size={18} />
            <span>{selectedFile ? selectedFile.name : "Chọn tệp đính kèm"}</span>
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : (isEditMode ? "Cập nhật yêu cầu" : "Gửi yêu cầu")}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    padding: "12px 20px",
    borderRadius: 12,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 10000,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  toastClose: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
  },
  card: {
    width: "100%",
    maxWidth: 700,
    background: "rgba(255,255,255,0.8)",
    padding: 30,
    borderRadius: 28,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    background: "#f1f5f9",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    color: "#475569",
    fontWeight: 500,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
    textAlign: "center",
  },
  changeRequestAlert: {
    display: "flex",
    gap: 12,
    padding: 16,
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 16,
  },
  changeRequestAlertContent: {
    flex: 1,
  },
  changeRequestAlertText: {
    margin: "8px 0 0 0",
    fontSize: 14,
    color: "#92400e",
    lineHeight: 1.5,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 8,
    display: "block",
  },
  input: {
    padding: 16,
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    fontSize: 15,
  },
  textarea: {
    minHeight: 120,
    padding: 16,
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    resize: "none",
    fontSize: 15,
  },
  select: {
    padding: 16,
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    fontSize: 15,
    width: "100%",
  },
  button: {
    padding: 16,
    borderRadius: 18,
    border: "none",
    background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  fileUpload: {
    border: "2px dashed #bae6fd",
    background: "#f0f9ff",
    padding: "18px 20px",
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    color: "#0284c7",
    fontWeight: 600,
    transition: "0.2s",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
};