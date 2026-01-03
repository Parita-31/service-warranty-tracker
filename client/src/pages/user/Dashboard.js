import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function Dashboard() {
  const [appliances, setAppliances] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const applianceRes = await axios.get("/appliances");
      const serviceRes = await axios.get("/services");
      setAppliances(applianceRes.data);
      setServices(serviceRes.data);
    };
    fetchData();
  }, []);

  const today = new Date();

  const activeWarranties = appliances.filter(
    (a) => new Date(a.warranty_end_date) >= today
  ).length;

  const expiredWarranties = appliances.length - activeWarranties;

  const openServices = services.filter(
    (s) => s.status !== "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Dashboard" />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          {/* Welcome */}
          <h2 className="text-2xl font-bold mb-6">
            Welcome back 👋
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Appliances"
              value={appliances.length}
              color="blue"
            />
            <StatCard
              title="Active Warranties"
              value={activeWarranties}
              color="green"
            />
            <StatCard
              title="Expired Warranties"
              value={expiredWarranties}
              color="red"
            />
            <StatCard
              title="Open Service Requests"
              value={openServices}
              color="yellow"
            />
          </div>

          {/* Recent Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Appliances */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">
                Recent Appliances
              </h3>

              {appliances.length === 0 ? (
                <p className="text-gray-500">
                  No appliances added yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {appliances.slice(0, 5).map((a) => (
                    <li
                      key={a.appliance_id}
                      className="flex justify-between border-b pb-2"
                    >
                      <span>{a.name}</span>
                      <span className="text-sm text-gray-500">
                        {a.warranty_end_date}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Services */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">
                Service Requests
              </h3>

              {services.length === 0 ? (
                <p className="text-gray-500">
                  No service requests yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {services.slice(0, 5).map((s) => (
                    <li
                      key={s.request_id}
                      className="flex justify-between border-b pb-2"
                    >
                      <span>{s.issue_description}</span>
                      <StatusBadge status={s.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small components */

function StatCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <p className="text-gray-500 text-sm mb-2">{title}</p>
      <div
        className={`inline-block px-3 py-2 rounded text-xl font-bold ${colors[color]}`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Open: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default Dashboard;
