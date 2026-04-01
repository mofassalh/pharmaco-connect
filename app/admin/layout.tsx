"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/admin/orders", icon: "📦", label: "Orders" },
  { href: "/admin/customers", icon: "👥", label: "Customers" },
  { href: "/admin/inventory", icon: "💊", label: "Inventory" },
  { href: "/admin/prescriptions", icon: "📋", label: "Prescriptions" },
  { href: "/admin/payments", icon: "💳", label: "Payments" },
  { href: "/admin/reminders", icon: "🔔", label: "Reminders" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa", fontFamily: "sans-serif" }}>

      {/* Top Nav */}
      <div style={{
        background: "#1a202c", padding: "0 20px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#fff" }}
            className="mobile-menu-btn">
            ☰
          </button>
          <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, background: "#0D9488", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💊</div>
            <span style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>Pharmaco Admin</span>
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/customer/dashboard" style={{ fontSize: 12, color: "#9FE1CB", textDecoration: "none" }}>
            Customer Portal →
          </Link>
          <button
            onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/admin/login"; }}
            style={{ background: "#C53030", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>

        {/* Desktop Sidebar */}
        <div style={{
          width: 220, background: "#1a202c",
          display: "flex", flexDirection: "column",
          position: "sticky", top: 56, height: "calc(100vh - 56px)",
          overflowY: "auto", flexShrink: 0,
        }} className="desktop-sidebar">
          <div style={{ padding: "16px 10px", flex: 1 }}>
            {menuItems.map((item, i) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={i} href={item.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 14px", borderRadius: 10, marginBottom: 4,
                    color: active ? "#0D9488" : "#a0aec0",
                    background: active ? "rgba(13,148,136,0.1)" : "transparent",
                    textDecoration: "none", fontSize: 14, fontWeight: 500,
                    borderLeft: active ? "3px solid #0D9488" : "3px solid transparent",
                  }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199, top: 56 }}
            className="mobile-overlay" />
        )}

        {/* Mobile Sidebar */}
        <div style={{
          position: "fixed", top: 56, left: 0, bottom: 0, width: 260,
          background: "#1a202c",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          zIndex: 200, overflowY: "auto",
          display: "flex", flexDirection: "column",
        }} className="mobile-sidebar">
          <div style={{ padding: "16px 10px", flex: 1 }}>
            {menuItems.map((item, i) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={i} href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 10, marginBottom: 4,
                    color: active ? "#0D9488" : "#a0aec0",
                    background: active ? "rgba(13,148,136,0.1)" : "transparent",
                    textDecoration: "none", fontSize: 14, fontWeight: 500,
                    borderLeft: active ? "3px solid #0D9488" : "3px solid transparent",
                  }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px", minWidth: 0 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {children}
            <div style={{ borderTop: "0.5px solid #e2e8f0", marginTop: 32, paddingTop: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#a0aec0" }}>© 2026 Pharmaco Connect Admin Panel</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar { display: none !important; }
          .mobile-overlay { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}