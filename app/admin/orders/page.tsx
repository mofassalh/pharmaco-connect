"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "../layout-component";

const statusColor: Record<string, string> = { PENDING: "#718096", CONFIRMED: "#2B6CB0", PROCESSING: "#B7791F", OUT_FOR_DELIVERY: "#6B46C1", DELIVERED: "#276749", CANCELLED: "#C53030" };
const statusBg: Record<string, string> = { PENDING: "#f7fafc", CONFIRMED: "#EBF8FF", PROCESSING: "#FFFAF0", OUT_FOR_DELIVERY: "#FAF5FF", DELIVERED: "#F0FFF4", CANCELLED: "#FFF5F5" };
const statusLabel: Record<string, string> = { PENDING: "অপেক্ষায়", CONFIRMED: "নিশ্চিত", PROCESSING: "প্রস্তুত হচ্ছে", OUT_FOR_DELIVERY: "রাস্তায়", DELIVERED: "পৌঁছেছে", CANCELLED: "বাতিল" };
const nextStatus: Record<string, string> = { PENDING: "CONFIRMED", CONFIRMED: "PROCESSING", PROCESSING: "OUT_FOR_DELIVERY", OUT_FOR_DELIVERY: "DELIVERED" };
const nextLabel: Record<string, string> = { PENDING: "✓ Confirm", CONFIRMED: "Pack করুন", PROCESSING: "Delivery তে দিন", OUT_FOR_DELIVERY: "Delivered ✓" };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  const load = () => {
    fetch("/api/orders").then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, changedBy: "admin" }) });
    load();
  };

  const filtered = orders.filter(o => filter === "ALL" || o.status === filter);

  return (
    <AdminLayout title="Orders" active="/admin/orders">
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 12px", borderRadius: 9, fontSize: 12, fontWeight: 500, border: "0.5px solid #e2e8f0", background: filter === s ? "#0D9488" : "#fff", color: filter === s ? "#fff" : "#4a5568", cursor: "pointer" }}>
            {s === "ALL" ? "সব" : statusLabel[s] || s}
          </button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div> :
        filtered.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}><div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>কোনো order নেই</div> :
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((o, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{o.customer?.user?.email || "Unknown"}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0", fontFamily: "monospace" }}>{o.orderNumber}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600, background: statusBg[o.status], color: statusColor[o.status] }}>{statusLabel[o.status]}</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1a202c", marginTop: 4 }}>৳{Number(o.totalAmount).toFixed(0)}</div>
                </div>
              </div>
              {o.dueAmount > 0 && <div style={{ background: "#FFF5F5", color: "#C53030", fontSize: 12, padding: "6px 10px", borderRadius: 8, marginBottom: 8 }}>⚠️ বাকি: ৳{Number(o.dueAmount).toFixed(0)}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                {nextStatus[o.status] && (
                  <button onClick={() => updateStatus(o.id, nextStatus[o.status])} style={{ flex: 1, background: "#0D9488", color: "#fff", border: "none", padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {nextLabel[o.status]}
                  </button>
                )}
                {o.status === "DELIVERED" && o.dueAmount > 0 && (
                  <Link href={`/admin/payments`} style={{ flex: 1, background: "#38A169", color: "#fff", padding: "9px", borderRadius: 9, fontSize: 13, fontWeight: 600, textAlign: "center", textDecoration: "none" }}>
                    💳 Payment
                  </Link>
                )}
                {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                  <button onClick={() => updateStatus(o.id, "CANCELLED")} style={{ padding: "9px 14px", border: "0.5px solid #FEB2B2", color: "#E53E3E", background: "#fff", borderRadius: 9, fontSize: 13, cursor: "pointer" }}>
                    বাতিল
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}