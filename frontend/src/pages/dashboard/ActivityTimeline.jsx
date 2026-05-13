import EmptyState from "../../components/EmptyState";


export default function ActivityTimeline({ activities = [] }) {
  if (!activities.length) {
    return <EmptyState title="No recent activity" description="Client updates and triggered reminders will appear here." />;
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <h2 className="text-lg font-bold text-slate-950">Recent activity</h2>
      <div className="mt-5 space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
            <div>
              <p className="text-sm font-medium text-slate-900">{activity.message}</p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
