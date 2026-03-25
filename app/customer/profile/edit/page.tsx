"use client";
import { useState } from "react";
import Link from "next/link";
export default function EditProfilePage() {
  const [form, setForm] = useState({
    fullName: "Mofassal Hossain",
    phone: "01712345678",
    address: "বাড়ি ৫, রোড ১২, ধানমন্ডি, ঢাকা",
    area: "ধানমন্ডি",
    city: "ঢাকা"
  });
  const h = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/profile" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Profile Edit করুন</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-3xl mb-3">👤</div>
            <button className="text-sm text-teal-600 font-medium">ছবি পরিবর্তন করুন</button>
          </div>
          {[
            { label: "পুরো নাম", name: "fullName", type: "text" },
            { label: "Phone নম্বর", name: "phone", type: "tel" },
            { label: "ঠিকানা", name: "address", type: "text" },
            { label: "এলাকা", name: "area", type: "text" },
            { label: "শহর", name: "city", type: "text" },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name as keyof typeof form]} onChange={h}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
          ))}
          <button className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition mt-2">
            Save করুন ✓
          </button>
        </div>
      </div>
    </div>
  );
}