"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "../layout-component";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", area: "", city: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/customers").then(r => r.json())
      .then(data => { setCustomers(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = customers.filter(c =>
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.phone?.includes(search)
  );

  const handleAdd = async () => {
    if (!form.fullName || !form.email) { alert("নাম ও email দিন"); return; }
    setSaving(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, password: "pharmaco123" }),
    });
    if (res.ok) {
      setShowAdd(false);
      setForm({ fullName: "", email: "", phone: "", address: "", area: "", city: "" });
      load();
    } else {
      const data = await res.json();
      alert(data.error || "কিছু একটা ভুল হয়েছে");
    }
    setSaving(false);
  };

  return (
    <AdminLayout title="Customers" active="/admin/customers">
      <div style={{ fontFamily: "sans-serif" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#718096" }}>মোট: {customers.length} জন</div>
          <button onClick={() => setShowAdd(!showAdd)}
            style={{ background: "#0D9488", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + নতুন Customer
          </button>
        </div>

        {showAdd && (
          <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a202c", marginBottom: 14 }}>নতুন Customer যোগ করুন</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {[
                { label: "পুরো নাম *", key: "fullName", placeholder: "নাম" },
                { label: "Email *", key: "email", placeholder: "email@example.com" },
                { label: "Phone", key: "phone", placeholder: "01XXXXXXXXX" },
                { label: "ঠিকানা", key: "address", placeholder: "বাড়ি, রোড" },
                { label: "এলাকা", key: "area", placeholder: "Mirpur" },
                { label: "শহর", key: "city", placeholder: "Dhaka" },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input value={form[f.key as keyof typeof form]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 13, boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#718096", marginBottom: 10 }}>⚠️ Default password: <strong>pharmaco123</strong> — customer কে change করতে বলুন</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleAdd} disabled={saving}
                style={{ background: "#0D9488", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {saving ? "যোগ হচ্ছে..." : "✓ যোগ করুন"}
              </button>
              <button onClick={() => setShowAdd(false)}
                style={{ background: "#fff", border: "0.5px solid #e2e8f0", color: "#718096", padding: "10px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                বাতিল
              </button>
            </div>
          </div>
        )}

        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="নাম, email বা phone search করুন..."
          style={{ width: "100%", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 14, boxSizing: "border-box", background: "#fff" }} />

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#a0aec0" }}>কোনো customer নেই</div>
        ) : (
          <div style={{ background: "#fff", border: "0.5px solid #e8ecf0", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 80px", gap: 0, padding: "10px 16px", background: "#f7f8fa", borderBottom: "0.5px solid #e2e8f0" }}>
              {["নাম", "Phone", "Address", "Prescription", "Due", ""].map((h, i) => (
                <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "#718096" }}>{h}</div>
              ))}
            </div>
            {filtered.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 80px", gap: 0, padding: "12px 16px", borderBottom: i < filtered.length - 1 ? "0.5px solid #f7fafc" : "none", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E6FFFA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#0D9488", flexShrink: 0 }}>
                    {c.fullName?.[0] || "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#1a202c" }}>{c.fullName}</div>
                    <div style={{ fontSize: 11, color: "#a0aec0" }}>{c.user?.email}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#4a5568" }}>{c.user?.phone || "—"}</div>
                <div style={{ fontSize: 12, color: "#718096" }}>{c.address ? `${c.address}${c.area ? ", " + c.area : ""}` : "—"}</div>
                <div style={{ fontSize: 12, color: "#0D9488", fontWeight: 600 }}>{c.prescriptions?.length || 0} টি</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.orders?.reduce((sum: number, o: any) => sum + Number(o.dueAmount || 0), 0) > 0 ? "#C53030" : "#276749" }}>
                  ৳{c.orders?.reduce((sum: number, o: any) => sum + Number(o.dueAmount || 0), 0).toFixed(0) || "0"}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Link href={`/admin/customers/${c.id}`}
                    style={{ fontSize: 11, background: "#EBF8FF", color: "#2B6CB0", padding: "4px 8px", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}