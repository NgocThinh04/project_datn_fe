import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaBuilding,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  companyName: string;
  address: string;
  phone: string;
}

export default function RegisterCompany() {
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    password: "",
    email: "",
    companyName: "",
    address: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log("Register Company:", form);

    // TODO CALL API
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Đăng ký công ty</h2>

        {/* USERNAME */}
        <div style={styles.inputWrapper}>
          <FaUser style={styles.icon} />

          <input
            name="username"
            placeholder="Tên tài khoản"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* PASSWORD */}
        <div style={styles.inputWrapper}>
          <FaLock style={styles.icon} />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        {/* EMAIl */}
        <div style={styles.inputWrapper}>
          <FaUser style={styles.icon} />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        {/* COMPANY */}
        <div style={styles.inputWrapper}>
          <FaBuilding style={styles.icon} />

          <input
            name="companyName"
            placeholder="Tên công ty"
            value={form.companyName}
            onChange={handleChange}
            style={styles.input}
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
          />
        </div>

        {/* PHONE */}
        <div style={styles.inputWrapper}>
          <FaPhone style={styles.icon} />

          <input
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button style={styles.button}>
          Đăng ký công ty
        </button>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => {
            window.location.href = "/";
          }}
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

    background:
      "linear-gradient(135deg,#38bdf8,#6366f1)",
  },

  form: {
    width: 400,

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
  },

  input: {
    width: "100%",

    padding: "14px 14px 14px 42px",

    borderRadius: 14,

    border: "1px solid #cbd5e1",

    outline: "none",

    fontSize: 14,

    background: "#f8fafc",
  },

  button: {
    padding: 15,

    border: "none",

    borderRadius: 14,

    background:
      "linear-gradient(135deg,#0ea5e9,#6366f1)",

    color: "white",

    fontWeight: 700,

    fontSize: 15,

    cursor: "pointer",

    marginTop: 10,
  },

  backButton: {
    padding: 14,

    borderRadius: 14,

    border: "2px solid #6366f1",

    background: "white",

    color: "#6366f1",

    fontWeight: 700,

    cursor: "pointer",
  },
};
