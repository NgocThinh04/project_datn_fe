import React, { useState, useEffect } from "react";
import { Paperclip, Loader2 } from "lucide-react";
import approvalService, { type WorkflowDTO } from "../../services/user/approvalService"

export default function CreateRequest() {
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

  // Load workflows khi component mount
  useEffect(() => {
    loadWorkflows();
  }, []);

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
      
    } catch (error: any) {
      showToast(error.error || "Gửi yêu cầu thất bại", "error");
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
        <h1 style={styles.title}>Tạo yêu cầu mới</h1>

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
          {loading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Gửi yêu cầu"}
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
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
    color: "#0f172a",
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