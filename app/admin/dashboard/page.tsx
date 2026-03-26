"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "../layout-component";

const routes: Record<string, string> = {
  d: "/admin/dashboard", p: "/admin/prescriptions",
  i: "/admin/inventory", o: "/admin/orders",
  c: "/admin/customers", r: "/admin/reminders",
};

export default function AdminDashboard() {
  const [inventory, setInventory] = useState({
    total: 0, totalStock: 0, available: 0, reorder: 0, outOfStock: 0
  });

  useEffect(() => {
    fetch("/api/inventory")
      .then(r => r.json())
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        setInventory({
          total: data.length,
          totalStock: data.reduce((sum, i) => sum + (i.currentStock || 0), 0),
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
    <AdminLayout title="Dashboard" active="/admin/dashboard">

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
        {[
          { icon: "📋", val: "0", label: "Pending Prescription", color: "#B7791F" },
          { icon: "🛒", val: "0", label: "আজকের Orders", color: "#2B6CB0" },
          { icon: "💰", val: "৳০", label: "মোট Due", color: "#C53030" },
          { icon: "💵", val: "৳০", label: "আজকের Revenue", color: "#276749" },
          { icon: "🚚", val: "0", label: "Pending Delivery", color: "#6B46C1" },
          { icon: "🔔", val: "0", label: "আজকের Reminders", color: "#B7791F" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#718096" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#2d3748" }}>📦 Inventory Summary</div>
          <Link href="/admin/inventory" style={{ fontSize: 11, color: "#0D9488", textDecoration: "none" }}>সব দেখুন →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {[
            { num: inventory.total, label: "মোট Medicine", sub: `${inventory.totalStock} unit stock`, color: "#2d3748", bar: "#e2e8f0" },
            { num: inventory.available, label: "Available", sub: "stock আছে", color: "#276749", bar: "#9AE6B4" },
            { num: inventory.reorder, label: "Reorder দরকার", sub: "কম stock", color: "#B7791F", bar: "#F6AD55" },
            { num: inventory.outOfStock, label: "Stock নেই", sub: "unavailable", color: "#C53030", bar: "#FC8181" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#f8fafc", borderRadius: 9, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: item.color, marginBottom: 2 }}>{item.num}</div>
              <div style={{ fontSize: 11, color: "#718096" }}>{item.label}</div>
              <div style={{ fontSize: 10, color: "#a0aec0", marginTop: 2 }}>{item.sub}</div>
              <div style={{ height: 3, borderRadius: 2, background: item.bar, marginTop: 6 }}></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: "#2d3748", marginBottom: 10 }}>
        ⚡ Quick Actions
        <span style={{ fontSize: 11, color: "#a0aec0", fontWeight: 400, marginLeft: 6 }}>(keyboard shortcut)</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {[
          { href: "/admin/prescriptions", icon: "📋", title: "Prescriptions", sub: "Review করুন", key: "P" },
          { href: "/admin/inventory/add", icon: "➕", title: "Medicine যোগ", sub: "AI scan করুন", key: "I" },
          { href: "/admin/orders", icon: "🛒", title: "Orders", sub: "Status update", key: "O" },
          { href: "/admin/payments", icon: "💳", title: "Payments", sub: "Due receive", key: "$" },
          { href: "/admin/customers", icon: "👥", title: "Customers", sub: "সব দেখুন", key: "C" },
          { href: "/admin/reminders", icon: "🔔", title: "Reminders", sub: "Call করুন", key: "R" },
        ].map((item, i) => (
          <Link key={i} href={item.href} style={{
            background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12,
            padding: 14, textDecoration: "none", display: "block", position: "relative",
          }}>
            <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, background: "#f1f5f9", color: "#94a3b8", padding: "1px 5px", borderRadius: 4, fontFamily: "monospace", border: "0.5px solid #e2e8f0" }}>{item.key}</span>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#2d3748", marginBottom: 2 }}>{item.title}</div>
            <div style={{ fontSize: 11, color: "#a0aec0" }}>{item.sub}</div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}