import { useMemo, useState } from "react";

import EmptyState from "../components/EmptyState";
import { useAsync } from "../hooks/useAsync";
import { api, unwrapResults } from "../services/api";


const languages = [
  { value: "", label: "All languages" },
  { value: "english", label: "English" },
  { value: "yoruba", label: "Yoruba" },
  { value: "hausa", label: "Hausa" },
  { value: "igbo", label: "Igbo" },
];

const categories = [
  { value: "", label: "All categories" },
  { value: "insurance_basics", label: "Insurance basics" },
  { value: "policy_explanations", label: "Policy explanations" },
  { value: "claims_guidance", label: "Claims guidance" },
  { value: "terminology", label: "Terminology" },
];

export default function EducationHub() {
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const { data, loading } = useAsync(async () => {
    const response = await api.get("/education/");
    return unwrapResults(response.data);
  }, []);

  const content = useMemo(
    () =>
      (data || []).filter(
        (item) => (!language || item.language === language) && (!category || item.category === category),
      ),
    [data, language, category],
  );

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Education Hub</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Insurance education for advisor conversations</h1>
        <p className="mt-2 text-slate-600">
          Structured content in English, Yoruba, Hausa, and Igbo. No auto-translation, no marketplace features.
        </p>
      </div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <select className="focus-ring rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" value={language} onChange={(event) => setLanguage(event.target.value)}>
          {languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <select className="focus-ring rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">Loading education content...</p>
      ) : !content.length ? (
        <EmptyState title="No content found" description="Seed education content from the backend or adjust your filters." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {content.map((item) => (
            <article key={item.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">{item.language_display}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{item.category_display}</span>
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
