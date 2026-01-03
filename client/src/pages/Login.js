import { useState } from "react";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      window.location.href =
        decoded.role === "admin"
          ? "/admin/dashboard"
          : "/user/dashboard";
    } catch {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      
      {/* LEFT — LIGHT SHADED INFO PANEL */}
      <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-14 py-20">
        
        {/* soft pastel glows */}
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-blue-200 rounded-full blur-[140px] opacity-40" />
        <div className="absolute bottom-0 -right-24 w-[360px] h-[360px] bg-purple-200 rounded-full blur-[140px] opacity-40" />

        <div className="relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
            Manage warranties. <br />
            <span className="text-blue-600">Stress-free.</span>
          </h1>

          <p className="text-gray-600 text-lg mb-10 max-w-md">
            A simple dashboard to track appliance warranties and service
            requests — built for clarity, not clutter.
          </p>

          <div className="space-y-6">
            <Feature icon="🧾" title="Warranty Tracking">
              Keep all warranties organized in one place.
            </Feature>
            <Feature icon="🛠️" title="Service Requests">
              Raise and monitor issues easily.
            </Feature>
            <Feature icon="🔐" title="Role-Based Access">
              Separate dashboards for users and admins.
            </Feature>
          </div>
        </div>
      </div>

      {/* RIGHT — LOGIN CARD */}
      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome back 👋
          </h2>
          <p className="text-gray-500 mb-6">
            Login to your account
          </p>

          {error && (
            <p className="text-red-600 text-sm mb-4">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="w-full mt-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full mt-1 px-4 py-2 rounded-lg border pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
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
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            {loading ? <Spinner /> : "Login"}
          </button>

          <p className="text-sm text-center mt-5 text-gray-600">
            New here?{" "}
            <a
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

/* Feature item */
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

/* Spinner */
function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
}

export default Login;
