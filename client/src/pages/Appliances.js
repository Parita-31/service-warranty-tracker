import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Appliances() {
  const [appliances, setAppliances] = useState([]);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");

  useEffect(() => {
    axios.get("/appliances").then((res) => setAppliances(res.data));
  }, []);

  const addAppliance = async () => {
    if (!name || !purchaseDate || !warrantyEndDate) {
      alert("Please fill all required fields");
      return;
    }

    await axios.post("/appliances", {
      name,
      brand,
      purchase_date: purchaseDate,
      warranty_end_date: warrantyEndDate,
    });

    setName("");
    setBrand("");
    setPurchaseDate("");
    setWarrantyEndDate("");

    const res = await axios.get("/appliances");
    setAppliances(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="My Appliances" />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          {/* ADD APPLIANCE */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Add Appliance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border p-2 rounded"
                placeholder="Appliance name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Brand (optional)"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />

              <div>
                <label className="text-sm text-gray-600">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={purchaseDate}
                  onChange={(e) =>
                    setPurchaseDate(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Warranty End Date *
                </label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={warrantyEndDate}
                  onChange={(e) =>
                    setWarrantyEndDate(e.target.value)
                  }
                />
              </div>
            </div>

            <button
              onClick={addAppliance}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Appliance
            </button>
          </div>

          {/* APPLIANCE LIST */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {appliances.map((a) => {
              // 🔹 WARRANTY COUNTDOWN LOGIC
              const daysLeft = Math.ceil(
                (new Date(a.warranty_end_date) -
                  new Date()) /
                  (1000 * 60 * 60 * 24)
              );

              const badgeStyle =
                daysLeft <= 0
                  ? "bg-red-100 text-red-700"
                  : daysLeft <= 30
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700";

              const badgeText =
                daysLeft <= 0
                  ? "Expired"
                  : `Expires in ${daysLeft} days`;

              return (
                <div
                  key={a.appliance_id}
                  className="bg-white p-4 rounded shadow"
                >
                  <h4 className="font-bold">{a.name}</h4>

                  {a.brand && (
                    <p className="text-sm text-gray-500">
                      {a.brand}
                    </p>
                  )}

                  <p className="text-sm mt-2">
                    Warranty ends on{" "}
                    <span className="font-medium">
                      {a.warranty_end_date}
                    </span>
                  </p>

                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${badgeStyle}`}
                  >
                    {badgeText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appliances;
