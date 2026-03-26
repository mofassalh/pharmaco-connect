"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FamilyPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(data => { if (data.id) setUser(data); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/profile" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">পরিবারের সদস্য</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* নিজের card */}
        {user && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-xl font-bold text-teal-700">
                {user.name?.[0] || "?"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{user.name}</span>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">আমি</span>
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="bg-teal-50 text-teal-700 text-xs px-3 py-2 rounded-lg">
              Primary Account
            </div>
          </div>
        )}

        {/* Add family member */}
        <button className="w-full border-2 border-dashed border-teal-300 text-teal-600 py-4 rounded-2xl font-medium hover:border-teal-500 transition">
          + নতুন সদস্য যোগ করুন
        </button>

        <p className="text-xs text-gray-400 text-center px-4">
          পরিবারের সদস্য যোগ করলে তাদের prescription ও medicine আলাদাভাবে track করতে পারবেন
        </p>
      </div>
    </div>
  );
}