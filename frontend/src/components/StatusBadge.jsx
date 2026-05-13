const classes = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  expiring_soon: "bg-amber-50 text-amber-700 ring-amber-200",
  due_today: "bg-sky-50 text-sky-700 ring-sky-200",
  expired: "bg-red-50 text-red-700 ring-red-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  sent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  dismissed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const labels = {
  active: "Active",
  expiring_soon: "Expiring soon",
  due_today: "Due today",
  expired: "Expired",
  pending: "Pending",
  sent: "Sent",
  dismissed: "Dismissed",
};


export default function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${classes[value] || classes.dismissed}`}
    >
      {labels[value] || value}
    </span>
  );
}
