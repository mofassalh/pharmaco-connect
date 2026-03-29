"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/inventory")
      .then(r => r.json())
      .then(data => {
        setItems(Array.isArray(data) ? data.filter((i: any) => i.isAvailable) : []);
        setLoading(false);
      });
    const savedCart = localStorage.getItem("pharmaco-cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("pharmaco-cart", JSON.stringify(cart));
  }, [cart]);

  const categories = ["ALL", "GENERAL", "ANTIBIOTIC", "CARDIAC", "DIABETES", "RESPIRATORY", "PAIN_RELIEF", "VITAMIN"];

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.genericName || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "ALL" || item.category === category;
    return matchSearch && matchCat;
  });

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find((c: any) => c.id === item.id);
      if (existing) return prev.map((c: any) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const decreaseCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find((c: any) => c.id === item.id);
      if (existing && existing.qty === 1) return prev.filter((c: any) => c.id !== item.id);
      return prev.map((c: any) => c.id === item.id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const totalAmount = cart.reduce((sum: number, c: any) => sum + (Number(c.sellingPrice) * c.qty), 0);
  const totalItems = cart.reduce((sum: number, c: any) => sum + c.qty, 0);

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: cart.length > 0 ? 80 : 24 }}>

      {/* Sub Header */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 48, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 56, zIndex: 10 }}>
        <span style={{ fontWeight: 700, color: "#1a202c", flex: 1, fontSize: 15 }}>💊 Medicine কিনুন</span>
        {cart.length > 0 && (
          <div style={{ background: "#0D9488", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            🛒 {totalItems} টি
          </div>
        )}
      </div>

      <div style={{ padding: 16 }}>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Medicine search করুন..."
          style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 12, padding: "11px 16px", fontSize: 14, marginBottom: 12, boxSizing: "border-box", background: "#fff" }}
        />

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4, scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
              border: "none", cursor: "pointer",
              background: category === cat ? "#0D9488" : "#fff",
              color: category === cat ? "#fff" : "#4a5568",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>
              {cat === "ALL" ? "সব" : cat}
            </button>
          ))}
        </div>

        {/* Items */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#a0aec0" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💊</div>
            <div style={{ color: "#a0aec0", fontSize: 14 }}>কোনো medicine পাওয়া যায়নি</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))"
, gap: 12 }}>
            {filtered.map((item: any, i: number) => {
              const inCart = cart.find((c: any) => c.id === item.id);
              return (
                <div key={i} style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💊</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1a202c", marginBottom: 2, lineHeight: 1.3 }}>{item.name}</div>
                  {item.genericName && <div style={{ fontSize: 11, color: "#a0aec0", marginBottom: 4 }}>{item.genericName}</div>}
                  <div style={{ fontSize: 11, color: "#718096", marginBottom: 8 }}>{item.unit}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, color: "#0D9488", fontSize: 16 }}>৳{Number(item.sellingPrice).toFixed(0)}</span>
                    <span style={{ fontSize: 10, color: item.currentStock <= item.reorderPoint ? "#C53030" : "#276749", fontWeight: 600 }}>
                      {item.currentStock <= item.reorderPoint ? "কম stock" : "✓ আছে"}
                    </span>
                  </div>
                  {inCart ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0fdf9", borderRadius: 8, padding: "4px 8px" }}>
                      <button
                        onClick={() => decreaseCart(item)}
                        style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid #0D9488", background: "#fff", cursor: "pointer", fontSize: 18, color: "#0D9488", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        −
                      </button>
                      <span style={{ fontWeight: 700, color: "#0D9488", fontSize: 15 }}>{inCart.qty}</span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{ width: 30, height: 30, borderRadius: "50%", background: "#0D9488", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      style={{ width: "100%", background: "#0D9488", color: "#fff", border: "none", padding: "9px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      + Cart এ যোগ করুন
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
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0D9488", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50, boxShadow: "0 -2px 10px rgba(0,0,0,0.1)" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{totalItems} টি Medicine</div>
            <div style={{ color: "#9FE1CB", fontSize: 13 }}>মোট: ৳{totalAmount.toFixed(0)}</div>
          </div>
          <button
            onClick={() => router.push("/customer/checkout")}
            style={{ background: "#fff", color: "#0D9488", padding: "11px 22px", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
            Order করুন →
          </button>
        </div>
      )}
    </div>
  );
}