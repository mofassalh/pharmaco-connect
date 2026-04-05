"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "../layout-component";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"pending" | "due">("pending");

  const load = async () => {
    const [ordersRes, paymentsRes] = await Promise.all([
      fetch("/api/orders").then(r => r.json()),
      fetch("/api/payments").then(r => r.json()),
    ]);

    const withDue = Array.isArray(ordersRes) ? ordersRes.filter((o: any) => Number(o.dueAmount) > 0) : [];
    setOrders(withDue);

    const pending = Array.isArray(paymentsRes) ? paymentsRes.filter((p: any) => p.status === "PENDING") : [];
    setPendingPayments(pending);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleConfirm = async (payment: any) => {
    setSaving(true);
    await fetch(`/api/payments/${payment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED" }),
    });

    const order = await fetch(`/api/orders/${payment.orderId}`).then(r => r.json());
    if (order) {
      const newPaid = Number(order.paidAmount) + Number(payment.amount);
      const newDue = Math.max(0, Number(order.totalAmount) - newPaid);
      await fetch(`/api/orders/${payment.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paidAmount: newPaid, dueAmount: newDue }),
      });
    }
    setSaving(false);
    load();
  };

  const handleReject = async (payment: any) => {
    setSaving(true);
    await fetch(`/api/payments/${payment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "FAILED" }),
    });
    setSaving(false);
    load();
  };

  const handleManualPayment = async () => {
    if (!selectedOrder || !amount) return;
    setSaving(true);
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: selectedOrder.id,
        customerId: selectedOrder.customerId,
        amount: parseFloat(amount),
        method,
        status: "COMPLETED",
        receivedBy: "admin",
        receivedAt: new Date().toISOString(),
      }),
    });
    setSelectedOrder(null);
    setAmount("");
    setSaving(false);
    load();
  };

  const filtered = orders.filter(o =>
    !search ||
    o.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.user?.phone?.includes(search) ||
    o.orderNumber?.includes(search)
  );

  const totalDue = orders.reduce((sum, o) => sum + Number(o.dueAmount || 0), 0);

  return (
    <AdminLayout title="Payments & Due" active="/admin/payments">
      <div style={{ fontFamily: "sans-serif" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "#FFF5F5", borderRadius: 12, padding: 16, border: "0.5px solid #FEB2B2" }}>
            <div style={{ fontSize: 11, color: "#718096", marginBottom: 4 }}>মোট Due</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#C53030" }}>৳{totalDue.toFixed(0)}</div>
          </div>
          <div style={{ background: "#FFFBEB", borderRadius: 12, padding: 16, border: "0.5px solid #FCD34D" }}>
            <div style={{ fontSize: 11, color: "#718096", marginBottom: 4 }}>Pending Payment</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#D97706" }}>{pendingPayments.length}টি</div>
          </div>
          <div style={{ background: "#F0FFF4", borderRadius: 12, padding: 16, border: "0.5px solid #9AE6B4" }}>
            <div style={{ fontSize: 11, color: "#718096", marginBottom: 4 }}>Due আছে</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#276749" }}>{orders.length} জন</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setTab("pending")}
            style={{ padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: tab === "pending" ? "#0D9488" : "#f7f8fa", color: tab === "pending" ? "#fff" : "#4a5568" }}>
            🕐 Pending ({pendingPayments.length})
          </button>
          <button onClick={() => setTab("due")}
            style={{ padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: tab === "due" ? "#0D9488" : "#f7f8fa", color: tab === "due" ? "#fff" : "#4a5568" }}>
            💰 Due List ({orders.length})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
        ) : tab === "pending" ? (
          /* Pending Payments Tab */
          pendingPayments.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ color: "#276749", fontWeight: 700, fontSize: 16 }}>কোনো pending payment নেই!</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pendingPayments.map((p, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #FCD34D" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>
                        {p.customer?.fullName || "Unknown"}
                      </div>
                      <div style={{ fontSize: 12, color: "#a0aec0", marginTop: 2 }}>
                        {new Date(p.createdAt).toLocaleString("bn-BD")}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#0D9488" }}>৳{Number(p.amount).toFixed(0)}</div>
                      <div style={{ fontSize: 12, color: "#718096" }}>{p.method}</div>
                    </div>
                  </div>

                  <div style={{ background: "#f7f8fa", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "#718096", marginBottom: 4 }}>Transaction ID</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a202c" }}>{p.transactionId || "-"}</div>
                    {p.notes && (
                      <>
                        <div style={{ fontSize: 12, color: "#718096", marginTop: 8, marginBottom: 4 }}>Sender Number</div>
                        <div style={{ fontSize: 14, color: "#1a202c" }}>{p.notes.replace("Sender: ", "")}</div>
                      </>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleConfirm(p)} disabled={saving}
                      style={{ flex: 1, background: "#0D9488", color: "#fff", border: "none", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      ✓ Confirm
                    </button>
                    <button onClick={() => handleReject(p)} disabled={saving}
                      style={{ flex: 1, background: "#FFF5F5", color: "#C53030", border: "1px solid #FEB2B2", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Due List Tab */
          <>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Customer নাম, phone বা order number..."
              style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 14, boxSizing: "border-box", background: "#fff" }} />

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <div style={{ color: "#276749", fontWeight: 700, fontSize: 16 }}>কোনো due নেই!</div>
              </div>
            ) : (
              <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 120px", padding: "10px 16px", background: "#f7f8fa", borderBottom: "0.5px solid #e2e8f0" }}>
                  {["Customer", "Order", "মোট", "Due", ""].map((h, i) => (
                    <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "#718096" }}>{h}</div>
                  ))}
                </div>
                {filtered.map((o, i) => (
                  <div key={i}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 120px", padding: "14px 16px", borderBottom: "0.5px solid #f7fafc", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#1a202c" }}>{o.customer?.fullName || "Unknown"}</div>
                        <div style={{ fontSize: 11, color: "#a0aec0" }}>{o.customer?.user?.phone || o.customer?.user?.email}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#4a5568" }}>#{o.orderNumber?.slice(-6)}</div>
                        <div style={{ fontSize: 11, color: "#a0aec0" }}>{new Date(o.createdAt).toLocaleDateString("bn-BD")}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a202c" }}>৳{Number(o.totalAmount).toFixed(0)}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#C53030" }}>৳{Number(o.dueAmount).toFixed(0)}</div>
                      <button onClick={() => { setSelectedOrder(o); setAmount(Number(o.dueAmount).toFixed(0)); }}
                        style={{ background: "#0D9488", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        💳 Payment নিন
                      </button>
                    </div>
                    {selectedOrder?.id === o.id && (
                      <div style={{ padding: "14px 16px", background: "#f0fdf9", borderBottom: "0.5px solid #b2f5ea" }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#0D9488", marginBottom: 12 }}>
                          Payment নিন — {o.customer?.fullName}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 10 }}>
                          {["CASH", "BKASH", "NAGAD", "ROCKET"].map(m => (
                            <button key={m} onClick={() => setMethod(m)}
                              style={{ padding: "9px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: method === m ? "2px solid #0D9488" : "0.5px solid #e2e8f0", background: method === m ? "#E6FFFA" : "#fff", color: method === m ? "#0D9488" : "#4a5568", cursor: "pointer" }}>
                              {m}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                            placeholder="পরিমাণ"
                            style={{ flex: 1, border: "0.5px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
                          <button onClick={handleManualPayment} disabled={saving}
                            style={{ background: "#0D9488", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                            {saving ? "Save হচ্ছে..." : "✓ নিশ্চিত করুন"}
                          </button>
                          <button onClick={() => setSelectedOrder(null)}
                            style={{ border: "0.5px solid #e2e8f0", background: "#fff", color: "#718096", padding: "10px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                            বাতিল
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
