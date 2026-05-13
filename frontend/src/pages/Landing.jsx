import { ArrowRight, BellRing, BookOpen, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/Button";


const features = [
  {
    title: "Client records in one place",
    description: "Track contact details, provider, policy type, expiry dates, and notes without spreadsheet chaos.",
    icon: Users,
  },
  {
    title: "Renewal reminders that matter",
    description: "See 7-day, expiry-day, and after-expiry reminders before commissions slip away.",
    icon: BellRing,
  },
  {
    title: "Advisor education hub",
    description: "Keep clear insurance explanations in English, Yoruba, Hausa, and Igbo for better client conversations.",
    icon: BookOpen,
  },
];

export default function Landing() {
  return (
    <main className="bg-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-primary-900">AdvisorFlow AI</Link>
        <nav className="flex items-center gap-3">
          <Link className="text-sm font-medium text-slate-600 hover:text-primary-900" to="/login">Login</Link>
          <Link to="/register">
            <Button>Start free</Button>
          </Link>
        </nav>
      </header>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
            Built for Nigerian insurance advisors
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Stop missing policy renewals. Protect every client relationship.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            AdvisorFlow AI is a lightweight operational CRM for advisors, brokers, and small agencies who need fast client organization and renewal follow-up.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button className="w-full sm:w-auto">
                Create advisor account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="w-full sm:w-auto">Login</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 shadow-card">
          <div className="rounded-2xl bg-primary-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sky-200">Today&apos;s renewal risk</p>
                <p className="mt-1 text-3xl font-bold">12 policies</p>
              </div>
              <ShieldCheck className="h-10 w-10 text-sky-300" />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {["7 due this week", "3 expire today", "2 expired follow-ups", "64 active clients"].map((item) => (
              <div key={item} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{item}</p>
                <p className="mt-2 text-xs text-slate-500">Clear next action for the advisor.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow-card">
              <span className="inline-flex rounded-xl bg-sky-50 p-3 text-sky-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
