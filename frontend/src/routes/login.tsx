import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login | H.M Herbal World" }] }),
  component: Login,
});

function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <div className="container mx-auto px-6 py-16 max-w-md">
      <div className="bg-card border border-border rounded-3xl p-8 shadow-soft">
        <div className="text-center">
          <h1 className="font-display text-3xl">{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="text-sm text-muted-foreground mt-2">{mode === "login" ? "Sign in to track orders and access offers." : "Join the H.M Herbal World family."}</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
          {mode === "register" && <Field label="Full name" type="text" />}
          <Field label="Email or phone" type="text" />
          <Field label="Password" type="password" />
          <button className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition-transform">
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <div className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-primary font-medium hover:underline">
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </div>
        <Link to="/" className="block text-center text-xs text-muted-foreground mt-3 hover:text-primary">← Back to home</Link>
      </div>
    </div>
  );
}

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
      <input required {...p} className="w-full h-11 px-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );
}
