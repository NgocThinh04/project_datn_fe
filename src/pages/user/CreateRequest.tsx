import React, { useState } from "react";
import { Paperclip } from "lucide-react";
export default function CreateRequest() {
  // 
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });
const [selectedFile, setSelectedFile] = useState<File | null>(null);
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Tạo yêu cầu mới
        </h1>

        <input
          placeholder="Tiêu đề yêu cầu"
          style={styles.input}
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Mô tả yêu cầu"
          style={styles.textarea}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <select
          style={styles.select}
          value={form.priority}
          onChange={(e) =>
            setForm({
              ...form,
              priority: e.target.value,
            })
          }
        >
          <option>Loại yêu cầu 1</option>
          <option>Loại yêu cầu 2</option>
          <option>Loại yêu cầu 3</option>
        </select>
{/* FILE ATTACHMENT */}
<div style={styles.formGroup}>
  <label style={styles.label}>
    Tệp đính kèm
  </label>

  <label style={styles.fileUpload}>
    <Paperclip size={18} />

    <span>
      {selectedFile
        ? selectedFile.name
        : "Chọn tệp đính kèm"}
    </span>

    <input
      type="file"
      style={{ display: "none" }}
      onChange={(e) => {
        if (
          e.target.files &&
          e.target.files[0]
        ) {
          setSelectedFile(
            e.target.files[0]
          );
        }
      }}
    />
  </label>
</div>
        <button style={styles.button}>
          Gửi yêu cầu
        </button>
      </div>
    </div>
  );
}

const styles: {
  [key: string]: React.CSSProperties;
} = {
  container: {
    display: "flex",
    justifyContent: "center",
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

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  },

  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
    color: "#0f172a",
  },

  input: {
    padding: 16,

    borderRadius: 16,

    border: "1px solid #cbd5e1",

    fontSize: 15,
  },

  textarea: {
    minHeight: 180,

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
  },

  button: {
    padding: 16,

    borderRadius: 18,

    border: "none",

    background:
      "linear-gradient(135deg,#0ea5e9,#6366f1)",

    color: "white",

    fontWeight: 700,

    cursor: "pointer",
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
};