"use client";
import Link from "next/link";
const members = [
  { name: "Mofassal Hossain", relation: "আমি", age: 35, condition: "সুস্থ", due: 450, primary: true },
  { name: "Rahela Begum", relation: "স্ত্রী", age: 32, condition: "সুস্থ", due: 0, primary: false },
  { name: "Abdul Karim", relation: "বাবা", age: 65, condition: "ডায়াবেটিস, উচ্চ রক্তচাপ", due: 830, primary: false },
  { name: "Rafi Hossain", relation: "ছেলে", age: 8, condition: "সুস্থ", due: 0, primary: false },
];
export default function FamilyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/profile" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">পরিবারের সদস্য</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {members.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-xl">👤</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{m.name}</span>
                  {m.primary && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Me</span>}
                </div>
                <div className="text-sm text-gray-500">{m.relation} · {m.age} বছর</div>
              </div>
              {m.due > 0 && <div className="text-right"><div className="text-xs text-gray-400">বাকি</div><div className="font-bold text-red-500">৳{m.due}</div></div>}
            </div>
            {m.condition !== "সুস্থ" && (
              <div className="bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-lg mb-3">⚠️ {m.condition}</div>
            )}
            <div className="flex gap-2">
              <button className="flex-1 border border-teal-200 text-teal-600 py-2 rounded-xl text-sm font-medium hover:bg-teal-50 transition">এই Profile এ যান</button>
              <button className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Order History</button>
            </div>
          </div>
        ))}
        <button className="w-full border-2 border-dashed border-teal-300 text-teal-600 py-4 rounded-2xl font-medium hover:border-teal-500 transition">
          + নতুন সদস্য যোগ করুন
        </button>
      </div>
    </div>
  );
}