"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setDeliveryAddress(data.address || "");
          setDeliveryArea(data.area || "");
        }
      });
    const savedCart = localStorage.getItem("pharmaco-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("pharmaco-cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQty = (id: string) => {
    setCart(prev => prev.map((c: any) => c.id === id ? { ...c, qty: c.qty + 1 } : c));
  };

  const decreaseQty = (id: string) => {
    setCart(prev => {
      const item = prev.find((c: any) => c.id === id);
      if (item && item.qty === 1) return prev.filter((c: any) => c.id !== id);
      return prev.map((c: any) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter((c: any) => c.id !== id));
  };

  const totalAmount = cart.reduce((sum: number, c: any) => sum + (Number(c.sellingPrice) * c.qty), 0);

  const handleOrder = async () => {
    if (!deliveryAddress) { alert("Delivery address দিন"); return; }
    if (cart.length === 0) { alert("Cart খালি!"); return; }

    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((c: any) => ({
          inventoryItemId: c.id,
          medicineName: c.name,
          quantity: c.qty,
          unitPrice: Number(c.sellingPrice),
          totalPrice: Number(c.sellingPrice) * c.qty,
        })),
        totalAmount,
        deliveryAddress,
        deliveryArea,
        deliveryNotes: notes,
        orderType: "REGULAR",
        paymentMethod,
      }),
    });

    if (res.ok) {
      localStorage.removeItem("pharmaco-cart");
      setSuccess(true);
      setTimeout(() => router.push("/customer/orders"), 2000);
    } else {
      const data = await res.json();
      alert(data.error || "কিছু একটা ভুল হয়েছে");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f8fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, textAlign: "center", maxWidth: 320, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 20, color: "#1a202c", marginBottom: 8 }}>Order হয়ে গেছে!</div>
          <div style={{ color: "#718096", fontSize: 14 }}>Orders page এ যাচ্ছি...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: 100 }}>

      {/* Sub Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 48, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 56, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#a0aec0" }}>←</button>
        <span style={{ fontWeight: 700, color: "#1a202c", fontSize: 15 }}>🛒 Checkout</span>
      </div>

      {/* Cart Items */}
      <div style={{ margin: 16, background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "0.5px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1a202c" }}>আপনার Cart</span>
          <span style={{ fontSize: 12, color: "#a0aec0" }}>{cart.length} টি item</span>
        </div>

        {cart.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#a0aec0" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
            <div>Cart খালি</div>
            <button onClick={() => router.push("/customer/shop")}
              style={{ marginTop: 16, background: "#0D9488", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
              Medicine কিনুন
            </button>
          </div>
        ) : (
          cart.map((item: any, i: number) => (
            <div key={i} style={{ padding: "14px 16px", borderBottom: "0.5px solid #f7f7f7", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28 }}>💊</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1a202c" }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#0D9488", fontWeight: 700 }}>৳{Number(item.sellingPrice).toFixed(0)} each</div>
              </div>
              {/* Qty Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => decreaseQty(item.id)}
                  style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 16, color: "#4a5568", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  −
                </button>
                <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => increaseQty(item.id)}
                  style={{ width: 28, height: 28, borderRadius: "50%", background: "#0D9488", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  +
                </button>
              </div>
              {/* Total & Remove */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: "#1a202c", fontSize: 14 }}>৳{(Number(item.sellingPrice) * item.qty).toFixed(0)}</div>
                <button onClick={() => removeItem(item.id)}
                  style={{ background: "none", border: "none", color: "#FC8181", cursor: "pointer", fontSize: 11, fontWeight: 600, marginTop: 4 }}>
                  ✕ Remove
                </button>
              </div>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", background: "#f7fafc" }}>
            <span style={{ fontWeight: 700, color: "#1a202c" }}>মোট</span>
            <span style={{ fontWeight: 700, color: "#0D9488", fontSize: 18 }}>৳{totalAmount.toFixed(0)}</span>
          </div>
        )}
      </div>

      {/* Delivery Info */}
      <div style={{ margin: 16, background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c", marginBottom: 14 }}>📍 Delivery তথ্য</div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>Address *</label>
          <input value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
            placeholder="বাড়ির নম্বর, রাস্তা, এলাকা"
            style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>এলাকা</label>
          <input value={deliveryArea} onChange={e => setDeliveryArea(e.target.value)}
            placeholder="যেমন: Mirpur, Dhanmondi"
            style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6 }}>বিশেষ নির্দেশনা</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="কোনো বিশেষ নির্দেশনা থাকলে লিখুন"
            rows={3}
            style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", fontSize: 14, boxSizing: "border-box", resize: "none" }} />
        </div>
      </div>

      {/* Payment Method */}
      <div style={{ margin: 16, background: "#fff", borderRadius: 14, border: "0.5px solid #e2e8f0", padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c", marginBottom: 14 }}>💳 Payment পদ্ধতি</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { value: "CASH", label: "💵 Cash on Delivery" },
            { value: "BKASH", label: "🟣 bKash" },
            { value: "NAGAD", label: "🟠 Nagad" },
            { value: "ROCKET", label: "🟣 Rocket" },
          ].map(method => (
            <button key={method.value} onClick={() => setPaymentMethod(method.value)}
              style={{
                padding: "12px 10px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: paymentMethod === method.value ? "2px solid #0D9488" : "0.5px solid #e2e8f0",
                background: paymentMethod === method.value ? "#E6FFFA" : "#fff",
                color: paymentMethod === method.value ? "#0D9488" : "#4a5568",
              }}>
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {/* Order Button */}
      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "0.5px solid #e2e8f0", padding: 16 }}>
          <button onClick={handleOrder} disabled={loading || cart.length === 0}
            style={{
              width: "100%", background: loading ? "#a0aec0" : "#0D9488", color: "#fff",
              border: "none", padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}>
            {loading ? "Order হচ্ছে..." : `৳${totalAmount.toFixed(0)} — Order Confirm করুন`}
          </button>
        </div>
      )}
    </div>
  );
}