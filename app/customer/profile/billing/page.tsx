"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?my=1")
      .then(r => r.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const totalAmount = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const totalPaid = orders.reduce((sum, o) => sum + Number(o.paidAmount || 0), 0);
  const totalDue = orders.reduce((sum, o) => sum + Number(o.dueAmount || 0), 0);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, fontFamily: "sans-serif" }}>
        <div style={{ color: "#a0aec0" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: 32 }}>

      {/* Sub Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 48, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 56, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#a0aec0" }}>←</button>
        <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 15 }}>💳 Billing ও বাকি টাকা</span>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>

        {/* Summary */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 20, marginBottom: 16 }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#718096", marginBottom: 4 }}>মোট বাকি</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: totalDue > 0 ? "#C53030" : "#276749" }}>
              ৳{totalDue.toFixed(0)}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "#f7f8fa", borderRadius: 12, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1a202c" }}>৳{totalAmount.toFixed(0)}</div>
              <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>মোট কেনা</div>
            </div>
            <div style={{ background: "#F0FFF4", borderRadius: 12, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#276749" }}>৳{totalPaid.toFixed(0)}</div>
              <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>মোট পরিশোধ</div>
            </div>
          </div>
          {totalDue > 0 && (
            <div style={{ background: "#FFF5F5", border: "0.5px solid #FEB2B2", borderRadius: 10, padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#C53030", fontWeight: 600 }}>⚠️ ৳{totalDue.toFixed(0)} বাকি আছে</div>
              <div style={{ fontSize: 12, color: "#718096", marginTop: 4 }}>দয়া করে দ্রুত পরিশোধ করুন</div>
            </div>
          )}
        </div>

        {/* Orders with due */}
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c", marginBottom: 14 }}>Order Payment Status</div>
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: "#a0aec0", fontSize: 13 }}>কোনো order নেই</div>
          ) : (
            orders.map((o, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < orders.length - 1 ? "0.5px solid #f7fafc" : "none" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a202c" }}>#{o.orderNumber?.slice(-6)}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0" }}>{new Date(o.createdAt).toLocaleDateString("bn-BD")}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a202c" }}>৳{Number(o.totalAmount).toFixed(0)}</div>
                  {Number(o.dueAmount) > 0 ? (
                    <div style={{ fontSize: 11, color: "#C53030", fontWeight: 600 }}>বাকি: ৳{Number(o.dueAmount).toFixed(0)}</div>
                  ) : (
                    <div style={{ fontSize: 11, color: "#276749", fontWeight: 600 }}>✓ পরিশোধ</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}