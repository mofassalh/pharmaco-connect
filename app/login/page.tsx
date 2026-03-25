"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email ও Password দিন");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "কিছু একটা ভুল হয়েছে");
      setLoading(false);
    } else {
      if (data.role === "ADMIN" || data.role === "SUPER_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">💊</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pharmaco Connect</h1>
          <p className="text-gray-500 text-sm mt-1">আপনার account এ login করুন</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 disabled:opacity-50 transition">
            {loading ? "Login হচ্ছে..." : "Login করুন"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            নতুন user?{" "}
            <Link href="/register" className="text-teal-600 font-medium hover:underline">
              Register করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}