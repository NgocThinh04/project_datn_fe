import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaBuilding,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  address: string;
  numberPhone: string;
}

export default function RegisterCompany() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    address: "",
    numberPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    
    // Validate password length
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    
    // Validate email
    if (!form.email.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }
    
    // Validate phone number (optional but basic check)
    if (form.numberPhone && form.numberPhone.length < 10) {
      setError("Số điện thoại phải có ít nhất 10 số");
      return;
    }
    
    setLoading(true);
    
    try {
      const registerData = {
        username: form.username,
        email: form.email,
        password: form.password,
        nameCompany: form.companyName,
        address: form.address,
        numberPhone: form.numberPhone,
      };
      
      const response = await authApi.registerCompany(registerData);
      
      setSuccess(response.message || "Đăng ký thành công! Vui lòng đăng nhập.");
      
      // Reset form
      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        address: "",
        numberPhone: "",
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (err: any) {
      setError(err.error || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Đăng ký công ty</h2>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={styles.successMessage}>
            {success}
          </div>
        )}

        {/* USERNAME */}
        <div style={styles.inputWrapper}>
          <FaUser style={styles.icon} />
          <input
            name="username"
            placeholder="Tên tài khoản"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />
        </div>

        {/* EMAIL */}
        <div style={styles.inputWrapper}>
          <FaEnvelope style={styles.icon} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />
        </div>

        {/* PASSWORD with show/hide */}
        <div style={styles.inputWrapper}>
          <FaLock style={styles.icon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu (ít nhất 6 ký tự)"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />
          <span
            style={styles.toggleIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* CONFIRM PASSWORD with show/hide */}
        <div style={styles.inputWrapper}>
          <FaLock style={styles.icon} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />
          <span
            style={styles.toggleIcon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* COMPANY NAME */}
        <div style={styles.inputWrapper}>
          <FaBuilding style={styles.icon} />
          <input
            name="companyName"
            placeholder="Tên công ty"
            value={form.companyName}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />
        </div>

        {/* ADDRESS */}
        <div style={styles.inputWrapper}>
          <FaMapMarkerAlt style={styles.icon} />
          <input
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />
        </div>

        {/* PHONE - fixed input */}
        <div style={styles.inputWrapper}>
          <FaPhone style={styles.icon} />
          <input
            type="tel"
            name="numberPhone"
            placeholder="Số điện thoại"
            value={form.numberPhone}
            onChange={handleChange}
            style={styles.input}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng ký công ty"}
        </button>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => {
            navigate("/login");
          }}
          disabled={loading}
        >
          Quay lại đăng nhập
        </button>
      </form>
    </div>
  );
}

const styles: {
  [key: string]: React.CSSProperties;
} = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#38bdf8,#6366f1)",
    overflowY: "auto",
    padding: "20px",
    boxSizing: "border-box",
  },
  form: {
    width: 450,
    maxWidth: "90%",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    padding: 35,
    borderRadius: 24,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 10,
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: 14,
    color: "#64748b",
    zIndex: 1,
  },
  toggleIcon: {
    position: "absolute",
    right: 14,
    cursor: "pointer",
    color: "#64748b",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "14px 40px 14px 42px",
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: 14,
    background: "#f8fafc",
    boxSizing: "border-box",
  },
  button: {
    padding: 15,
    border: "none",
    borderRadius: 14,
    background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 10,
    transition: "transform 0.2s, opacity 0.2s",
  },
  backButton: {
    padding: 14,
    borderRadius: 14,
    border: "2px solid #6366f1",
    background: "white",
    color: "#6366f1",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  errorMessage: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: 500,
  },
  successMessage: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: 500,
  },
};

