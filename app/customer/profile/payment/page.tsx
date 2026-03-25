"use client";
import { useState } from "react";
import Link from "next/link";
const methods = [
  { id: "bkash", label: "bKash", icon: "📱", color: "border-pink-200 bg-pink-50" },
  { id: "nagad", label: "Nagad", icon: "📲", color: "border-orange-200 bg-orange-50" },
  { id: "rocket", label: "Rocket", icon: "🚀", color: "border-purple-200 bg-purple-50" },
  { id: "card", label: "Card", icon: "💳", color: "border-blue-200 bg-blue-50" },
];
export default function PaymentPage() {
  const [selected, setSelected] = useState("bkash");
  const [amount, setAmount] = useState("1280");
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/profile/billing" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">বাকি টাকা পরিশোধ</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <div className="text-sm text-gray-500 mb-2">মোট বাকি (পরিবার সহ)</div>
          <div className="text-4xl font-bold text-red-500 mb-1">৳ ১,২৮০</div>
          <div className="text-xs text-gray-400">Mofassal ৳৪৫০ + বাবা ৳৮৩০</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {methods.map(m => (
              <button key={m.id} onClick={() => setSelected(m.id)}
                className={`border-2 rounded-xl p-4 flex items-center gap-3 transition ${selected === m.id ? "border-teal-400 bg-teal-50" : m.color}`}>
                <span className="text-2xl">{m.icon}</span>
                <span className="font-medium text-gray-900">{m.label}</span>
                {selected === m.id && <span className="ml-auto text-teal-500">✓</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-3">Amount</h3>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 font-bold">৳</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <p className="text-xs text-gray-400 mt-2">পুরো amount বা আংশিক পরিশোধ করতে পারবেন</p>
        </div>
        <button className="w-full bg-teal-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-600 transition">
          ৳ {amount} পরিশোধ করুন →
        </button>
      </div>
    </div>
  );
}