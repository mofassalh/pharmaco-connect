"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  area?: string;
  city?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (data.id) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">আমার Profile</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-3xl">👤</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user?.name || "নাম নেই"}</h2>
              <p className="text-gray-500 text-sm">{user?.phone || user?.email}</p>
              {user?.address && (
                <p className="text-gray-400 text-sm mt-1">📍 {user.address}{user.area ? `, ${user.area}` : ""}{user.city ? `, ${user.city}` : ""}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-teal-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-teal-600">0</div>
              <div className="text-xs text-gray-500 mt-1">মোট Orders</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-blue-600">৳0</div>
              <div className="text-xs text-gray-500 mt-1">মোট খরচ</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-amber-600">0</div>
              <div className="text-xs text-gray-500 mt-1">Loyalty Points</div>
            </div>
          </div>
          <Link href="/customer/profile/edit" className="block w-full bg-teal-500 text-white py-3 rounded-xl font-medium text-center hover:bg-teal-600 transition">
            ✏️ Profile Edit করুন
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {[
            { href: "/customer/prescription", icon: "📋", label: "আমার Prescriptions", sub: "সব prescription দেখুন" },
            { href: "/customer/profile/family", icon: "👨‍👩‍👧‍👦", label: "পরিবারের সদস্য", sub: "সদস্য যোগ করুন" },
            { href: "/customer/profile/billing", icon: "💳", label: "Billing ও বাকি টাকা", sub: "Payment history" },
            { href: "/customer/profile/refills", icon: "🔔", label: "Monthly Refill", sub: "নিয়মিত Medicine" },
            { href: "/customer/profile/settings", icon: "⚙️", label: "Settings", sub: "ভাষা, নোটিফিকেশন" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition last:border-0">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-400">{item.sub}</div>
              </div>
              <span className="text-gray-300">→</span>
            </Link>
          ))}
        </div>

        <button
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="w-full text-red-500 py-3 rounded-xl border border-red-100 font-medium hover:bg-red-50 transition">
          Logout
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 z-10">
        <Link href="/customer/dashboard" className="flex flex-col items-center text-gray-400 text-xs gap-1"><span className="text-xl">🏠</span>Home</Link>
        <Link href="/customer/prescription/upload" className="flex flex-col items-center text-gray-400 text-xs gap-1"><span className="text-xl">📋</span>Prescription</Link>
        <Link href="/customer/orders" className="flex flex-col items-center text-gray-400 text-xs gap-1"><span className="text-xl">📦</span>Orders</Link>
        <Link href="/customer/profile" className="flex flex-col items-center text-teal-500 text-xs gap-1"><span className="text-xl">👤</span>Profile</Link>
      </div>
    </div>
  );
}