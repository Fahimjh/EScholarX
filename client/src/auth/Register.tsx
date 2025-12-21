import { useState } from "react";
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
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "OTP verification failed";
      setError(msg);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto flex flex-col gap-3">
      {step === "form" ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Register</h2>
          <input
            className="border rounded px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white rounded px-4 py-2 mt-2"
            onClick={submitRegistration}
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Verify Email</h2>
          <p className="text-sm text-gray-600">
            Enter the OTP sent to <span className="font-medium">{email}</span>
          </p>
          <input
            className="border rounded px-3 py-2 tracking-widest text-center"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="bg-green-600 text-white rounded px-4 py-2 mt-2"
            onClick={submitOtp}
          >
            Verify & Continue
          </button>
        </>
      )}

      {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
