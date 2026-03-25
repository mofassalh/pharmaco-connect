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
        ...form,
        currentStock: parseInt(form.currentStock),
        minStockLevel: parseInt(form.minStockLevel),
        reorderPoint: parseInt(form.reorderPoint),
        unitPrice: parseFloat(form.unitPrice || form.sellingPrice),
        sellingPrice: parseFloat(form.sellingPrice),
        isAvailable: parseInt(form.currentStock) > 0,
        needsReorder: parseInt(form.currentStock) <= parseInt(form.reorderPoint),
      }),
    });
    if (res.ok) router.push("/admin/inventory");
    else setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/inventory" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Medicine যোগ করুন</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">📷 Box এর ছবি তুলুন (AI Auto-fill)</h2>
          {!preview ? (
            <label className="border-2 border-dashed border-teal-300 rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-teal-500 transition">
              <span className="text-4xl mb-3">📦</span>
              <span className="text-gray-600 font-medium">Medicine box এর ছবি তুলুন</span>
              <span className="text-gray-400 text-xs mt-1">AI নাম, dose, expiry সব পড়বে</span>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScan} />
            </label>
          ) : (
            <div className="space-y-3">
              <img src={preview} alt="box" className="w-full rounded-xl border max-h-48 object-contain" />
              {scanning && (
                <div className="bg-teal-50 text-teal-700 px-4 py-3 rounded-xl text-sm text-center">
                  ⏳ AI পড়ছে...
                </div>
              )}
              {!scanning && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm text-center">
                  ✅ AI তথ্য fill করেছে — নিচে check করুন
                </div>
              )}
              <label className="block w-full text-center text-sm text-teal-600 cursor-pointer hover:underline">
                অন্য ছবি দিন
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScan} />
              </label>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 mb-2">Medicine তথ্য</h2>
          {[
            { label: "Medicine নাম *", name: "name", type: "text" },
            { label: "Generic নাম", name: "genericName", type: "text" },
            { label: "Brand", name: "brand", type: "text" },
            { label: "Manufacturer", name: "manufacturer", type: "text" },
            { label: "Batch Number", name: "batchNumber", type: "text" },
            { label: "Expiry Date", name: "expiryDate", type: "date" },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name as keyof typeof form]} onChange={h}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={form.category} onChange={h}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select name="unit" value={form.unit} onChange={h}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
              {["strip","bottle","vial","box","tube","sachet"].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 mb-2">Stock ও Price</h2>
          {[
            { label: "বর্তমান Stock *", name: "currentStock", type: "number" },
            { label: "Reorder Point (কতটায় alert)", name: "reorderPoint", type: "number" },
            { label: "Selling Price (৳) *", name: "sellingPrice", type: "number" },
            { label: "Unit Price / Cost (৳)", name: "unitPrice", type: "number" },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name as keyof typeof form]} onChange={h}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-teal-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-600 disabled:opacity-50 transition">
          {saving ? "Save হচ্ছে..." : "💊 Inventory তে যোগ করুন"}
        </button>
      </div>
    </div>
  );
}