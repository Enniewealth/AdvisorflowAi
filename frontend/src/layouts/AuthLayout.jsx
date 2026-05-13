import { Link } from "react-router-dom";


export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-sky-500 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[1fr_0.9fr]">
          <section className="hidden bg-primary-900 p-10 text-white lg:block">
            <Link to="/" className="text-2xl font-bold">AdvisorFlow AI</Link>
            <div className="mt-20 max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
                Renewal-first CRM
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Keep every policy, client, and commission opportunity in view.
              </h1>
              <p className="mt-5 text-primary-100">
                Built for Nigerian insurance advisors who need a fast operational system, not a complex AI platform.
              </p>
            </div>
          </section>
          <section className="p-6 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            </div>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
