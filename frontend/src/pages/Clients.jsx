import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";
import StatusBadge from "../components/StatusBadge";
import { useAsync } from "../hooks/useAsync";
import { api, unwrapResults } from "../services/api";


const initialForm = {
  full_name: "",
  phone_number: "",
  email: "",
  insurance_provider: "",
  policy_type: "",
  policy_start_date: "",
  expiry_date: "",
  notes: "",
  is_active: true,
};

export default function Clients() {
  const [query, setQuery] = useState("");
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const { data, loading, refresh } = useAsync(async () => {
    const response = await api.get("/clients/");
    return unwrapResults(response.data);
  }, []);

  const clients = useMemo(() => {
    if (!query) return data || [];
    return (data || []).filter((client) =>
      `${client.full_name} ${client.phone_number} ${client.policy_type}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [data, query]);

  const startEdit = (client) => {
    setEditingClient(client);
    setForm({
      ...initialForm,
      ...client,
      policy_start_date: client.policy_start_date || "",
      notes: client.notes || "",
    });
  };

  const resetForm = () => {
    setEditingClient(null);
    setForm(initialForm);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient.id}/`, form);
      } else {
        await api.post("/clients/", form);
      }
      resetForm();
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const removeClient = async (client) => {
    if (!confirm(`Delete ${client.full_name}?`)) return;
    await api.delete(`/clients/${client.id}/`);
    await refresh();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-sky-50 p-3 text-sky-700">
            <Plus className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-950">{editingClient ? "Edit client" : "Add client"}</h1>
            <p className="text-sm text-slate-500">Capture the details needed to prevent missed renewals.</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <Input label="Full name" required value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} />
          <Input label="Phone number" required value={form.phone_number} onChange={(event) => setForm({ ...form, phone_number: event.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Insurance provider" required value={form.insurance_provider} onChange={(event) => setForm({ ...form, insurance_provider: event.target.value })} />
            <Input label="Policy type" required value={form.policy_type} onChange={(event) => setForm({ ...form, policy_type: event.target.value })} />
            <Input label="Policy start date" type="date" value={form.policy_start_date} onChange={(event) => setForm({ ...form, policy_start_date: event.target.value })} />
            <Input label="Expiry date" type="date" required value={form.expiry_date} onChange={(event) => setForm({ ...form, expiry_date: event.target.value })} />
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Notes</span>
            <textarea
              rows="4"
              className="focus-ring w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingClient ? "Save changes" : "Add client"}</Button>
            {editingClient && <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>}
          </div>
        </form>
      </section>
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Clients</h2>
            <p className="text-sm text-slate-500">Tap a record to update details or renewal dates.</p>
          </div>
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              className="focus-ring w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm"
              placeholder="Search clients"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading clients...</p>
        ) : !clients.length ? (
          <EmptyState title="No clients yet" description="Add your first client to generate policy reminders automatically." />
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div key={client.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button className="text-left" onClick={() => startEdit(client)}>
                    <p className="font-bold text-slate-950">{client.full_name}</p>
                    <p className="mt-1 text-sm text-slate-500">{client.phone_number} • {client.insurance_provider}</p>
                  </button>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={client.renewal_status} />
                    <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => removeClient(client)} aria-label="Delete client">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                  <p>Policy: {client.policy_type}</p>
                  <p>Expiry: {client.expiry_date}</p>
                  <p>Days left: {client.days_until_expiry}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
