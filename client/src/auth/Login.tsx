import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      const role = res.data?.user?.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="text-xs text-slate-400">
            Use your ScholarX account to access your dashboard.
          </p>
        </div>

        <div className="space-y-3">
          <input
            className="w-full border border-slate-700 bg-slate-900/70 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-slate-700 bg-slate-900/70 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 hover:bg-blue-500 transition text-white rounded px-4 py-2 text-sm font-medium"
            onClick={submit}
          >
            Login
          </button>
        </div>

        {error && <p className="text-xs text-red-400 mt-1 text-center">{error}</p>}

        <p className="text-[11px] text-slate-400 text-center mt-2">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

