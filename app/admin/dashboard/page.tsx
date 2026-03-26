"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  { href: "/admin/dashboard", icon: "⊞", label: "Dashboard" },
  { href: "/admin/prescriptions", icon: "📋", label: "Prescriptions" },
  { href: "/admin/inventory", icon: "📦", label: "Inventory" },
  { href: "/admin/orders", icon: "🛒", label: "Orders" },
  { href: "/admin/payments", icon: "💳", label: "Payments" },
  { href: "/admin/customers", icon: "👥", label: "Customers" },
  { href: "/admin/reminders", icon: "🔔", label: "Reminders" },
];

const stats = [
  { icon: "📋", label: "Pending Prescription", value: "0", bg: "#FFF8E7", color: "#B7791F" },
  { icon: "📦", label: "আজকের Orders", value: "0", bg: "#EBF8FF", color: "#2B6CB0" },
  { icon: "⚠️", label: "Low Stock", value: "0", bg: "#FFF5F5", color: "#C53030" },
  { icon: "💰", label: "মোট Due", value: "৳০", bg: "#FFF5F5", color: "#C53030" },
  { icon: "💵", label: "আজকের Revenue", value: "৳০", bg: "#F0FFF4", color: "#276749" },
  { icon: "🚚", label: "Pending Delivery", value: "0", bg: "#FAF5FF", color: "#6B46C1" },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#efefef", fontFamily: "sans-serif" }}>

      {/* Top Nav */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 4 }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "#0D9488", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14 }}>💊</div>
            <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 15 }}>Pharmaco Connect</span>
            <span style={{ background: "#EDE9FE", color: "#6D28D9", fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>Admin</span>
          </div>
        </div>
        <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
          style={{ background: "none", border: "1px solid #FEB2B2", color: "#E53E3E", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          Logout
        </button>
      </div>

      <div style={{ display: "flex" }}>

        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? 220 : 0,
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          minHeight: "calc(100vh - 56px)",
          overflow: "hidden",
          transition: "width 0.25s ease",
          flexShrink: 0,
          position: "sticky",
          top: 56,
          height: "calc(100vh - 56px)",
        }}>
          <div style={{ padding: "16px 12px", width: 220 }}>
            {menuItems.map((item, i) => (
              <Link key={i} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, marginBottom: 4,
                color: "#4a5568", textDecoration: "none", fontSize: 14, fontWeight: 500,
                background: item.href === "/admin/dashboard" ? "#F0FDF4" : "transparent",
                transition: "background 0.15s"
              }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "24px 20px", maxWidth: 1000 }}>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a202c", marginBottom: 20 }}>Dashboard</h1>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: 14, padding: "16px 14px" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#718096", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#2d3748", marginBottom: 12 }}>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { href: "/admin/prescriptions", icon: "📋", title: "Prescriptions", sub: "Review ও approve করুন", color: "#FFF8E7" },
              { href: "/admin/inventory/add", icon: "➕", title: "Medicine যোগ করুন", sub: "AI দিয়ে box scan করুন", color: "#F0FFF4" },
              { href: "/admin/orders", icon: "🛒", title: "Orders", sub: "Status update করুন", color: "#EBF8FF" },
              { href: "/admin/payments", icon: "💳", title: "Payments & Due", sub: "Payment receive করুন", color: "#FFF5F5" },
              { href: "/admin/customers", icon: "👥", title: "Customers", sub: "সব customer দেখুন", color: "#FAF5FF" },
              { href: "/admin/reminders", icon: "🔔", title: "Reminders", sub: "Call ও confirm করুন", color: "#E6FFFA" },
            ].map((item, i) => (
              <Link key={i} href={item.href} style={{
                background: item.color, borderRadius: 14, padding: "18px 16px",
                textDecoration: "none", display: "block",
                border: "1px solid rgba(0,0,0,0.05)",
                transition: "transform 0.15s"
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontWeight: 600, color: "#2d3748", fontSize: 14 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#718096", marginTop: 4 }}>{item.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}