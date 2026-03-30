"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusLabel: Record<string, string> = {
  PENDING: "অপেক্ষায়",
  CONFIRMED: "নিশ্চিত",
  PROCESSING: "প্রস্তুত হচ্ছে",
  OUT_FOR_DELIVERY: "রাস্তায় আছে",
  DELIVERED: "পৌঁছে গেছে",
  CANCELLED: "বাতিল",
};

const statusColor: Record<string, string> = {
  PENDING: "#718096",
  CONFIRMED: "#2B6CB0",
  PROCESSING: "#B7791F",
  OUT_FOR_DELIVERY: "#6B46C1",
  DELIVERED: "#276749",
  CANCELLED: "#C53030",
};

const statusBg: Record<string, string> = {
  PENDING: "#f7fafc",
  CONFIRMED: "#EBF8FF",
  PROCESSING: "#FFFAF0",
  OUT_FOR_DELIVERY: "#FAF5FF",
  DELIVERED: "#F0FFF4",
  CANCELLED: "#FFF5F5",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    fetch("/api/orders?my=1")
      .then(r => r.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId);
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "CANCELLED",
        changedBy: "customer",
        note: "Customer কর্তৃক বাতিল",
      }),
    });

    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "CANCELLED" } : o));
    } else {
      alert("বাতিল করা যায়নি");
    }
    setCancelling(null);
    setConfirmCancel(null);
  };

  const canCancel = (status: string) => status === "PENDING" || status === "CONFIRMED";

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, fontFamily: "sans-serif" }}>
        <div style={{ color: "#a0aec0" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", margin: 0 }}>📦 আমার Orders</h1>
        <Link href="/customer/shop" style={{ background: "#0D9488", color: "#fff", padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
          + নতুন Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <div style={{ color: "#718096", marginBottom: 16, fontSize: 14 }}>এখনো কোনো order নেই</div>
          <Link href="/customer/shop" style={{ background: "#0D9488", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Medicine কিনুন
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((order, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

              {/* Order Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1a202c" }}>
                    #{order.orderNumber?.slice(-8) || order.id?.slice(-8)}
                  </div>
                  <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>
                    {new Date(order.createdAt).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, padding: "4px 12px", borderRadius: 20, fontWeight: 600,
                  background: statusBg[order.status] || "#f7fafc",
                  color: statusColor[order.status] || "#718096"
                }}>
                  {statusLabel[order.status] || order.status}
                </span>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 12 }}>
                {order.items?.slice(0, 3).map((item: any, j: number) => (
                  <div key={j} style={{ fontSize: 12, color: "#4a5568", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                    <span>💊 {item.medicineName} × {item.quantity}</span>
                    <span style={{ color: "#718096" }}>৳{Number(item.totalPrice).toFixed(0)}</span>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>+{order.items.length - 3} টি আরো</div>
                )}
              </div>

              {/* Footer */}
              <div style={{ borderTop: "0.5px solid #f7fafc", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#718096" }}>মোট</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1a202c" }}>৳{Number(order.totalAmount).toFixed(0)}</div>
                  {Number(order.dueAmount) > 0 && (
                    <div style={{ fontSize: 11, color: "#C53030", fontWeight: 600 }}>বাকি: ৳{Number(order.dueAmount).toFixed(0)}</div>
                  )}
                </div>

                {/* Cancel Button */}
                {canCancel(order.status) && (
                  <div>
                    {confirmCancel === order.id ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#718096" }}>নিশ্চিত?</span>
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelling === order.id}
                          style={{ background: "#C53030", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                          {cancelling === order.id ? "বাতিল হচ্ছে..." : "হ্যাঁ"}
                        </button>
                        <button
                          onClick={() => setConfirmCancel(null)}
                          style={{ background: "#fff", color: "#718096", border: "0.5px solid #e2e8f0", padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                          না
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmCancel(order.id)}
                        style={{ background: "#FFF5F5", color: "#C53030", border: "0.5px solid #FEB2B2", padding: "8px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                        ✕ বাতিল করুন
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}