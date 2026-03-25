"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/customers")
      .then(r => r.json())
      .then(data => { setCustomers(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const filtered = customers.filter(c =>
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Customers</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-6">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="নাম বা email search করুন..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-teal-400" />
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">👥</div>
            <div>কোনো customer নেই</div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {filtered.map((c, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                  {c.fullName?.[0] || "?"}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{c.fullName}</div>
                  <div className="text-xs text-gray-400">{c.user?.email} · {c.user?.phone || "Phone নেই"}</div>
                </div>
                <div className="text-xs text-gray-400">{c.city || "ঠিকানা নেই"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}