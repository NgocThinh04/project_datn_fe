// src/pages/Login.tsx
import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface LoginForm {
  username: string;
  password: string;
  companyCode: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, user } = useAuth();
  
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
    companyCode: "",
  });
  
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate
    if (!form.username || !form.password || !form.companyCode) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await login(form);
      
      // Kiểm tra role từ response hoặc từ user context
      const userRole = response?.role || user?.role;
      
      // Chuyển hướng dựa trên role
      if (userRole === 'Admin' || userRole === 'ADMIN' || userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'User' || userRole === 'USER' || userRole === 'user') {
        navigate('/user');
      } else {
        // Mặc định chuyển về trang chủ
        navigate('/');
      }
    } catch (err: any) {
      setError(err.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Chào mừng trở lại</h2>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <div style={styles.inputWrapper}>
          <FaUser style={styles.icon} />
          <input
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            style={styles.inputWithIcon}
            disabled={loading}
          />
        </div>

        <div style={styles.inputWrapper}>
          <FaLock style={styles.icon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            style={styles.inputWithIcon}
            disabled={loading}
          />
          <span
            style={styles.toggleIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div style={styles.inputWrapper}>
          <FaUser style={styles.icon} />
          <input
            name="companyCode"
            placeholder="Mã công ty"
            value={form.companyCode}
            onChange={handleChange}
            style={styles.inputWithIcon}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        <button
          type="button"
          style={styles.registerButton}
          onClick={() => {
            navigate("/register-company");
          }}
          disabled={loading}
        >
          Đăng ký công ty
        </button>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  form: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "40px 30px",
    borderRadius: "20px",
    width: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    position: "absolute",
    left: "12px",
    color: "#888",
    zIndex: 1,
  },
  inputWithIcon: {
    width: "100%",
    padding: "14px 14px 14px 40px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  toggleIcon: {
    position: "absolute",
    right: "12px",
    cursor: "pointer",
    color: "#888",
    zIndex: 1,
  },
  button: {
    padding: "14px",
    background: "linear-gradient(135deg, #667eea, #5a67d8)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "0.3s",
    marginTop: "10px",
  },
  registerButton: {
    padding: "14px",
    background: "white",
    color: "#667eea",
    border: "2px solid #667eea",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "0.3s",
  },
  errorMessage: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "14px",
  },
};