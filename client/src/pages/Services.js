import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Services() {
  const [services, setServices] = useState([]);
  const [applianceId, setApplianceId] = useState("");
  const [issue, setIssue] = useState("");

  useEffect(() => {
    axios.get("/services").then((res) => setServices(res.data));
  }, []);

  const raiseRequest = async () => {
    if (!applianceId || !issue) {
      alert("Please fill all required fields");
      return;
    }

    await axios.post("/services", {
      appliance_id: applianceId,
      issue_description: issue,
    });

    setApplianceId("");
    setIssue("");

    const res = await axios.get("/services");
    setServices(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Service Requests" />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          {/* Raise Request */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Raise Service Request
            </h3>

            <input
              className="border p-2 rounded w-full mb-3"
              placeholder="Appliance ID *"
              value={applianceId}
              onChange={(e) => setApplianceId(e.target.value)}
            />

            <textarea
              className="border p-2 rounded w-full mb-3"
              placeholder="Describe the issue *"
              rows="3"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            />

            <button
              onClick={raiseRequest}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit Request
            </button>
          </div>

          {/* Service List */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              My Service Requests
            </h3>

            {services.length === 0 ? (
              <p className="text-gray-500">
                No service requests found.
              </p>
            ) : (
              <div className="space-y-4">
                {services.map((s) => (
                  <div
                    key={s.request_id}
                    className="border p-4 rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {s.issue_description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Appliance ID: {s.appliance_name}
                      </p>
                    </div>

                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Status Badge */
function StatusBadge({ status }) {
  const styles = {
    Open: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default Services;
