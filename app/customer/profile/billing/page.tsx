"use client";
import Link from "next/link";
const payments = [
  { date: "২০ মার্চ ২০২৬", amount: 650, method: "bKash", name: "Mofassal" },
  { date: "১৫ মার্চ ২০২৬", amount: 1200, method: "Cash", name: "Abdul Karim (বাবা)" },
  { date: "৫ মার্চ ২০২৬", amount: 450, method: "Nagad", name: "Mofassal" },
];
const familyDue = [
  { name: "আপনি (Mofassal)", due: 450 },
  { name: "স্ত্রী (Rahela)", due: 0 },
  { name: "বাবা (Abdul Karim)", due: 830 },
  { name: "ছেলে (Rafi)", due: 0 },
];
export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/profile" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Billing ও বাকি টাকা</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500 mb-1">মোট বাকি</div>
            <div className="text-4xl font-bold text-red-500">৳ ১,২৮০</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-gray-900">৳ ৫,৬৫০</div>
              <div className="text-xs text-gray-400 mt-1">মোট কেনা</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-green-600">৳ ৪,৩৭০</div>
              <div className="text-xs text-gray-400 mt-1">মোট পরিশোধ</div>
            </div>
          </div>
          <Link href="/customer/profile/payment" className="block w-full bg-green-500 text-white py-3 rounded-xl font-medium text-center hover:bg-green-600 transition">
            💳 সব বাকি এখনই পরিশোধ করুন
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">পরিবার অনুযায়ী বাকি</h3>
          <div className="space-y-3">
            {familyDue.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-700 text-sm">{f.name}</span>
                <span className={f.due > 0 ? "font-bold text-red-500" : "text-green-500 text-sm"}>
                  {f.due > 0 ? `৳ ${f.due}` : "✓ পরিশোধ"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">সাম্প্রতিক Payment</h3>
          <div className="space-y-3">
            {payments.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.date} · {p.method}</div>
                </div>
                <span className="font-bold text-green-600">৳ {p.amount}</span>
              </div>
            ))}
          </div>
          <button className="w-full text-teal-600 text-sm mt-3 hover:underline">সব Payment History দেখুন →</button>
        </div>
      </div>
    </div>
  );
}