import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";
import { api } from "../services/api";


export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await api.post("/auth/password-reset/", { email });
      setMessage("If the email exists, reset instructions have been sent.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter your email to receive basic reset instructions.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {message && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
        <Input label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <Button className="w-full" type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send reset instructions"}
        </Button>
        <p className="text-center text-sm text-slate-500">
          Remembered it? <Link className="font-medium text-sky-700" to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
