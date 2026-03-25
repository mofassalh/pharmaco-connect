"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email বা Phone
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            />
          </div>

          <button className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 transition mt-2">
            Login করুন
          </button>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            নতুন user?{" "}
            <Link href="/register" className="text-teal-600 font-medium hover:underline">
              Register করুন
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            <Link href="/admin/login" className="text-gray-400 hover:text-gray-600">
              Admin Login →
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}