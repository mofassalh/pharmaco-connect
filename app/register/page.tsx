"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password) {
      setError("সব তথ্য দিন");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password মিলছে না");
      return;
    }
    if (form.password.length < 6) {
      setError("Password কমপক্ষে ৬ অক্ষর হতে হবে");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "কিছু একটা ভুল হয়েছে");
      setLoading(false);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">💊</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">নতুন Account</h1>
          <p className="text-gray-500 text-sm mt-1">Pharmaco Connect এ Register করুন</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {[
            { label: "পুরো নাম", name: "fullName", type: "text", placeholder: "আপনার নাম" },
            { label: "Email", name: "email", type: "email", placeholder: "example@email.com" },
            { label: "Phone", name: "phone", type: "tel", placeholder: "01XXXXXXXXX" },
            { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
            { label: "Password আবার দিন", name: "confirmPassword", type: "password", placeholder: "••••••••" },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          ))}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium hover:bg-teal-600 disabled:opacity-50 transition">
            {loading ? "Register হচ্ছে..." : "Register করুন"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already account আছে?{" "}
            <Link href="/login" className="text-teal-600 font-medium">Login করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
}