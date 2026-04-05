"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const METHODS = [
  {
    id: "BKASH",
    label: "bKash",
    icon: "📱",
    color: "#E2136E",
    bg: "#FFF0F7",
    border: "#F9A8D4",
    number: "01XXXXXXXXX",
    instruction: "Send Money করুন এই নম্বরে",
  },
  {
    id: "NAGAD",
    label: "Nagad",
    icon: "📲",
    color: "#F7941D",
    bg: "#FFF7ED",
    border: "#FED7AA",
    number: "01XXXXXXXXX",
    instruction: "Send Money করুন এই নম্বরে",
  },
  {
    id: "ROCKET",
    label: "Rocket",
    icon: "🚀",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    number: "01XXXXXXXXX",
    instruction: "Send Money করুন এই নম্বরে",
  },
  {
    id: "CASH",
    label: "Cash",
    icon: "💵",
    color: "#0D9488",
    bg: "#F0FDFA",
    border: "#99F6E4",
    number: null,
    instruction: "সরাসরি pharmacy তে এসে পরিশোধ করুন",
  },
];

export default function PaymentPage() {
  const [selected, setSelected] = useState("BKASH");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [totalDue, setTotalDue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customer/payment")
      .then(r => r.json())
      .then(data => {
        setOrders(data.orders || []);
        setTotalDue(data.totalDue || 0);
        if (data.orders?.length > 0) {
          setSelectedOrder(data.orders[0]);
          setAmount(Number(data.orders[0].dueAmount).toFixed(0));
        }
        setLoading(false);
      });
  }, []);

  const selectedMethod = METHODS.find(m => m.id === selected)!;

  const handleSubmit = async () => {
    if (!selectedOrder) { setError("Order সিলেক্ট করুন"); return; }
    if (!amount || parseFloat(amount) <= 0) { setError("Amount দিন"); return; }
    if (selected !== "CASH" && !transactionId) { setError("Transaction ID দিন"); return; }

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/customer/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: selectedOrder.id,
        amount: parseFloat(amount),
        method: selected,
        transactionId: transactionId || "CASH",
        senderNumber,
      }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || "কিছু একটা ভুল হয়েছে");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ color: "#a0aec0" }}>Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 16 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, textAlign: "center", maxWidth: 400, width: "100%" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0D9488", marginBottom: 8 }}>Payment জমা হয়েছে!</h2>
          <p style={{ color: "#718096", fontSize: 14, marginBottom: 24 }}>
            আপনার payment request admin এর কাছে পাঠানো হয়েছে। Confirm হলে আপনাকে জানানো হবে।
          </p>
          <Link href="/customer/dashboard"
            style={{ display: "block", background: "#0D9488", color: "#fff", padding: "14px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
            Dashboard এ যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7fafc", fontFamily: "sans-serif", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/customer/profile/billing" style={{ color: "#718096", textDecoration: "none", fontSize: 20 }}>←</Link>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1a202c" }}>বাকি টাকা পরিশোধ</span>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px" }}>

        {/* Due Amount */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center", border: "1px solid #FEB2B2" }}>
          <div style={{ fontSize: 13, color: "#718096", marginBottom: 4 }}>মোট বাকি</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#C53030" }}>৳{totalDue.toFixed(0)}</div>
          <div style={{ fontSize: 12, color: "#a0aec0", marginTop: 4 }}>{orders.length}টি order এ due আছে</div>
        </div>

        {/* Order Select */}
        {orders.length > 1 && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 10 }}>কোন Order এর জন্য?</div>
            {orders.map(o => (
              <button key={o.id} onClick={() => { setSelectedOrder(o); setAmount(Number(o.dueAmount).toFixed(0)); }}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, border: selectedOrder?.id === o.id ? "2px solid #0D9488" : "1px solid #e2e8f0", background: selectedOrder?.id === o.id ? "#f0fdfa" : "#fff", marginBottom: 8, cursor: "pointer" }}>
                <span style={{ fontSize: 13, color: "#1a202c" }}>Order #{o.orderNumber?.slice(-6)}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#C53030" }}>৳{Number(o.dueAmount).toFixed(0)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Payment Method */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 12 }}>Payment Method</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {METHODS.map(m => (
              <button key={m.id} onClick={() => setSelected(m.id)}
                style={{ padding: "12px", borderRadius: 12, border: selected === m.id ? `2px solid ${m.color}` : "1px solid #e2e8f0", background: selected === m.id ? m.bg : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>{m.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: selected === m.id ? m.color : "#4a5568" }}>{m.label}</span>
                {selected === m.id && <span style={{ marginLeft: "auto", color: m.color, fontWeight: 700 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {selectedMethod.number && (
          <div style={{ background: selectedMethod.bg, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${selectedMethod.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: selectedMethod.color, marginBottom: 8 }}>
              {selectedMethod.label} এ পাঠান
            </div>
            <div style={{ fontSize: 13, color: "#4a5568", marginBottom: 8 }}>{selectedMethod.instruction}</div>
            <div style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", letterSpacing: 1 }}>{selectedMethod.number}</span>
              <button onClick={() => navigator.clipboard.writeText(selectedMethod.number!)}
                style={{ border: "none", background: selectedMethod.bg, color: selectedMethod.color, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Copy
              </button>
            </div>
          </div>
        )}

        {selected === "CASH" && (
          <div style={{ background: "#F0FDFA", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #99F6E4" }}>
            <div style={{ fontSize: 13, color: "#0D9488", fontWeight: 600 }}>🏪 {selectedMethod.instruction}</div>
          </div>
        )}

        {/* Amount */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 8 }}>পরিমাণ (৳)</div>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0"
            style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 18, fontWeight: 700, boxSizing: "border-box", outline: "none" }} />
          <p style={{ fontSize: 12, color: "#a0aec0", marginTop: 6 }}>পুরো amount বা আংশিক পরিশোধ করতে পারবেন</p>
        </div>

        {/* Transaction ID */}
        {selected !== "CASH" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 8 }}>Transaction ID</div>
            <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)}
              placeholder="যেমন: 8N7A3K2Q1P"
              style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 8, marginTop: 12 }}>আপনার {selectedMethod.label} নম্বর</div>
            <input type="text" value={senderNumber} onChange={e => setSenderNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        )}

        {error && (
          <div style={{ background: "#FFF5F5", border: "1px solid #FEB2B2", color: "#C53030", fontSize: 13, padding: "12px 16px", borderRadius: 10, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting || orders.length === 0}
          style={{ width: "100%", background: submitting ? "#a0aec0" : "#0D9488", color: "#fff", border: "none", padding: "16px", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}>
          {submitting ? "Submit হচ্ছে..." : `৳${amount || "0"} পরিশোধ করুন →`}
        </button>
      </div>
    </div>
  );
}
