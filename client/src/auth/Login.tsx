import { useState } from "react";
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
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto flex flex-col gap-3">
      <h2 className="text-xl font-semibold mb-2">Login</h2>
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
        onClick={submit}
      >
        Login
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}

