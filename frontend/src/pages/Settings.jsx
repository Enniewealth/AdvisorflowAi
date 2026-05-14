import { useState } from "react";

import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { formatApiError } from "../services/api";


export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    agency_name: user?.agency_name || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await updateProfile(form);
      setMessage("Settings saved.");
    } catch (err) {
      setError(formatApiError(err, "Settings could not be saved."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Advisor profile</h1>
        <p className="mt-2 text-slate-600">Subscription readiness is tracked here; payment integration is intentionally not built yet.</p>
      </div>
      <form className="space-y-4 rounded-2xl bg-white p-5 shadow-card" onSubmit={submit}>
        {message && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <Input label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input label="Agency name" value={form.agency_name} onChange={(event) => setForm({ ...form, agency_name: event.target.value })} />
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Subscription status</p>
          <p className="mt-1 text-sm capitalize text-slate-600">{user?.subscription_status || "trial"}</p>
          <p className="mt-2 text-xs text-slate-500">Prepared for ₦3,000 - ₦10,000/month advisor tiers.</p>
        </div>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save settings"}</Button>
      </form>
    </div>
  );
}
