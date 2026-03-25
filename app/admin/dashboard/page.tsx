"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingPrescriptions: 0,
    todayOrders: 0,
    lowStockItems: 0,
    totalDue: 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">💊</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">Pharmaco Connect</span>
            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
        <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}
          className="text-sm text-red-500 hover:text-red-700">Logout</button>
      </div>
      <div className="flex">
        <div className="w-56 bg-white border-r min-h-screen p-4">
          {[
            { href: "/admin/dashboard", icon: "🏠", label: "Dashboard" },
            { href: "/admin/prescriptions", icon: "📋", label: "Prescriptions" },
            { href: "/admin/inventory", icon: "📦", label: "Inventory" },
            { href: "/admin/orders", icon: "🛒", label: "Orders" },
            { href: "/admin/payments", icon: "💳", label: "Payments" },
            { href: "/admin/customers", icon: "👥", label: "Customers" },
            { href: "/admin/reminders", icon: "🔔", label: "Reminders" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition mb-1 text-gray-600 hover:text-gray-900">
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: "📋", label: "Pending Prescription", value: "0", color: "bg-amber-50 text-amber-600" },
              { icon: "📦", label: "আজকের Orders", value: "0", color: "bg-blue-50 text-blue-600" },
              { icon: "⚠️", label: "Low Stock", value: "0", color: "bg-red-50 text-red-500" },
              { icon: "💰", label: "মোট Due", value: "৳০", color: "bg-red-50 text-red-500" },
              { icon: "💵", label: "আজকের Revenue", value: "৳০", color: "bg-green-50 text-green-600" },
              { icon: "🚚", label: "Pending Delivery", value: "0", color: "bg-purple-50 text-purple-600" },
            ].map((s, i) => (
              <div key={i} className={`rounded-2xl p-5 ${s.color.split(" ")[0]}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{s.icon}</span>
                  <span className={`text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</span>
                </div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/prescriptions" className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-300 transition">
              <div className="text-3xl mb-3">📋</div>
              <div className="font-bold text-gray-900">Prescriptions Review</div>
              <div className="text-sm text-gray-500 mt-1">Customer দের prescription দেখুন ও approve করুন</div>
            </Link>
            <Link href="/admin/inventory" className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-300 transition">
              <div className="text-3xl mb-3">📦</div>
              <div className="font-bold text-gray-900">Inventory</div>
              <div className="text-sm text-gray-500 mt-1">Medicine stock manage করুন</div>
            </Link>
            <Link href="/admin/orders" className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-300 transition">
              <div className="text-3xl mb-3">🛒</div>
              <div className="font-bold text-gray-900">Orders</div>
              <div className="text-sm text-gray-500 mt-1">Order status change করুন</div>
            </Link>
            <Link href="/admin/payments" className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-300 transition">
              <div className="text-3xl mb-3">💳</div>
              <div className="font-bold text-gray-900">Payments & Due</div>
              <div className="text-sm text-gray-500 mt-1">Payment receive ও due track করুন</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}