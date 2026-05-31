import React from "react";
import {
  Mail,
  Phone,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth(); 
  
  const displayUser = {
    name: user?.name || user?.username || "Chưa có tên",
    email: user?.email || "Chưa có email",
    phone: user?.number_phone || "Chưa có số điện thoại",
    company: user?.companyCode || "Chưa có mã công ty",
    role: user?.role || "Chưa có role",
  };


  return (
    <div style={styles.container}>
      {/* PROFILE */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          {displayUser.name.charAt(0)}
        </div>

        <div>
          <h1 style={styles.name}>
            {displayUser.name}
          </h1>

          <p style={styles.role}>
            {displayUser.role}
          </p>
        </div>
      </div>

      {/* INFO */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <Mail color="#0284c7" />

          <div>
            <p style={styles.label}>Email</p>

            <h3 style={styles.value}>
              {displayUser.email}
            </h3>
          </div>
        </div>

        <div style={styles.card}>
          <Phone color="#10b981" />

          <div>
            <p style={styles.label}>
              Số điện thoại
            </p>

            <h3 style={styles.value}>
              {displayUser.phone}
            </h3>
          </div>
        </div>

        <div style={styles.card}>
          <Building2 color="#6366f1" />

          <div>
            <p style={styles.label}>
              Công ty
            </p>

            <h3 style={styles.value}>
              {displayUser.company}
            </h3>
          </div>
        </div>

        <div style={styles.card}>
          <ShieldCheck color="#f59e0b" />

          <div>
            <p style={styles.label}>
              Quyền hạn
            </p>

            <h3 style={styles.value}>
              {displayUser.role}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: {
  [key: string]: React.CSSProperties;
} = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  profileCard: {
    background:
      "linear-gradient(135deg,#0ea5e9,#3b82f6)",

    borderRadius: 28,

    padding: 30,

    display: "flex",
    alignItems: "center",
    gap: 24,

    color: "white",

    boxShadow:
      "0 10px 30px rgba(14,165,233,0.25)",
  },

  avatar: {
    width: 100,
    height: 100,

    borderRadius: "50%",

    background: "rgba(255,255,255,0.2)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: 38,
    fontWeight: 800,
  },

  name: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
  },

  role: {
    marginTop: 8,
    fontSize: 16,
    color: "#dbeafe",
  },

  grid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",

    gap: 20,
  },

  card: {
    background: "rgba(255,255,255,0.8)",

    backdropFilter: "blur(10px)",

    borderRadius: 24,

    padding: 24,

    display: "flex",
    gap: 16,

    alignItems: "center",

    boxShadow:
      "0 6px 18px rgba(0,0,0,0.05)",
  },

  label: {
    margin: 0,
    color: "#64748b",
  },

  value: {
    marginTop: 8,
    color: "#0f172a",
  },
};