const variants = {
  primary: "bg-primary-900 text-white hover:bg-primary-700",
  secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};


export default function Button({ children, className = "", variant = "primary", ...props }) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
