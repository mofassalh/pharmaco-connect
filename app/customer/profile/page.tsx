"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(data => {
      if (data.id) setUser(data);
      setLoading(false);
    });
    fetch("/api/orders?my=1").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setOrders(data);
    });
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.paidAmount || 0), 0);
  const dueAmount = orders.reduce((sum, o) => sum + Number(o.dueAmount || 0), 0);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, fontFamily: "sans-serif" }}>
        <div style={{ color: "#a0aec0" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif", paddingBottom: 24 }}>

      {/* Profile Card */}
      <div style={{ background: "linear-gradient(135deg, #0D9488, #0f766e)", padding: "24px 16px 32px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user?.photoUrl ? (
            <img src={user.photoUrl} alt="Profile" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.4)" }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "3px solid rgba(255,255,255,0.4)" }}>👤</div>
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>{user?.name || "নাম নেই"}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{user?.phone || user?.email}</div>
            {user?.area && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>📍 {user.area}{user.city ? `, ${user.city}` : ""}</div>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "16px 16px 0" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center", border: "0.5px solid #e8ecf0" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#0D9488" }}>{orders.length}</div>
          <div style={{ fontSize: 11, color: "#718096", marginTop: 2 }}>Orders</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 12, textAlign: "center", border: "0.5px solid #e8ecf0" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#2B6CB0" }}>৳{totalSpent.toFixed(0)}</div>
          <div style={{ fontSize: 11, color: "#718096", marginTop: 2 }}>মোট খরচ</div>
        </div>
        <div style={{ background: dueAmount > 0 ? "#FFF5F5" : "#fff", borderRadius: 12, padding: 12, textAlign: "center", border: dueAmount > 0 ? "0.5px solid #FEB2B2" : "0.5px solid #e8ecf0" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: dueAmount > 0 ? "#C53030" : "#276749" }}>৳{dueAmount.toFixed(0)}</div>
          <div style={{ fontSize: 11, color: "#718096", marginTop: 2 }}>বাকি</div>
        </div>
      </div>

      {/* Edit Button */}
      <div style={{ padding: "12px 16px" }}>
        <Link href="/customer/profile/edit" style={{ display: "block", width: "100%", background: "#0D9488", color: "#fff", padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>
          ✏️ Profile Edit করুন
        </Link>
      </div>

      {/* Menu */}
      <div style={{ margin: "0 16px", background: "#fff", borderRadius: 14, border: "0.5px solid #e8ecf0", overflow: "hidden" }}>
        {[
          { href: "/customer/prescription", icon: "📋", label: "আমার Prescriptions", sub: "সব prescription দেখুন" },
          { href: "/customer/orders", icon: "📦", label: "আমার Orders", sub: "Order history" },
          { href: "/customer/profile/family", icon: "👨‍👩‍👧‍👦", label: "পরিবারের সদস্য", sub: "সদস্য যোগ করুন" },
          { href: "/customer/profile/billing", icon: "💳", label: "Billing ও বাকি টাকা", sub: "Payment history" },
          { href: "/customer/profile/refills", icon: "🔔", label: "Monthly Refill", sub: "নিয়মিত Medicine" },
          { href: "/customer/profile/settings", icon: "⚙️", label: "Settings", sub: "ভাষা, নোটিফিকেশন" },
        ].map((item, i, arr) => (
          <Link key={i} href={item.href} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 16px",
            borderBottom: i < arr.length - 1 ? "0.5px solid #f7fafc" : "none",
            textDecoration: "none",
          }}>
            <span style={{ fontSize: 22, width: 36, textAlign: "center" }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#a0aec0", marginTop: 1 }}>{item.sub}</div>
            </div>
            <span style={{ color: "#cbd5e0", fontSize: 16 }}>›</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: "12px 16px" }}>
        <button
          onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
          style={{ width: "100%", color: "#E53E3E", background: "#fff5f5", border: "0.5px solid #FEB2B2", padding: "12px", borderRadius: 12, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}