import { Link } from "react-router-dom";

import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";


export default function ReminderPanel({ reminders = [] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">Upcoming renewal alerts</h2>
        <Link to="/reminders" className="text-sm font-semibold text-sky-700">View all</Link>
      </div>
      <div className="mt-5">
        {!reminders.length ? (
          <EmptyState title="No urgent renewals" description="Add clients with expiry dates to generate reminder alerts." />
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-950">{reminder.client_name}</p>
                  <StatusBadge value={reminder.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{reminder.message}</p>
                <p className="mt-2 text-xs text-slate-500">Reminder date: {reminder.reminder_date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
