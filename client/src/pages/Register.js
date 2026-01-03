import { useState } from "react";
import axios from "../api/axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      window.location.href = "/";
    } catch {
      setError("Registration failed. Try another email.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      
      {/* LEFT — LIGHT GREEN INFO PANEL */}
      <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 px-14 py-20">
        
        {/* soft green glows */}
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-green-200 rounded-full blur-[140px] opacity-40" />
        <div className="absolute bottom-0 -right-24 w-[360px] h-[360px] bg-emerald-200 rounded-full blur-[140px] opacity-40" />

        <div className="relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
            Get started <br />
            <span className="text-green-600">effortlessly.</span>
          </h1>

          <p className="text-gray-600 text-lg mb-10 max-w-md">
            Create an account to manage appliance warranties and service
            requests in one clean dashboard.
          </p>

          <div className="space-y-6">
            <Feature icon="⚡" title="Quick Setup">
              Create your account in under a minute.
            </Feature>
            <Feature icon="📦" title="All-in-One">
              Appliances, warranties, and services — together.
            </Feature>
            <Feature icon="🔒" title="Secure by Design">
              Protected with authentication and role-based access.
            </Feature>
          </div>
        </div>
      </div>

      {/* RIGHT — REGISTER CARD */}
      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Create account ✨
          </h2>
          <p className="text-gray-500 mb-6">
            It’s quick and free
          </p>

          {error && (
            <p className="text-red-600 text-sm mb-4">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label className="text-sm text-gray-600">Name</label>
            <input
              className="w-full mt-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="w-full mt-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 px-4 py-2 rounded-lg border pr-12 focus:ring-2 focus:ring-green-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
          >
            {loading ? <Spinner /> : "Register"}
          </button>

          <p className="text-sm text-center mt-5 text-gray-600">
            Already have an account?{" "}
            <a
              href="/"
              className="text-green-600 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

/* Feature block */
function Feature({ icon, title, children }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-gray-600 text-sm">{children}</p>
      </div>
    </div>
  );
}

/* Loading spinner */
function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
}

export default Register;
