import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { School, Loader2 } from "lucide-react";
import { schoolInfo } from "@/data/mockData";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@greenvalley.edu");
  const [password, setPassword] = useState("demo1234");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <School className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{schoolInfo.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your ERP account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-4" style={{ boxShadow: "var(--shadow-lg)" }}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@school.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        {/* Hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Demo credentials are pre-filled. Just click <span className="font-medium text-foreground">Sign In</span>.
          </p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setEmail("admin@greenvalley.edu")}
              className="text-xs px-3 py-1 rounded-full border border-border bg-card text-muted-foreground hover:bg-accent transition-colors"
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => setEmail("rajesh@greenvalley.edu")}
              className="text-xs px-3 py-1 rounded-full border border-border bg-card text-muted-foreground hover:bg-accent transition-colors"
            >
              Teacher Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
