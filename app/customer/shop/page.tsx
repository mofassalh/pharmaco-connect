"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ShopPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/inventory")
      .then(r => r.json())
      .then(data => {
        setItems(Array.isArray(data) ? data.filter((i: any) => i.isAvailable) : []);
        setLoading(false);
      });
  }, []);

  const categories = ["ALL", "GENERAL", "ANTIBIOTIC", "CARDIAC", "DIABETES", "RESPIRATORY", "PAIN_RELIEF", "VITAMIN"];

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.genericName || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "ALL" || item.category === category;
    return matchSearch && matchCat;
  });

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const totalAmount = cart.reduce((sum, c) => sum + (Number(c.sellingPrice) * c.qty), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#efefef", fontFamily: "sans-serif", paddingBottom: cart.length > 0 ? 100 : 24 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 52, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/customer/profile" style={{ color: "#a0aec0", textDecoration: "none", fontSize: 18 }}>←</Link>
        <span style={{ fontWeight: 700, color: "#1a202c", flex: 1 }}>Medicine কিনুন</span>
        {cart.length > 0 && (
          <div style={{ background: "#0D9488", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            🛒 {cart.length} টি
          </div>
        )}
      </div>

      <div style={{ padding: 16 }}>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Medicine search করুন..."
          style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 12, boxSizing: "border-box", background: "#fff" }}
        />

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
              border: "0.5px solid #e2e8f0", cursor: "pointer",
              background: category === cat ? "#0D9488" : "#fff",
              color: category === cat ? "#fff" : "#4a5568",
            }}>
              {cat === "ALL" ? "সব" : cat}
            </button>
          ))}
        </div>

        {/* Items */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💊</div>
            <div style={{ color: "#a0aec0" }}>কোনো medicine পাওয়া যায়নি</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {filtered.map((item, i) => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>💊</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1a202c", marginBottom: 2 }}>{item.name}</div>
                  {item.genericName && <div style={{ fontSize: 11, color: "#a0aec0", marginBottom: 4 }}>{item.genericName}</div>}
                  <div style={{ fontSize: 11, color: "#718096", marginBottom: 8 }}>{item.unit} · {item.category}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, color: "#0D9488", fontSize: 15 }}>৳{Number(item.sellingPrice).toFixed(0)}</span>
                    <span style={{ fontSize: 10, color: item.currentStock <= item.reorderPoint ? "#C53030" : "#276749" }}>
                      {item.currentStock <= item.reorderPoint ? "কম stock" : "Available"}
                    </span>
                  </div>
                  {inCart ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => {
                        if (inCart.qty === 1) removeFromCart(item.id);
                        else setCart(prev => prev.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c));
                      }} style={{ width: 28, height: 28, borderRadius: "50%", border: "0.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 16 }}>−</button>
                      <span style={{ fontWeight: 600, flex: 1, textAlign: "center" }}>{inCart.qty}</span>
                      <button onClick={() => addToCart(item)} style={{ width: 28, height: 28, borderRadius: "50%", background: "#0D9488", border: "none", color: "#fff", cursor: "pointer", fontSize: 16 }}>+</button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(item)} style={{ width: "100%", background: "#0D9488", color: "#fff", border: "none", padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      Cart এ যোগ করুন
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Bar */}
      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0D9488", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50 }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{cart.length} টি Medicine</div>
            <div style={{ color: "#9FE1CB", fontSize: 12 }}>মোট: ৳{totalAmount.toFixed(0)}</div>
          </div>
          <Link href="/customer/checkout" style={{ background: "#fff", color: "#0D9488", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Order করুন →
          </Link>
        </div>
      )}
    </div>
  );
}