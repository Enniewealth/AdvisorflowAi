import { Link } from "react-router-dom";

import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";
import { useAsync } from "../hooks/useAsync";
import { api, formatApiError, unwrapResults } from "../services/api";


export default function Renewals() {
  const { data, loading, error, refresh } = useAsync(async () => {
    const response = await api.get("/clients/");
    return unwrapResults(response.data);
  }, []);

  const renewalClients = (data || []).filter((client) => client.renewal_status !== "active");

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Renewals</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Policies needing attention</h1>
          <p className="mt-2 text-slate-600">Prioritize policies that are due soon, due today, or already expired.</p>
        </div>
        <Link to="/clients"><Button>Add renewal</Button></Link>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">Loading renewals...</p>
      ) : error ? (
        <ErrorState message={formatApiError(error, "Renewals could not be loaded.")} onRetry={refresh} />
      ) : !renewalClients.length ? (
        <EmptyState title="No urgent renewals" description="All visible policies are outside the 7-day renewal window." />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="hidden grid-cols-5 gap-4 border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
            <span>Client</span>
            <span>Provider</span>
            <span>Policy</span>
            <span>Expiry</span>
            <span>Status</span>
          </div>
          {renewalClients.map((client) => (
            <div key={client.id} className="grid gap-2 border-b border-slate-100 px-5 py-4 text-sm last:border-0 md:grid-cols-5 md:items-center">
              <p className="font-semibold text-slate-950">{client.full_name}</p>
              <p className="text-slate-600">{client.insurance_provider}</p>
              <p className="text-slate-600">{client.policy_type}</p>
              <p className="text-slate-600">{client.expiry_date}</p>
              <StatusBadge value={client.renewal_status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
