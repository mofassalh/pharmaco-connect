"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/language";

export default function CustomerDashboard() {
  const [userName, setUserName] = useState("...");
  const [dueAmount, setDueAmount] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/me")
      .then(res => res.json())
      .then(data => {
        if (data.name) setUserName(data.name);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">💊</span>
          </div>
          <span className="font-bold text-gray-900">Pharmaco Connect</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{t("welcome")}, {userName.split(" ")[0]}</span>
          <Link href="/customer/profile" className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm">👤</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {dueAmount > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="text-sm font-medium text-red-700">{t("dueAmount")}!</div>
                <div className="text-xl font-bold text-red-600">৳ {dueAmount.toLocaleString()}</div>
              </div>
            </div>
            <Link href="/customer/profile/billing" className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition">
              {t("payNow")}
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-teal-600">0</div>
            <div className="text-sm text-gray-500 mt-1">{t("totalPrescription")}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-500 mt-1">{t("activeOrders")}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-amber-600">0</div>
            <div className="text-sm text-gray-500 mt-1">{t("regularMedicine")}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-500 mt-1">{t("refillDays")}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/customer/prescription/upload" className="bg-teal-500 text-white rounded-2xl p-5 flex flex-col gap-2 hover:bg-teal-600 transition">
            <span className="text-3xl">📋</span>
            <div className="font-bold">{t("uploadPrescription")}</div>
            <div className="text-teal-100 text-xs">AI auto-fill</div>
          </Link>
          <Link href="/customer/shop" className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2 hover:border-teal-300 transition">
            <span className="text-3xl">💊</span>
            <div className="font-bold text-gray-900">{t("buyMedicine")}</div>
            <div className="text-gray-400 text-xs">{t("available")}</div>
          </Link>
          <Link href="/customer/orders" className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2 hover:border-teal-300 transition">
            <span className="text-3xl">📦</span>
            <div className="font-bold text-gray-900">{t("myOrders")}</div>
            <div className="text-gray-400 text-xs">{t("viewAll")}</div>
          </Link>
          <Link href="/customer/profile/refills" className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2 hover:border-teal-300 transition">
            <span className="text-3xl">🔔</span>
            <div className="font-bold text-gray-900">{t("monthlyRefill")}</div>
            <div className="text-gray-400 text-xs">Reminder</div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{t("recentOrders")}</h2>
            <Link href="/customer/orders" className="text-sm text-teal-600">{t("viewAll")}</Link>
          </div>
          <div className="text-center py-6 text-gray-400 text-sm">
            {t("noOrders")}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 z-10">
        <Link href="/customer/dashboard" className="flex flex-col items-center text-teal-500 text-xs gap-1">
          <span className="text-xl">🏠</span>{t("home")}
        </Link>
        <Link href="/customer/prescription/upload" className="flex flex-col items-center text-gray-400 text-xs gap-1">
          <span className="text-xl">📋</span>{t("prescription")}
        </Link>
        <Link href="/customer/orders" className="flex flex-col items-center text-gray-400 text-xs gap-1">
          <span className="text-xl">📦</span>{t("orders")}
        </Link>
        <Link href="/customer/profile" className="flex flex-col items-center text-gray-400 text-xs gap-1">
          <span className="text-xl">👤</span>{t("profile")}
        </Link>
      </div>
    </div>
  );
}