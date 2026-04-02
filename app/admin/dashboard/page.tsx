"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "../layout-component";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0, totalProfit: 0, inventoryValue: 0, totalDue: 0,
    totalCustomers: 0, activeOrders: 0, pendingReminders: 0, pendingPrescriptions: 0,
  });
  const [inventory, setInventory] = useState({
    total: 0, totalStock: 0, available: 0, reorder: 0, outOfStock: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/inventory").then(r => r.json()).then((data: any[]) => {
      if (!Array.isArray(data)) return;
      const invValue = data.reduce((sum, i) => sum + (Number(i.unitPrice) * (i.currentStock || 0)), 0);
      setInventory({
        total: data.length,
        totalStock: data.reduce((sum, i) => sum + (i.currentStock || 0), 0),
        available: data.filter(i => i.isAvailable && !i.needsReorder).length,
        reorder: data.filter(i => i.needsReorder).length,
        outOfStock: data.filter(i => !i.isAvailable).length,
      });
      setStats(prev => ({ ...prev, inventoryValue: invValue }));
    });

    fetch("/api/orders").then(r => r.json()).then((data: any[]) => {
      if (!Array.isArray(data)) return;
      const totalSales = data.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
      const totalDue = data.reduce((sum, o) => sum + Number(o.dueAmount || 0), 0);
      const activeOrders = data.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length;
      setStats(prev => ({ ...prev, totalSales, totalDue, activeOrders, totalProfit: totalSales * 0.25 }));
      setRecentOrders(data.slice(0, 5));
    });

    fetch("/api/customers").then(r => r.json()).then((data: any[]) => {
      if (!Array.isArray(data)) return;
      setStats(prev => ({ ...prev, totalCustomers: data.length }));
    });
  }, []);

  const statusLabel: Record<string, string> = {
    PENDING: "অপেক্ষায়", CONFIRMED: "নিশ্চিত", PROCESSING: "প্রস্তুত",
    OUT_FOR_DELIVERY: "রাস্তায়", DELIVERED: "পৌঁছেছে", CANCELLED: "বাতিল",
  };
  const statusColor: Record<string, string> = {
    PENDING: "#718096", CONFIRMED: "#2B6CB0", PROCESSING: "#B7791F",
    OUT_FOR_DELIVERY: "#6B46C1", DELIVERED: "#276749", CANCELLED: "#C53030",
  };
  const statusBg: Record<string, string> = {
    PENDING: "#f7fafc", CONFIRMED: "#EBF8FF", PROCESSING: "#FFFAF0",
    OUT_FOR_DELIVERY: "#FAF5FF", DELIVERED: "#F0FFF4", CANCELLED: "#FFF5F5",
  };

  return (
    <AdminLayout title="Dashboard" active="/admin/dashboard">
      <div style={{ fontFamily: "sans-serif" }}>

        <div style={{ fontSize: 12, color: "#718096", marginBottom: 8, fontWeight: 600 }}>💰 বিক্রয় ও আয়</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { val: `৳${stats.totalSales.toFixed(0)}`, label: "মোট বিক্রয়", color: "#0D9488", bg: "#E6FFFA", href: "/admin/orders" },
            { val: `৳${stats.totalProfit.toFixed(0)}`, label: "মোট Profit", color: "#276749", bg: "#F0FFF4", href: "/admin/orders" },
            { val: `৳${stats.inventoryValue.toFixed(0)}`, label: "Inventory মূল্য", color: "#2B6CB0", bg: "#EBF8FF", href: "/admin/inventory" },
            { val: `৳${stats.totalDue.toFixed(0)}`, label: "মোট Due", color: "#C53030", bg: "#FFF5F5", href: "/admin/payments" },
          ].map((s, i) => (
            <Link key={i} href={s.href} style={{ textDecoration: "none" }}>
              <div style={{ background: s.bg, borderRadius: 12, padding: 16, border: "0.5px solid #e8ecf0", cursor: "pointer" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#718096" }}>{s.label}</div>
                <div style={{ fontSize: 10, color: s.color, marginTop: 4 }}>বিস্তারিত →</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ fontSize: 12, color: "#718096", marginBottom: 8, fontWeight: 600 }}>👥 Customer তথ্য</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { val: stats.totalCustomers, label: "মোট Customer", color: "#6B46C1", bg: "#FAF5FF", href: "/admin/customers" },
            { val: stats.activeOrders, label: "Active Orders", color: "#B7791F", bg: "#FFFAF0", href: "/admin/orders" },
            { val: inventory.reorder, label: "Reorder দরকার", color: "#C53030", bg: "#FFF5F5", href: "/admin/inventory" },
            { val: inventory.outOfStock, label: "Stock নেই", color: "#718096", bg: "#f7fafc", href: "/admin/inventory" },
          ].map((s, i) => (
            <Link key={i} href={s.href} style={{ textDecoration: "none" }}>
              <div style={{ background: s.bg, borderRadius: 12, padding: 16, border: "0.5px solid #e8ecf0", cursor: "pointer" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#718096" }}>{s.label}</div>
                <div style={{ fontSize: 10, color: s.color, marginTop: 4 }}>বিস্তারিত →</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#1a202c" }}>📦 সাম্প্রতিক Orders</span>
              <Link href="/admin/orders" style={{ fontSize: 12, color: "#0D9488", textDecoration: "none" }}>সব দেখুন</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#a0aec0", fontSize: 13 }}>কোনো order নেই</div>
            ) : (
              recentOrders.map((o, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < recentOrders.length - 1 ? "0.5px solid #f7fafc" : "none" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a202c" }}>{o.customer?.fullName || "Customer"}</div>
                    <div style={{ fontSize: 11, color: "#a0aec0" }}>#{o.orderNumber?.slice(-6)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0D9488" }}>৳{Number(o.totalAmount).toFixed(0)}</div>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 600, background: statusBg[o.status] || "#f7fafc", color: statusColor[o.status] || "#718096" }}>
                      {statusLabel[o.status] || o.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#1a202c", marginBottom: 14 }}>⚡ Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { href: "/admin/prescriptions", icon: "📋", title: "Prescriptions", sub: "Review করুন" },
                { href: "/admin/inventory/add", icon: "➕", title: "Medicine যোগ", sub: "AI scan" },
                { href: "/admin/orders", icon: "🛒", title: "Orders", sub: "Status update" },
                { href: "/admin/payments", icon: "💳", title: "Payments", sub: "Due receive" },
                { href: "/admin/customers", icon: "👥", title: "Customers", sub: "সব দেখুন" },
                { href: "/admin/reminders", icon: "🔔", title: "Reminders", sub: "Call করুন" },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ background: "#f7f8fa", border: "0.5px solid #e8ecf0", borderRadius: 10, padding: 12, textDecoration: "none", display: "block" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a202c" }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: "#a0aec0" }}>{item.sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1a202c" }}>💊 Inventory Summary</span>
            <Link href="/admin/inventory" style={{ fontSize: 12, color: "#0D9488", textDecoration: "none" }}>সব দেখুন</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { num: inventory.total, label: "মোট Medicine", color: "#1a202c", bg: "#f7f8fa" },
              { num: inventory.available, label: "Available", color: "#276749", bg: "#F0FFF4" },
              { num: inventory.reorder, label: "Reorder দরকার", color: "#B7791F", bg: "#FFFAF0" },
              { num: inventory.outOfStock, label: "Stock নেই", color: "#C53030", bg: "#FFF5F5" },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: 10, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.num}</div>
                <div style={{ fontSize: 11, color: "#718096" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

