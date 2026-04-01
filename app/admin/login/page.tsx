"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
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
      setError(data.error || "Email বা Password ভুল");
      setLoading(false);
    } else if (data.role !== "ADMIN" && data.role !== "SUPER_ADMIN" && data.role !== "DELIVERY_STAFF") {
      setError("আপনার Admin access নেই");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a202c", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "sans-serif" }}>
      <div style={{ background: "#2d3748", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400, border: "0.5px solid #4a5568" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: "#0D9488", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 26 }}>💊</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>Pharmaco Admin</h1>
          <p style={{ color: "#a0aec0", fontSize: 14, marginTop: 6 }}>Admin Panel Login</p>
          <span style={{ fontSize: 11, background: "#553C9A", color: "#D6BCFA", padding: "3px 12px", borderRadius: 20, fontWeight: 600, display: "inline-block", marginTop: 8 }}>Admin Only</span>
        </div>

        {error && (
          <div style={{ background: "#742A2A", border: "1px solid #C53030", color: "#FEB2B2", fontSize: 13, padding: "10px 14px", borderRadius: 10, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#a0aec0", display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@pharmaco.com"
            style={{ width: "100%", background: "#1a202c", border: "1px solid #4a5568", borderRadius: 12, padding: "12px 16px", fontSize: 14, boxSizing: "border-box", outline: "none", color: "#fff" }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#a0aec0", display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", background: "#1a202c", border: "1px solid #4a5568", borderRadius: 12, padding: "12px 16px", fontSize: 14, boxSizing: "border-box", outline: "none", color: "#fff" }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", background: loading ? "#4a5568" : "#0D9488", color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Login হচ্ছে..." : "Admin Login করুন"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/login" style={{ fontSize: 12, color: "#718096", textDecoration: "none" }}>← Customer Login এ যান</Link>
        </div>
      </div>
    </div>
  );
}