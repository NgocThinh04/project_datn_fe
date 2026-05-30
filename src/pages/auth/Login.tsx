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
    const { login, loading } = useAuth();
    
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
    companyCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", form);

    // TODO: call API Spring Boot
  };
const [showPassword, setShowPassword] = useState(false);
  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Chào mừng trở lại</h2>

<div style={styles.inputWrapper}>
  <FaUser style={styles.icon} />

  <input
    name="username"
    placeholder="Email"
    value={form.username}
    onChange={handleChange}
    style={styles.inputWithIcon}
  />
</div>
<div style={styles.inputWrapper}>
  <FaLock style={styles.icon} />

  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    style={styles.inputWithIcon}
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
    name="company"
    placeholder="Mã công ty"
    value={form.companyCode}
    onChange={handleChange}
    style={styles.inputWithIcon}
  />
</div>
<button
  style={styles.button}
  onMouseOver={(e) =>
    (e.currentTarget.style.transform = "scale(1.05)")
  }
  onMouseOut={(e) =>
    (e.currentTarget.style.transform = "scale(1)")
  }
>
  Đăng nhập
</button>

<button
  type="button"
  style={styles.registerButton}
  onClick={() => {
    window.location.href = "/register-company";
  }}
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

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
    transition: "0.2s",
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
  },

  link: {
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
  },
  //input
  inputWrapper: {
  position: "relative",
  display: "flex",
  alignItems: "center",
},

icon: {
  position: "absolute",
  left: "12px",
  color: "#888",
},

inputWithIcon: {
  width: "100%",
  padding: "14px 14px 14px 40px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
},

toggleIcon: {
  position: "absolute",
  right: "12px",
  cursor: "pointer",
  color: "#888",
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
};
