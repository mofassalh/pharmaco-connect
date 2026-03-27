"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const categories = ["GENERAL","ANTIBIOTIC","CARDIAC","DIABETES","RESPIRATORY","PAIN_RELIEF","VITAMIN","ANTACID","NEUROLOGICAL","DERMATOLOGY","OPHTHALMIC","OTHER"];

export default function AddInventoryPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", genericName: "", brand: "", category: "GENERAL",
    unit: "strip", currentStock: "", minStockLevel: "10",
    reorderPoint: "20", unitPrice: "", sellingPrice: "",
    manufacturer: "", batchNumber: "", expiryDate: "",
  });

  const h = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setScanning(true);
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/inventory/scan", { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      setForm(prev => ({
        ...prev,
        name: data.data.name || prev.name,
        genericName: data.data.genericName || prev.genericName,
        brand: data.data.brand || prev.brand,
        category: data.data.category || prev.category,
        unit: data.data.unit || prev.unit,
        manufacturer: data.data.manufacturer || prev.manufacturer,
        sellingPrice: data.data.mrp?.toString() || prev.sellingPrice,
        unitPrice: data.data.mrp ? (data.data.mrp * 0.8).toFixed(0) : prev.unitPrice,
        batchNumber: data.data.batchNumber || prev.batchNumber,
        expiryDate: data.data.expiryDate || prev.expiryDate,
      }));
    }
    setScanning(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.sellingPrice || !form.currentStock) {
      alert("নাম, Price ও Stock দিন");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        genericName: form.genericName || null,
        brand: form.brand || null,
        category: form.category || "GENERAL",
        unit: form.unit || "strip",
        currentStock: parseInt(form.currentStock) || 0,
        minStockLevel: parseInt(form.minStockLevel) || 10,
        reorderPoint: parseInt(form.reorderPoint) || 20,
        maxStockLevel: 500,
        unitPrice: parseFloat(form.unitPrice || form.sellingPrice) || 0,
        sellingPrice: parseFloat(form.sellingPrice) || 0,
        manufacturer: form.manufacturer || null,
        batchNumber: form.batchNumber || null,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
        isAvailable: (parseInt(form.currentStock) || 0) > 0,
        needsReorder: (parseInt(form.currentStock) || 0) <= (parseInt(form.reorderPoint) || 20),
      }),
    });
    if (res.ok) {
      router.push("/admin/inventory");
    } else {
      const err = await res.json();
      alert(err.error || "কিছু একটা ভুল হয়েছে");
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#efefef", fontFamily: "sans-serif", paddingBottom: 40 }}>
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e2e8f0", padding: "0 16px", height: 52, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/admin/inventory" style={{ color: "#a0aec0", textDecoration: "none", fontSize: 18 }}>←</Link>
        <span style={{ fontWeight: 700, color: "#1a202c" }}>Medicine যোগ করুন</span>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* AI Scan */}
        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontWeight: 700, color: "#1a202c", fontSize: 14, marginBottom: 12 }}>📷 Box এর ছবি তুলুন (AI Auto-fill)</h2>
          {!preview ? (
            <label style={{ border: "2px dashed #5DCAA5", borderRadius: 10, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
              <span style={{ fontSize: 36, marginBottom: 8 }}>📦</span>
              <span style={{ color: "#4a5568", fontWeight: 500, fontSize: 14 }}>Medicine box এর ছবি তুলুন</span>
              <span style={{ color: "#a0aec0", fontSize: 12, marginTop: 4 }}>AI নাম, dose, expiry সব পড়বে</span>
              <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleScan} />
            </label>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <img src={preview} alt="box" style={{ width: "100%", borderRadius: 10, border: "0.5px solid #e2e8f0", maxHeight: 180, objectFit: "contain" }} />
              {scanning ? (
                <div style={{ background: "#E6FFFA", color: "#0D9488", padding: "10px", borderRadius: 9, fontSize: 13, textAlign: "center" }}>⏳ AI পড়ছে...</div>
              ) : (
                <div style={{ background: "#F0FFF4", color: "#276749", padding: "10px", borderRadius: 9, fontSize: 13, textAlign: "center" }}>✅ AI তথ্য fill করেছে</div>
              )}
              <label style={{ textAlign: "center", fontSize: 12, color: "#0D9488", cursor: "pointer" }}>
                অন্য ছবি দিন
                <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleScan} />
              </label>
            </div>
          )}
        </div>

        {/* Medicine Info */}
        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ fontWeight: 700, color: "#1a202c", fontSize: 14 }}>Medicine তথ্য</h2>
          {[
            { label: "Medicine নাম *", name: "name", type: "text" },
            { label: "Generic নাম", name: "genericName", type: "text" },
            { label: "Brand", name: "brand", type: "text" },
            { label: "Manufacturer", name: "manufacturer", type: "text" },
            { label: "Batch Number", name: "batchNumber", type: "text" },
            { label: "Expiry Date", name: "expiryDate", type: "date" },
          ].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#4a5568", display: "block", marginBottom: 4 }}>{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name as keyof typeof form]} onChange={h}
                style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 9, padding: "10px 12px", fontSize: 14, boxSizing: "border-box" }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#4a5568", display: "block", marginBottom: 4 }}>Category</label>
            <select name="category" value={form.category} onChange={h}
              style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 9, padding: "10px 12px", fontSize: 14, background: "#fff" }}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#4a5568", display: "block", marginBottom: 4 }}>Unit</label>
            <select name="unit" value={form.unit} onChange={h}
              style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 9, padding: "10px 12px", fontSize: 14, background: "#fff" }}>
              {["strip","bottle","vial","box","tube","sachet"].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Stock & Price */}
        <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 style={{ fontWeight: 700, color: "#1a202c", fontSize: 14 }}>Stock ও Price</h2>
          {[
            { label: "বর্তমান Stock *", name: "currentStock", type: "number" },
            { label: "Reorder Point (কতটায় alert)", name: "reorderPoint", type: "number" },
            { label: "Selling Price (৳) *", name: "sellingPrice", type: "number" },
            { label: "Unit Price / Cost (৳)", name: "unitPrice", type: "number" },
          ].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#4a5568", display: "block", marginBottom: 4 }}>{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name as keyof typeof form]} onChange={h}
                style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 9, padding: "10px 12px", fontSize: 14, boxSizing: "border-box" }} />
            </div>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{ background: "#0D9488", color: "#fff", border: "none", padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Save হচ্ছে..." : "💊 Inventory তে যোগ করুন"}
        </button>
      </div>
    </div>
  );
}