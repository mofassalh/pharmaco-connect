"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  { href: "/admin/dashboard", icon: "⊞", label: "Dashboard", key: "D" },
  { href: "/admin/prescriptions", icon: "📋", label: "Prescriptions", key: "P" },
  { href: "/admin/inventory", icon: "📦", label: "Inventory", key: "I" },
  { href: "/admin/orders", icon: "🛒", label: "Orders", key: "O" },
  { href: "/admin/payments", icon: "💳", label: "Payments", key: "$" },
  { href: "/admin/customers", icon: "👥", label: "Customers", key: "C" },
  { href: "/admin/reminders", icon: "🔔", label: "Reminders", key: "R" },
];

const routes: Record<string, string> = {
  d: "/admin/dashboard",
  p: "/admin/prescriptions",
  i: "/admin/inventory",
  o: "/admin/orders",
  c: "/admin/customers",
  r: "/admin/reminders",
};

export default function AdminDashboard() {
  const [inventory, setInventory] = useState({ total: 0, available: 0, reorder: 0, outOfStock: 0 });

  useEffect(() => {
    fetch("/api/inventory")
      .then(r => r.json())
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        setInventory({
          total: data.length,
          available: data.filter(i => i.isAvailable && !i.needsReorder).length,
          reorder: data.filter(i => i.needsReorder).length,
          outOfStock: data.filter(i => !i.isAvailable).length,
        });
      });

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const route = routes[e.key.toLowerCase()];
      if (route) window.location.href = route;
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#efefef", fontFamily: "sans-serif" }}>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#ffffff", borderRight: "0.5px solid #e2e8f0", flexShrink: 0, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: 16, borderBottom: "0.5px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "#0D9488", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16 }}>💊</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a202c" }}>Pharmaco Connect</div>
            <span style={{ fontSize: 10, background: "#EDE9FE", color: "#6D28D9", padding: "2px 7px", borderRadius: 20, fontWeight: 600 }}>Admin</span>
          </div>
        </div>

        <div style={{ padding: "10px 8px", flex: 1 }}>
          {menuItems.map((item, i) => (
            <Link key={i} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 9, marginBottom: 2,
              color: item.href === "/admin/dashboard" ? "#0D9488" : "#4a5568",
              background: item.href === "/admin/dashboard" ? "#F0FDF4" : "transparent",
              textDecoration: "none", fontSize: 13, fontWeight: 500,
            }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 10, background: "#f1f5f9", color: "#94a3b8", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", border: "0.5px solid #e2e8f0" }}>{item.key}</span>
            </Link>
          ))}
        </div>

        <div style={{ padding: "12px 16px", borderTop: "0.5px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#2d3748" }}>Admin User</div>
          <div style={{ fontSize: 11, color: "#a0aec0" }}>admin@pharmaco.com</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1a202c" }}>Dashboard</div>
          <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
            style={{ fontSize: 12, color: "#E53E3E", background: "none", border: "0.5px solid #FEB2B2", padding: "5px 12px", borderRadius: 7, cursor: "pointer" }}>
            Logout
          </button>
        </div>
        <div style={{ fontSize: 12, color: "#a0aec0", marginBottom: 18 }}>
          {new Date().toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
          {[
            { icon: "📋", val: "0", label: "Pending Prescription", color: "#B7791F" },
            { icon: "🛒", val: "0", label: "আজকের Orders", color: "#2B6CB0" },
            { icon: "💰", val: "৳০", label: "মোট Due", color: "#C53030" },
            { icon: "💵", val: "৳০", label: "আজকের Revenue", color: "#276749" },
            { icon: "🚚", val: "0", label: "Pending Delivery", color: "#6B46C1" },
            { icon: "🔔", val: "0", label: "আজকের Reminders", color: "#B7791F" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, marginBottom: 3 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "#718096" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Inventory Summary */}
        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#2d3748", display: "flex", alignItems: "center", gap: 6 }}>
              <span>📦</span> Inventory Summary
            </div>
            <Link href="/admin/inventory" style={{ fontSize: 11, color: "#0D9488", textDecoration: "none" }}>সব দেখুন →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { num: inventory.total, label: "মোট Medicine", color: "#2d3748", bar: "#e2e8f0" },
              { num: inventory.available, label: "Available", color: "#276749", bar: "#9AE6B4" },
              { num: inventory.reorder, label: "Reorder দরকার", color: "#B7791F", bar: "#F6AD55" },
              { num: inventory.outOfStock, label: "Stock নেই", color: "#C53030", bar: "#FC8181" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 9, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.num}</div>
                <div style={{ fontSize: 11, color: "#718096" }}>{item.label}</div>
                <div style={{ height: 4, borderRadius: 2, background: item.bar, marginTop: 8 }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ fontSize: 13, fontWeight: 600, color: "#2d3748", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <span>⚡</span> Quick Actions
          <span style={{ fontSize: 11, color: "#a0aec0", fontWeight: 400 }}>(keyboard shortcut)</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
          {[
            { href: "/admin/prescriptions", icon: "📋", title: "Prescriptions", sub: "Review ও approve করুন", key: "P" },
            { href: "/admin/inventory/add", icon: "➕", title: "Medicine যোগ করুন", sub: "AI দিয়ে box scan করুন", key: "I" },
            { href: "/admin/orders", icon: "🛒", title: "Orders", sub: "Status update করুন", key: "O" },
            { href: "/admin/payments", icon: "💳", title: "Payments & Due", sub: "Payment receive করুন", key: "$" },
            { href: "/admin/customers", icon: "👥", title: "Customers", sub: "সব customer দেখুন", key: "C" },
            { href: "/admin/reminders", icon: "🔔", title: "Reminders", sub: "Call ও confirm করুন", key: "R" },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{
              background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12,
              padding: 14, textDecoration: "none", display: "block", position: "relative",
            }}>
              <span style={{ position: "absolute", top: 10, right: 10, fontSize: 10, background: "#f1f5f9", color: "#94a3b8", padding: "2px 6px", borderRadius: 5, fontFamily: "monospace", border: "0.5px solid #e2e8f0" }}>{item.key}</span>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#2d3748", marginBottom: 3 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "#a0aec0" }}>{item.sub}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
