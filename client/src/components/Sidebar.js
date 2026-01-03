import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Sidebar() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const linkClasses = (path) =>
    `block px-3 py-2 rounded mb-2 ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="w-60 bg-white shadow h-screen p-4">
      <h2 className="font-bold text-xl mb-6">Dashboard</h2>

      {/* USER LINKS */}
      {user.role === "user" && (
        <>
          <Link
            to="/user/dashboard"
            className={linkClasses("/user/dashboard")}
          >
            Dashboard
          </Link>

          <Link
            to="/user/appliances"
            className={linkClasses("/user/appliances")}
          >
            My Appliances
          </Link>

          <Link
            to="/user/services"
            className={linkClasses("/user/services")}
          >
            Service Requests
          </Link>

          <Link
            to="/user/profile"
            className={linkClasses("/user/profile")}
          >
            Profile
          </Link>
        </>
      )}

      {/* ADMIN LINKS */}
      {user.role === "admin" && (
        <>
          <Link
            to="/admin/dashboard"
            className={linkClasses("/admin/dashboard")}
          >
            Admin Dashboard
          </Link>

          <Link
            to="/admin/services"
            className={linkClasses("/admin/services")}
          >
            Manage Services
          </Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;
