"use client";
import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "../layout-component";

export default function QuickSalePage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selling, setSelling] = useState(false);
  const [success, setSuccess] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/inventory")
      .then(r => r.json())
      .then(data => {
        setInventory(Array.isArray(data) ? data : []);
        setLoading(false);
      });
    searchRef.current?.focus();
  }, []);

  const filtered = search.length > 0
    ? inventory.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.genericName?.toLowerCase().includes(search.toLowerCase()) ||
        i.brand?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : [];

  const popular = inventory
    .filter(i => i.currentStock > 0)
    .slice(0, 12);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setSearch("");
    searchRef.current?.focus();
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(c => c.id !== id));
    } else {
      setCart(prev => prev.map(c => c.id === id ? { ...c, qty } : c));
    }
  };

  const total = cart.reduce((sum, c) => sum + Number(c.sellingPrice) * c.qty, 0);

  const handleSell = async () => {
    if (cart.length === 0) return;
    setSelling(true);

    for (const item of cart) {
      const newStock = Math.max(0, item.currentStock - item.qty);
      await fetch(`/api/inventory/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStock: newStock,
          needsReorder: newStock <= item.reorderPoint,
        }),
      });

      await fetch("/api/stock-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventoryItemId: item.id,
          type: "OUT",
          quantity: item.qty,
          previousStock: item.currentStock,
          newStock,
          reason: "Walk-in sale",
          performedBy: "admin",
        }),
      });
    }

    setCart([]);
    setSuccess(true);
    setSelling(false);

    // Reload inventory
    fetch("/api/inventory")
      .then(r => r.json())
      .then(data => setInventory(Array.isArray(data) ? data : []));

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <AdminLayout title="⚡ Quick Sale" active="/admin/quick-sale">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, fontFamily: "sans-serif" }}>

        {/* Left: Search + Medicine List */}
        <div>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Medicine নাম লিখুন..."
              style={{ width: "100%", border: "2px solid #0D9488", borderRadius: 12, padding: "14px 18px", fontSize: 16, boxSizing: "border-box", outline: "none", background: "#fff" }}
            />
            {search && filtered.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, zIndex: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", marginTop: 4 }}>
                {filtered.map(item => (
                  <div key={item.id} onClick={() => addToCart(item)}
                    style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f7fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    onMouseOver={e => (e.currentTarget.style.background = "#f0fdfa")}
                    onMouseOut={e => (e.currentTarget.style.background = "#fff")}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#1a202c" }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#a0aec0" }}>{item.genericName} • Stock: {item.currentStock} {item.unit}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: "#0D9488", fontSize: 14 }}>৳{Number(item.sellingPrice).toFixed(0)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular Medicines */}
          <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#718096" }}>⭐ Popular / সব Medicine</div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {popular.map(item => (
                <button key={item.id} onClick={() => addToCart(item)}
                  style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                  onMouseOver={e => { e.currentTarget.style.border = "1px solid #0D9488"; e.currentTarget.style.background = "#f0fdfa"; }}
                  onMouseOut={e => { e.currentTarget.style.border = "1px solid #e2e8f0"; e.currentTarget.style.background = "#fff"; }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a202c", marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0", marginBottom: 6 }}>Stock: {item.currentStock} {item.unit}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0D9488" }}>৳{Number(item.sellingPrice).toFixed(0)}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Cart */}
        <div style={{ position: "sticky", top: 76 }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ background: "#0D9488", padding: "14px 16px" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>🛒 Cart ({cart.length} item)</div>
            </div>

            {cart.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#a0aec0" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
                <div style={{ fontSize: 13 }}>Medicine যোগ করুন</div>
              </div>
            ) : (
              <div>
                <div style={{ maxHeight: 380, overflowY: "auto" }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ padding: "12px 16px", borderBottom: "1px solid #f7fafc" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a202c", flex: 1 }}>{item.name}</div>
                        <button onClick={() => updateQty(item.id, 0)}
                          style={{ border: "none", background: "none", color: "#FC8181", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => updateQty(item.id, item.qty - 1)}
                            style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f7f8fa", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>−</button>
                          <input type="number" value={item.qty} onChange={e => updateQty(item.id, parseInt(e.target.value) || 0)}
                            style={{ width: 48, textAlign: "center", border: "1px solid #e2e8f0", borderRadius: 8, padding: "4px", fontSize: 14, fontWeight: 600 }} />
                          <button onClick={() => updateQty(item.id, item.qty + 1)}
                            style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f7f8fa", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>
                        </div>
                        <div style={{ fontWeight: 700, color: "#0D9488", fontSize: 14 }}>
                          ৳{(Number(item.sellingPrice) * item.qty).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "14px 16px", borderTop: "2px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: "#1a202c" }}>মোট</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "#0D9488" }}>৳{total.toFixed(0)}</span>
                  </div>

                  {success && (
                    <div style={{ background: "#F0FFF4", border: "1px solid #9AE6B4", color: "#276749", padding: "10px", borderRadius: 10, marginBottom: 10, textAlign: "center", fontSize: 13, fontWeight: 600 }}>
                      ✅ Sale সফল হয়েছে!
                    </div>
                  )}

                  <button onClick={handleSell} disabled={selling}
                    style={{ width: "100%", background: selling ? "#a0aec0" : "#0D9488", color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: selling ? "not-allowed" : "pointer" }}>
                    {selling ? "Processing..." : `✓ Sell — ৳${total.toFixed(0)}`}
                  </button>

                  <button onClick={() => setCart([])}
                    style={{ width: "100%", background: "none", border: "1px solid #e2e8f0", color: "#718096", padding: "10px", borderRadius: 12, fontSize: 13, cursor: "pointer", marginTop: 8 }}>
                    🗑 Cart খালি করুন
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
