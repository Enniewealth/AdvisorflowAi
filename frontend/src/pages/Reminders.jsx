import { MailCheck, RefreshCcw } from "lucide-react";
import { useState } from "react";

import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { useAsync } from "../hooks/useAsync";
import { api, unwrapResults } from "../services/api";


export default function Reminders() {
  const [triggering, setTriggering] = useState(false);
  const { data, loading, refresh } = useAsync(async () => {
    const response = await api.get("/reminders/");
    return unwrapResults(response.data);
  }, []);

  const triggerDue = async () => {
    setTriggering(true);
    try {
      await api.post("/reminders/trigger-due/");
      await refresh();
    } finally {
      setTriggering(false);
    }
  };

  const updateStatus = async (reminder, status) => {
    await api.patch(`/reminders/${reminder.id}/`, { status });
    await refresh();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Reminder engine</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Policy renewal reminders</h1>
          <p className="mt-2 text-slate-600">Dashboard alerts plus email notifications for due reminders.</p>
        </div>
        <Button onClick={triggerDue} disabled={triggering}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          {triggering ? "Checking..." : "Trigger due emails"}
        </Button>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">Loading reminders...</p>
      ) : !data?.length ? (
        <EmptyState title="No reminders yet" description="Add clients with policy expiry dates to generate 7-day, expiry-day, and after-expiry reminders." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((reminder) => (
            <div key={reminder.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-950">{reminder.client_name}</p>
                  <p className="mt-1 text-sm text-slate-500">{reminder.policy_type} • expires {reminder.expiry_date}</p>
                </div>
                <StatusBadge value={reminder.status} />
              </div>
              <p className="mt-4 text-sm text-slate-700">{reminder.message}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-500">
                  {reminder.reminder_type_display} · {reminder.reminder_date}
                </p>
                <div className="flex gap-2">
                  {reminder.status !== "sent" && (
                    <Button variant="secondary" onClick={() => updateStatus(reminder, "sent")}>
                      <MailCheck className="mr-2 h-4 w-4" />
                      Mark sent
                    </Button>
                  )}
                  {reminder.status !== "dismissed" && (
                    <Button variant="secondary" onClick={() => updateStatus(reminder, "dismissed")}>Dismiss</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
