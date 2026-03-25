"use client";
import { useState } from "react";
import Link from "next/link";
const patients = [
  { name: "Abdul Karim (বাবা)", condition: "ডায়াবেটিস, উচ্চ রক্তচাপ", lastRefill: "১ মার্চ ২০২৬", nextDue: "১ এপ্রিল ২০২৬", daysLeft: 7, meds: ["Metformin 500mg", "Amlodipine 5mg", "Losartan 50mg"] },
  { name: "Mofassal (আমি)", condition: "অ্যাজমা", lastRefill: "১৫ মার্চ ২০২৬", nextDue: "১৫ এপ্রিল ২০২৬", daysLeft: 21, meds: ["Salbutamol Inhaler", "Montelukast 10mg"] },
  { name: "Rahela (স্ত্রী)", condition: "থাইরয়েড", lastRefill: "১০ মার্চ ২০২৬", nextDue: "১০ এপ্রিল ২০২৬", daysLeft: 16, meds: ["Thyroxine 50mcg"] },
];
export default function RefillsPage() {
  const [reminder, setReminder] = useState(true);
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/profile" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Monthly Refill</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">৫ দিন আগে Reminder</div>
            <div className="text-xs text-gray-400 mt-0.5">Refill এর আগে phone call পাবেন</div>
          </div>
          <button onClick={() => setReminder(!reminder)}
            className={`w-12 h-6 rounded-full transition ${reminder ? "bg-teal-500" : "bg-gray-200"} relative`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${reminder ? "left-6" : "left-0.5"}`}></div>
          </button>
        </div>
        {patients.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold text-gray-900">{p.name}</div>
                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">{p.condition}</div>
              </div>
              <div className={`text-center px-3 py-1 rounded-xl ${p.daysLeft <= 7 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                <div className="text-lg font-bold">{p.daysLeft}</div>
                <div className="text-xs">দিন বাকি</div>
              </div>
            </div>
            <div className="space-y-1 mb-3">
              {p.meds.map((m, j) => <div key={j} className="text-sm text-gray-600">💊 {m}</div>)}
            </div>
            <div className="flex gap-2 text-xs text-gray-400 mb-3">
              <span>শেষ: {p.lastRefill}</span>
              <span>·</span>
              <span>পরের: {p.nextDue}</span>
            </div>
            <button className="w-full bg-teal-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-teal-600 transition">
              🔄 এখনই Refill করুন
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}