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
      .then(data => { setItems(data); setLoading(false); });
  }, []);

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    if (tab === "available") return matchSearch && item.isAvailable && !item.needsReorder;
    if (tab === "reorder") return matchSearch && item.needsReorder;
    if (tab === "out") return matchSearch && !item.isAvailable;
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
          <span className="font-bold text-gray-900">Inventory</span>
        </div>
        <Link href="/admin/inventory/add" className="bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-600 transition">
          + Medicine যোগ করুন
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Medicine search করুন..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "সব", count: items.length },
            { key: "available", label: "Available", count: items.filter(i => i.isAvailable && !i.needsReorder).length },
            { key: "reorder", label: "Reorder দরকার", count: items.filter(i => i.needsReorder).length },
            { key: "out", label: "Stock নেই", count: items.filter(i => !i.isAvailable).length },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === t.key ? "bg-teal-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-teal-300"}`}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📦</div>
            <div className="text-gray-500">কোনো medicine নেই</div>
            <Link href="/admin/inventory/add" className="mt-4 inline-block bg-teal-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-teal-600 transition">
              + প্রথম Medicine যোগ করুন
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b bg-gray-50">
                  <th className="text-left px-4 py-3">Medicine</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.genericName}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${item.currentStock <= item.reorderPoint ? "text-red-500" : "text-gray-900"}`}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">৳{Number(item.sellingPrice).toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        !item.isAvailable ? "bg-red-50 text-red-600" :
                        item.needsReorder ? "bg-amber-50 text-amber-600" :
                        "bg-green-50 text-green-600"
                      }`}>
                        {!item.isAvailable ? "Stock নেই" : item.needsReorder ? "Reorder দরকার" : "Available"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/inventory/${item.id}`} className="text-xs text-teal-600 hover:underline">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}