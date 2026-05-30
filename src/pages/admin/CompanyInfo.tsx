import React from "react";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Users,
} from "lucide-react";

export default function CompanyInfo() {
  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.headerCard}>
        <div style={styles.logoBox}>
          <Building2 size={42} color="white" />
        </div>

        <div>
          <h1 style={styles.companyName}>
            Công ty A
          </h1>

          <p style={styles.companyType}>
            Hệ thống quản lý doanh nghiệp
          </p>
        </div>
      </div>

      {/* INFO GRID */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>
            <Mail size={24} color="#0284c7" />
          </div>

          <div>
            <p style={styles.label}>Email</p>

            <h3 style={styles.value}>
              contact@abctech.vn
            </h3>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>
            <Phone size={24} color="#10b981" />
          </div>

          <div>
            <p style={styles.label}>Số điện thoại</p>

            <h3 style={styles.value}>
              0123 456 789
            </h3>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>
            <MapPin size={24} color="#f59e0b" />
          </div>

          <div>
            <p style={styles.label}>Địa chỉ</p>

            <h3 style={styles.value}>
              Hà Nội, Việt Nam
            </h3>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>
            <Users size={24} color="#8b5cf6" />
          </div>

          <div>
            <p style={styles.label}>Nhân viên</p>

            <h3 style={styles.value}>
              125 người
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

  headerCard: {
    background:
      "linear-gradient(135deg,#0ea5e9,#3b82f6)",

    borderRadius: 28,

    padding: 30,

    display: "flex",
    alignItems: "center",
    gap: 24,

    color: "white",

    boxShadow: "0 12px 30px rgba(14,165,233,0.25)",
  },

  logoBox: {
    width: 90,
    height: 90,

    borderRadius: 24,

    background: "rgba(255,255,255,0.2)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    backdropFilter: "blur(12px)",
  },

  companyName: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
  },

  companyType: {
    marginTop: 10,
    color: "#dbeafe",
    fontSize: 16,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",

    gap: 20,
  },

  card: {
    background: "rgba(255,255,255,0.75)",

    backdropFilter: "blur(12px)",

    borderRadius: 24,

    padding: 24,

    display: "flex",
    alignItems: "center",
    gap: 18,

    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  },

  cardIcon: {
    width: 58,
    height: 58,

    borderRadius: 18,

    background: "#eff6ff",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    margin: 0,
    color: "#64748b",
    fontSize: 14,
  },

  value: {
    marginTop: 8,
    color: "#0f172a",
    fontSize: 18,
    fontWeight: 700,
  },

  aboutCard: {
    background: "rgba(255,255,255,0.75)",

    backdropFilter: "blur(12px)",

    borderRadius: 28,

    padding: 30,

    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  },

  aboutTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
  },

  aboutText: {
    marginTop: 20,

    lineHeight: 1.8,

    color: "#475569",

    fontSize: 16,
  },

  websiteBox: {
    marginTop: 24,

    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  websiteText: {
    color: "#0284c7",
    fontWeight: 700,
  },
};