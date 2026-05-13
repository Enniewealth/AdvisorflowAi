import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";


export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    agency_name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.email?.[0] || "Registration failed. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create advisor account" subtitle="Start organizing clients and renewals in minutes.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <Input label="Full name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <Input label="Email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input label="Agency name" value={form.agency_name} onChange={(event) => setForm({ ...form, agency_name: event.target.value })} />
        <Input label="Password" type="password" required minLength={8} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <Button className="w-full" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link className="font-medium text-sky-700" to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
