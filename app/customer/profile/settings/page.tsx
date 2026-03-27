"use client";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/language";

export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const [notif, setNotif] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <Link href="/customer/profile" className="text-gray-400 hover:text-gray-600">←</Link>
        <span className="font-bold text-gray-900">{t("settings")}</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Language */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4">{t("language")} / Language</h3>
          <div className="flex gap-3">
            <button onClick={() => setLang("bn")}
              className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${lang === "bn" ? "border-teal-400 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600"}`}>
              🇧🇩 বাংলা
            </button>
            <button onClick={() => setLang("en")}
              className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${lang === "en" ? "border-teal-400 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-600"}`}>
              🇬🇧 English
            </button>
          </div>
          {lang === "en" && (
            <p className="text-xs text-teal-600 mt-2 text-center">✓ Language changed to English</p>
          )}
          {lang === "bn" && (
            <p className="text-xs text-teal-600 mt-2 text-center">✓ ভাষা বাংলায় পরিবর্তন হয়েছে</p>
          )}
        </div>

        {/* Notification */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">{t("notification")}</div>
            <div className="text-xs text-gray-400 mt-0.5">Call ও SMS reminder</div>
          </div>
          <button onClick={() => setNotif(!notif)}
            className={`w-12 h-6 rounded-full transition ${notif ? "bg-teal-500" : "bg-gray-200"} relative`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notif ? "left-6" : "left-0.5"}`}></div>
          </button>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {[
            { href: "#", icon: "📍", label: t("deliveryAddress"), sub: "২টি ঠিকানা" },
            { href: "#", icon: "💳", label: t("savedPayments"), sub: "bKash, Nagad" },
            { href: "#", icon: "🔒", label: t("security"), sub: "Password পরিবর্তন" },
            { href: "#", icon: "💬", label: t("help"), sub: "সমস্যা জানান" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition last:border-0">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-400">{item.sub}</div>
              </div>
              <span className="text-gray-300">→</span>
            </Link>
          ))}
        </div>

        <button
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="w-full text-red-500 py-3 rounded-xl border border-red-100 font-medium hover:bg-red-50 transition">
          {t("logout")}
        </button>
      </div>
    </div>
  );
}