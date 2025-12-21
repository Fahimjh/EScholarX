import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitRegistration = async () => {
    setError(null);
    setMessage(null);
    try {
      await api.post("/auth/register", { name, email, password });
      setMessage("OTP sent to your email. Please enter it below.");
      setStep("verify");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Registration failed";
      setError(msg);
    }
  };

  const submitOtp = async () => {
    setError(null);
    try {
      await api.post("/auth/verify-otp", { email, otp });

      // After successful OTP verification, log the user in automatically
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      const role = res.data?.user?.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "OTP verification failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        {step === "form" ? (
          <>
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-semibold">Create account</h2>
              <p className="text-xs text-slate-400">
                Sign up to start learning with ScholarX.
              </p>
            </div>

            <div className="space-y-3">
              <input
                className="w-full border border-slate-700 bg-slate-900/70 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
                onClick={submitRegistration}
              >
                Send OTP
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-semibold">Verify email</h2>
              <p className="text-xs text-slate-400">
                Enter the 6-digit code sent to
                <span className="font-medium"> {email}</span>
              </p>
            </div>
            <div className="space-y-3">
              <input
                className="w-full border border-slate-700 bg-slate-900/70 rounded px-3 py-2 text-sm tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="w-full bg-green-600 hover:bg-green-500 transition text-white rounded px-4 py-2 text-sm font-medium"
                onClick={submitOtp}
              >
                Verify &amp; Continue
              </button>
            </div>
          </>
        )}

        {message && (
          <p className="text-xs text-green-400 mt-1 text-center">{message}</p>
        )}
        {error && (
          <p className="text-xs text-red-400 mt-1 text-center">{error}</p>
        )}

        <p className="text-[11px] text-slate-400 text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
