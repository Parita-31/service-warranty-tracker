import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    axios.get("/services/admin/stats").then((res) => {
      setStats(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Admin Dashboard" />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-6">
            Service Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total Requests" value={stats.total} />
            <StatCard title="Open" value={stats.open} color="yellow" />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              color="blue"
            />
            <StatCard
              title="Resolved"
              value={stats.resolved}
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color = "gray" }) {
  const colors = {
    gray: "bg-gray-100 text-gray-800",
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p
        className={`text-2xl font-bold px-3 py-1 inline-block rounded ${colors[color]}`}
      >
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;
