"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerDashboard() {
  const [userName, setUserName] = useState("...");
  const [orders, setOrders] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(data => { if (data.name) setUserName(data.name); });
    fetch("/api/orders?my=1").then(r => r.json()).then(data => { if (Array.isArray(data)) setOrders(data); });
    fetch("/api/prescriptions/my").then(r => r.json()).then(data => { if (Array.isArray(data)) setPrescriptions(data); });
  }, []);

  const pendingOrders = orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length;
  const dueAmount = orders.reduce((sum, o) => sum + Number(o.dueAmount || 0), 0);

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif" }}>

      {/* Welcome */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a202c", margin: 0 }}>
          স্বাগতম, {userName.split(" ")[0]} 👋
        </h1>
        <p style={{ fontSize: 13, color: "#718096", marginTop: 4 }}>আজকে কী লাগবে?</p>
      </div>

      {/* Due Alert */}
      {dueAmount > 0 && (
        <div style={{ background: "#FFF5F5", border: "0.5px solid #FEB2B2", borderRadius: 12, padding: 14, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#C53030" }}>বাকি আছে!</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#C53030" }}>৳{dueAmount.toLocaleString()}</div>
          </div>
          <Link href="/customer/profile/billing" style={{ background: "#C53030", color: "#fff", padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            পরিশোধ করুন
          </Link>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { val: prescriptions.length, label: "মোট Prescription", color: "#0D9488", bg: "#E6FFFA" },
          { val: pendingOrders, label: "Active Orders", color: "#2B6CB0", bg: "#EBF8FF" },
          { val: orders.length, label: "মোট Orders", color: "#B7791F", bg: "#FFFAF0" },
          { val: "0", label: "Loyalty Points", color: "#6B46C1", bg: "#FAF5FF" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "#718096" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <Link href="/customer/prescription/upload" style={{ background: "#0D9488", color: "#fff", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 28 }}>📋</span>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Prescription Upload</div>
          <div style={{ fontSize: 11, color: "#9FE1CB" }}>AI auto-fill</div>
        </Link>
        <Link href="/customer/shop" style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 28 }}>💊</span>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>Medicine কিনুন</div>
          <div style={{ fontSize: 11, color: "#a0aec0" }}>Shop থেকে order করুন</div>
        </Link>
        <Link href="/customer/orders" style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 28 }}>📦</span>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>আমার Orders</div>
          <div style={{ fontSize: 11, color: "#a0aec0" }}>সব orders দেখুন</div>
        </Link>
        <Link href="/customer/profile/refills" style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 28 }}>🔔</span>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>Monthly Refill</div>
          <div style={{ fontSize: 11, color: "#a0aec0" }}>Reminder set করুন</div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>সাম্প্রতিক Orders</span>
          <Link href="/customer/orders" style={{ fontSize: 12, color: "#0D9488", textDecoration: "none" }}>সব দেখুন</Link>
        </div>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#a0aec0", fontSize: 13 }}>এখনো কোনো order নেই</div>
        ) : (
          orders.slice(0, 3).map((o, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "0.5px solid #f7fafc" : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a202c" }}>Order #{o.orderNumber?.slice(-6)}</div>
                <div style={{ fontSize: 11, color: "#a0aec0" }}>{new Date(o.createdAt).toLocaleDateString("bn-BD")}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0D9488" }}>৳{Number(o.totalAmount).toFixed(0)}</div>
                <div style={{ fontSize: 11, color: "#718096" }}>{o.status}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}