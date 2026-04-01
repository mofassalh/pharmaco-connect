"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Item {
  id: string;
  name: string;
  genericName?: string;
  brand?: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderPoint: number;
  unitPrice: number;
  sellingPrice: number;
  isAvailable: boolean;
  needsReorder: boolean;
  expiryDate?: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/inventory")
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.genericName || "").toLowerCase().includes(search.toLowerCase());
    if (tab === "available") return matchSearch && item.isAvailable && !item.needsReorder;
    if (tab === "reorder") return matchSearch && item.needsReorder;
    if (tab === "out") return matchSearch && !item.isAvailable;
    return matchSearch;
  });

  const totalValue = items.reduce((sum, i) => sum + (Number(i.sellingPrice) * i.currentStock), 0);

  return (
    <div style={{ fontFamily: "sans-serif" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", margin: 0 }}>💊 Inventory</h1>
        <Link href="/admin/inventory/add"
          style={{ background: "#0D9488", color: "#fff", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          + Medicine যোগ করুন
        </Link>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { val: items.length, label: "মোট Medicine", color: "#1a202c", bg: "#f7f8fa" },
          { val: items.filter(i => i.isAvailable && !i.needsReorder).length, label: "Available", color: "#276749", bg: "#F0FFF4" },
          { val: items.filter(i => i.needsReorder).length, label: "Reorder দরকার", color: "#B7791F", bg: "#FFFAF0" },
          { val: `৳${totalValue.toFixed(0)}`, label: "মোট মূল্য", color: "#2B6CB0", bg: "#EBF8FF" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 12, padding: 14, border: "0.5px solid #e8ecf0" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#718096" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Medicine search করুন..."
        style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 12, boxSizing: "border-box", background: "#fff" }} />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "সব", count: items.length },
          { key: "available", label: "Available", count: items.filter(i => i.isAvailable && !i.needsReorder).length },
          { key: "reorder", label: "Reorder দরকার", count: items.filter(i => i.needsReorder).length },
          { key: "out", label: "Stock নেই", count: items.filter(i => !i.isAvailable).length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", background: tab === t.key ? "#0D9488" : "#fff", color: tab === t.key ? "#fff" : "#4a5568", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <div style={{ color: "#a0aec0", marginBottom: 16 }}>কোনো medicine নেই</div>
          <Link href="/admin/inventory/add"
            style={{ background: "#0D9488", color: "#fff", padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            + প্রথম Medicine যোগ করুন
          </Link>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, overflow: "hidden" }}>
          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 80px", padding: "10px 16px", background: "#f7f8fa", borderBottom: "0.5px solid #e2e8f0" }}>
            {["Medicine", "Category", "Stock", "Selling Price", "Status", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "#718096" }}>{h}</div>
            ))}
          </div>

          {filtered.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 80px", padding: "12px 16px", borderBottom: i < filtered.length - 1 ? "0.5px solid #f7fafc" : "none", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#1a202c" }}>{item.name}</div>
                {item.genericName && <div style={{ fontSize: 11, color: "#a0aec0" }}>{item.genericName}</div>}
                {item.brand && <div style={{ fontSize: 11, color: "#a0aec0" }}>{item.brand}</div>}
              </div>
              <div style={{ fontSize: 12, color: "#718096" }}>{item.category}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: item.currentStock <= item.reorderPoint ? "#C53030" : "#1a202c" }}>
                {item.currentStock} <span style={{ fontSize: 10, color: "#a0aec0" }}>{item.unit}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0D9488" }}>৳{Number(item.sellingPrice).toFixed(0)}</div>
              <div>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600,
                  background: !item.isAvailable ? "#FFF5F5" : item.needsReorder ? "#FFFAF0" : "#F0FFF4",
                  color: !item.isAvailable ? "#C53030" : item.needsReorder ? "#B7791F" : "#276749" }}>
                  {!item.isAvailable ? "Stock নেই" : item.needsReorder ? "Reorder" : "✓ Available"}
                </span>
              </div>
              <Link href={`/admin/inventory/${item.id}`}
                style={{ fontSize: 12, background: "#EBF8FF", color: "#2B6CB0", padding: "5px 10px", borderRadius: 6, textDecoration: "none", fontWeight: 600, display: "inline-block" }}>
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}