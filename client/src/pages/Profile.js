import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
  axios
    .get("/auth/me")
    .then((res) => setProfile(res.data))
    .catch((err) => {
      console.error(err);
      localStorage.removeItem("token");
      window.location.href = "/";
    });
}, []);


  if (!profile) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="My Profile" />

      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-6">
          <div className="bg-white p-6 rounded shadow max-w-xl">
            <h3 className="text-lg font-semibold mb-6">
              Profile Information
            </h3>
                {(!profile.name || !profile.email) && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-4 text-sm">
                    ⚠️ Complete your profile to get the best experience.
                </div>
                )}

            <div className="mb-4">
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">{profile.name}</p>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{profile.email}</p>
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-500">Role</label>
              <p className="font-medium capitalize">
                {profile.role}
              </p>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
