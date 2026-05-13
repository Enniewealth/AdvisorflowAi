import { BellRing, CalendarClock, ShieldCheck, Users } from "lucide-react";

import StatCard from "../components/StatCard";
import { useAsync } from "../hooks/useAsync";
import { api } from "../services/api";
import ActivityTimeline from "./dashboard/ActivityTimeline";
import ReminderPanel from "./dashboard/ReminderPanel";


export default function Dashboard() {
  const { data, loading } = useAsync(async () => {
    const response = await api.get("/dashboard/");
    return response.data;
  }, []);

  const metrics = data?.metrics || {};

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Advisor dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Renewal control center</h1>
        <p className="mt-2 text-slate-600">Focus on clients most likely to renew or lapse soon.</p>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total clients" value={metrics.total_clients} icon={Users} helper="Client records managed" />
            <StatCard title="Active policies" value={metrics.active_policies} icon={ShieldCheck} tone="green" helper="Not expired" />
            <StatCard title="Expiring policies" value={metrics.expiring_policies} icon={CalendarClock} tone="amber" helper="Due within 7 days" />
            <StatCard title="Upcoming renewals" value={metrics.upcoming_renewals} icon={BellRing} tone="red" helper="Reminder actions this week" />
          </section>
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ReminderPanel reminders={data?.upcoming_reminders} />
            <ActivityTimeline activities={data?.recent_activity} />
          </section>
        </>
      )}
    </div>
  );
}
