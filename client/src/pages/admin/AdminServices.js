import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchServices = async () => {
    const res = await axios.get("/services/admin");
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const updateStatus = async (id, newStatus, currentStatus) => {
    // UX safety checks
    if (currentStatus === "Resolved") return;
    if (newStatus === currentStatus) return;

    try {
      await axios.put(`/services/admin/${id}`, {
        status: newStatus,
      });
      fetchServices();
    } catch (err) {
      console.error(err.response?.data?.error || "Update failed");
    }
  };

  // ✅ FILTER LOGIC (MUST BE HERE)
  const filtered =
    filter === "All"
      ? services
      : services.filter((s) => s.status === filter);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Manage Services" />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-6">
            All Service Requests
          </h2>

          <div className="bg-white rounded shadow overflow-x-auto p-4">
            
            {/* FILTER */}
            <div className="mb-4 flex gap-3 items-center">
              <label className="text-sm text-gray-600">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option>All</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            {/* TABLE */}
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Request ID</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Issue</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.request_id}
                    className={`border-t ${
                      s.status === "Resolved"
                        ? "opacity-60 bg-gray-50"
                        : ""
                    }`}
                  >
                    <td className="p-3">{s.request_id}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.issue_description}</td>
                    <td className="p-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="p-3">
                      <div className="relative group inline-block">
                        <select
                          className={`border p-1 rounded ${
                            s.status === "Resolved"
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                          value={s.status}
                          disabled={s.status === "Resolved"}
                          onChange={(e) =>
                            updateStatus(
                              s.request_id,
                              e.target.value,
                              s.status
                            )
                          }
                        >
                          <option>Open</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>

                        {/* TOOLTIP */}
                        {s.status === "Resolved" && (
                          <div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                       hidden group-hover:block
                                       bg-gray-800 text-white text-xs px-3 py-1 rounded
                                       whitespace-nowrap shadow-lg z-10"
                          >
                            Resolved requests cannot be modified
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* EMPTY STATE */}
            {filtered.length === 0 && (
              <p className="p-6 text-gray-500 text-center">
                No service requests found.
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            ℹ️ Resolved service requests are locked and cannot be modified.
          </p>
        </div>
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
      className={`px-2 py-1 text-xs rounded ${
        styles[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}

export default AdminServices;
