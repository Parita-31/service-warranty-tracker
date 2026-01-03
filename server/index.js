require("dotenv").config(); // MUST be first

const express = require("express");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth.routes");
const applianceRoutes = require("./routes/appliance.routes");
const serviceRoutes = require("./routes/service.routes");

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appliances", applianceRoutes);
app.use("/api/services", serviceRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Service & Warranty Tracker API running");
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
