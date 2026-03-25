"use client";
import Link from "next/link";

const orders = [
  { id: "ORD-001", date: "২৪ মার্চ ২০২৬", status: "OUT_FOR_DELIVERY", items: ["Napa 500mg x15", "Amoxicillin x14"], total: 850, paid: 850, due: 0 },
  { id: "ORD-002", date: "১৫ মার্চ ২০২৬", status: "DELIVERED", items: ["Omeprazole x10"], total: 450, paid: 200, due: 250 },
  { id: "ORD-003", date: "৫ মার্চ ২০২৬", status: "DELIVERED", items: ["Napa 500mg x10", "Vitamin C x30"], total: 350, paid: 350, due: 0 },
];

const statusLabel: Record<string, string> = {
  PENDING: "অপেক্ষায়",
  CONFIRMED: "নিশ্চিত",
  PROCESSING: "প্রস্তুত হচ্ছে",
  OUT_FOR_DELIVERY: "রাস্তায় আছে",
  DELIVERED: "পৌঁছে গেছে",
  CANCELLED: "বাতিল",
};

const statusColor: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  CONFIRMED: "bg-blue-50 text-blue-600",
  PROCESSING: "bg-amber-50 text-amber-600",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-600",
  DELIVERED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">আমার Orders</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {orders.map((order, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-mono text-sm text-gray-500">{order.id}</span>
                <div className="text-xs text-gray-400 mt-0.5">{order.date}</div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
                {statusLabel[order.status]}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              {order.items.map((item, j) => (
                <div key={j} className="text-sm text-gray-700">💊 {item}</div>
              ))}
            </div>

            <div className="border-t border-gray-50 pt-3 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">মোট</span>
                <span className="font-bold text-gray-900">৳{order.total}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">পরিশোধ</span>
                <span className="text-green-600">৳{order.paid}</span>
              </div>
              {order.due > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-500 font-medium">বাকি</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-500">৳{order.due}</span>
                    <Link href="/customer/profile/payment" className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
                      পরিশোধ
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 z-10">
        <Link href="/customer/dashboard" className="flex flex-col items-center text-gray-400 text-xs gap-1">
          <span className="text-xl">🏠</span>Home
        </Link>
        <Link href="/customer/prescription/upload" className="flex flex-col items-center text-gray-400 text-xs gap-1">
          <span className="text-xl">📋</span>Prescription
        </Link>
        <Link href="/customer/orders" className="flex flex-col items-center text-teal-500 text-xs gap-1">
          <span className="text-xl">📦</span>Orders
        </Link>
        <Link href="/customer/profile" className="flex flex-col items-center text-gray-400 text-xs gap-1">
          <span className="text-xl">👤</span>Profile
        </Link>
      </div>
    </div>
  );
}