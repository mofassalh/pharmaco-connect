"use client";
import Link from "next/link";
const meds = [
  { name: "Napa 500mg", dosage: "500mg", frequency: "৩ বার দৈনিক", refillDay: 1, nextDue: "১ এপ্রিল ২০২৬", available: true },
  { name: "Amlodipine 5mg", dosage: "5mg", frequency: "১ বার রাতে", refillDay: 5, nextDue: "৫ এপ্রিল ২০২৬", available: true },
  { name: "Metformin 500mg", dosage: "500mg", frequency: "২ বার দৈনিক", refillDay: 10, nextDue: "১০ এপ্রিল ২০২৬", available: false },
];
export default function MedicinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">নিয়মিত Medicine</span>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
        {meds.map((med, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900">💊 {med.name}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${med.available ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                {med.available ? "Available" : "Stock নেই"}
              </span>
            </div>
            <div className="text-sm text-gray-500 mb-3">{med.dosage} · {med.frequency}</div>
            <div className="flex items-center gap-2 text-sm bg-teal-50 text-teal-700 px-3 py-2 rounded-lg">
              <span>🔔</span>
              <span>পরের refill: {med.nextDue}</span>
            </div>
          </div>
        ))}
        <button className="w-full border-2 border-dashed border-teal-300 text-teal-600 py-4 rounded-2xl font-medium hover:border-teal-500 transition">
          + নতুন নিয়মিত Medicine যোগ করুন
        </button>
      </div>
    </div>
  );
}