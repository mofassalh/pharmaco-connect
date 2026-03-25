"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  CALLED: "bg-blue-50 text-blue-600",
  CONFIRMED: "bg-green-50 text-green-600",
  DECLINED: "bg-red-50 text-red-600",
  ORDER_CREATED: "bg-teal-50 text-teal-600",
  COMPLETED: "bg-gray-100 text-gray-500",
};

export default function AdminRemindersPage() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/reminders")
      .then(r => r.json())
      .then(data => { setReminders(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    await fetch(`/api/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, callNotes: notes }),
    });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">Reminders</span>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔔</div>
            <div className="text-gray-500">কোনো reminder নেই</div>
          </div>
        ) : (
          reminders.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900">{r.customer?.fullName}</div>
                  <div className="text-xs text-gray-400">{r.regularMedicine?.medicineName || r.type}</div>
                  <div className="text-xs text-gray-400">Due: {new Date(r.dueDate).toLocaleDateString("bn-BD")}</div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[r.status]}`}>
                  {r.status}
                </span>
              </div>
              {r.status === "PENDING" && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(r.id, "CALLED")}
                    className="flex-1 bg-teal-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-teal-600 transition">
                    📞 Call করলাম
                  </button>
                </div>
              )}
              {r.status === "CALLED" && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(r.id, "CONFIRMED")}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition">
                    ✓ Confirmed
                  </button>
                  <button onClick={() => updateStatus(r.id, "DECLINED")}
                    className="flex-1 border border-red-200 text-red-500 py-2 rounded-xl text-sm hover:bg-red-50 transition">
                    ✗ Declined
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}