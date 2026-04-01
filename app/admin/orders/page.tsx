"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusColor: Record<string, string> = {
  PENDING: "#718096", CONFIRMED: "#2B6CB0", PROCESSING: "#B7791F",
  OUT_FOR_DELIVERY: "#6B46C1", DELIVERED: "#276749", CANCELLED: "#C53030"
};
const statusBg: Record<string, string> = {
  PENDING: "#f7fafc", CONFIRMED: "#EBF8FF", PROCESSING: "#FFFAF0",
  OUT_FOR_DELIVERY: "#FAF5FF", DELIVERED: "#F0FFF4", CANCELLED: "#FFF5F5"
};
const statusLabel: Record<string, string> = {
  PENDING: "অপেক্ষায়", CONFIRMED: "নিশ্চিত", PROCESSING: "প্রস্তুত হচ্ছে",
  OUT_FOR_DELIVERY: "রাস্তায়", DELIVERED: "পৌঁছেছে", CANCELLED: "বাতিল"
};
const nextStatus: Record<string, string> = {
  PENDING: "CONFIRMED", CONFIRMED: "PROCESSING",
  PROCESSING: "OUT_FOR_DELIVERY", OUT_FOR_DELIVERY: "DELIVERED"
};
const nextLabel: Record<string, string> = {
  PENDING: "✓ Confirm", CONFIRMED: "Pack করুন",
  PROCESSING: "Delivery তে দিন", OUT_FOR_DELIVERY: "Delivered ✓"
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [search, setSearch] = useState("");

  const load = () => {
    fetch("/api/orders").then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, changedBy: "admin" }),
    });
    load();
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === "ALL" || o.status === filter;
    const matchSearch = !search ||
      o.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    ALL: orders.length,
    PENDING: orders.filter(o => o.status === "PENDING").length,
    CONFIRMED: orders.filter(o => o.status === "CONFIRMED").length,
    PROCESSING: orders.filter(o => o.status === "PROCESSING").length,
    OUT_FOR_DELIVERY: orders.filter(o => o.status === "OUT_FOR_DELIVERY").length,
    DELIVERED: orders.filter(o => o.status === "DELIVERED").length,
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", margin: 0 }}>📦 Orders</h1>
        <div style={{ fontSize: 13, color: "#718096" }}>মোট: {orders.length} টি</div>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Customer নাম বা order number search করুন..."
        style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 12, boxSizing: "border-box", background: "#fff" }} />

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: filter === s ? "#0D9488" : "#fff", color: filter === s ? "#fff" : "#4a5568", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            {s === "ALL" ? "সব" : statusLabel[s]} ({counts[s as keyof typeof counts] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
          কোনো order নেই
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((o, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>
                    {o.customer?.fullName || o.customer?.user?.email || "Unknown"}
                  </div>
                  <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>
                    #{o.orderNumber?.slice(-8)} · {new Date(o.createdAt).toLocaleDateString("bn-BD")}
                  </div>
                  {o.deliveryAddress && (
                    <div style={{ fontSize: 11, color: "#718096", marginTop: 2 }}>
                      📍 {o.deliveryAddress}{o.deliveryArea ? `, ${o.deliveryArea}` : ""}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 600, background: statusBg[o.status], color: statusColor[o.status] }}>
                    {statusLabel[o.status]}
                  </span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", marginTop: 6 }}>৳{Number(o.totalAmount).toFixed(0)}</div>
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 10 }}>
                {o.items?.slice(0, 2).map((item: any, j: number) => (
                  <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 3 }}>
                    💊 {item.medicineName} × {item.quantity} = ৳{Number(item.totalPrice).toFixed(0)}
                  </div>
                ))}
                {o.items?.length > 2 && <div style={{ fontSize: 11, color: "#a0aec0" }}>+{o.items.length - 2} টি আরো</div>}
              </div>

              {Number(o.dueAmount) > 0 && (
                <div style={{ background: "#FFF5F5", color: "#C53030", fontSize: 12, padding: "8px 12px", borderRadius: 8, marginBottom: 10, fontWeight: 600 }}>
                  ⚠️ বাকি: ৳{Number(o.dueAmount).toFixed(0)}
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                {nextStatus[o.status] && (
                  <button onClick={() => updateStatus(o.id, nextStatus[o.status])}
                    style={{ flex: 1, background: "#0D9488", color: "#fff", border: "none", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {nextLabel[o.status]}
                  </button>
                )}
                {o.status === "DELIVERED" && Number(o.dueAmount) > 0 && (
                  <Link href="/admin/payments"
                    style={{ flex: 1, background: "#276749", color: "#fff", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>
                    💳 Payment নিন
                  </Link>
                )}
                {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                  <button onClick={() => updateStatus(o.id, "CANCELLED")}
                    style={{ padding: "10px 16px", border: "0.5px solid #FEB2B2", color: "#E53E3E", background: "#fff", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                    বাতিল
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}