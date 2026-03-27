"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/language";

export default function CustomerDashboard() {
  const [userName, setUserName] = useState("...");
  const [dueAmount, setDueAmount] = useState(0);
  const { t, lang } = useLanguage();

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (data.name) setUserName(data.name);
      });
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>

      {/* Welcome */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a202c" }}>
          {t("welcome")}, {userName.split(" ")[0]} 👋
        </h1>
      </div>

      {dueAmount > 0 && (
        <div style={{ background: "#FFF5F5", border: "0.5px solid #FEB2B2", borderRadius: 12, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#C53030" }}>{t("dueAmount")}!</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#C53030" }}>৳ {dueAmount.toLocaleString()}</div>
          </div>
          <Link href="/customer/profile/billing" style={{ background: "#C53030", color: "#fff", padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            {t("payNow")}
          </Link>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { val: "0", label: t("totalPrescription"), color: "#0D9488" },
          { val: "0", label: t("activeOrders"), color: "#2B6CB0" },
          { val: "0", label: t("regularMedicine"), color: "#B7791F" },
          { val: "0", label: t("refillDays"), color: "#6B46C1" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "#718096" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Link href="/customer/prescription/upload" style={{ background: "#0D9488", color: "#fff", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 28 }}>📋</span>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{t("uploadPrescription")}</div>
          <div style={{ fontSize: 11, color: "#9FE1CB" }}>AI auto-fill</div>
        </Link>
        <Link href="/customer/shop" style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 28 }}>💊</span>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>{t("buyMedicine")}</div>
          <div style={{ fontSize: 11, color: "#a0aec0" }}>{t("available")}</div>
        </Link>
        <Link href="/customer/orders" style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 28 }}>📦</span>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>{t("myOrders")}</div>
          <div style={{ fontSize: 11, color: "#a0aec0" }}>{t("viewAll")}</div>
        </Link>
        <Link href="/customer/profile/refills" style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 28 }}>🔔</span>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>{t("monthlyRefill")}</div>
          <div style={{ fontSize: 11, color: "#a0aec0" }}>Reminder</div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>{t("recentOrders")}</span>
          <Link href="/customer/orders" style={{ fontSize: 12, color: "#0D9488", textDecoration: "none" }}>{t("viewAll")}</Link>
        </div>
        <div style={{ textAlign: "center", padding: "20px 0", color: "#a0aec0", fontSize: 13 }}>
          {t("noOrders")}
        </div>
      </div>
    </div>
  );
}