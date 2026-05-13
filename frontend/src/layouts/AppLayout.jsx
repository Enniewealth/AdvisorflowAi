import {
  BookOpen,
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";


const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/renewals", label: "Renewals", icon: CalendarClock },
  { to: "/reminders", label: "Reminders", icon: CalendarClock },
  { to: "/education", label: "Education Hub", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Navigation({ onNavigate }) {
  return (
    <nav className="mt-8 space-y-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive ? "bg-white text-primary-900 shadow-sm" : "text-primary-100 hover:bg-white/10"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const sidebar = (
    <aside className="flex h-full flex-col bg-primary-900 p-5 text-white">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold">AdvisorFlow AI</p>
            <p className="text-xs text-sky-200">Nigeria insurance CRM</p>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <Navigation onNavigate={() => setOpen(false)} />
      </div>
      <div className="mt-auto rounded-2xl bg-white/10 p-4">
        <p className="text-sm font-semibold">{user?.name}</p>
        <p className="mt-1 truncate text-xs text-primary-100">{user?.agency_name || user?.email}</p>
        <Button variant="secondary" className="mt-4 w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <div className="hidden lg:block">{sidebar}</div>
      {open && <div className="fixed inset-0 z-40 lg:hidden">{sidebar}</div>}
      <main className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button className="rounded-xl p-2 text-slate-700" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
