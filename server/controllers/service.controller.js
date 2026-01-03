const pool = require("../db/connection");

// CREATE SERVICE REQUEST (User)
exports.createServiceRequest = async (req, res) => {
  try {
    const { appliance_id, issue_description } = req.body;
    const user_id = req.user.user_id;

    if (!appliance_id || !issue_description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure appliance belongs to user
    const applianceCheck = await pool.query(
      "SELECT * FROM appliances WHERE appliance_id = $1 AND user_id = $2",
      [appliance_id, user_id]
    );

    if (applianceCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized appliance access" });
    }

    const newRequest = await pool.query(
      `INSERT INTO service_requests (appliance_id, issue_description)
       VALUES ($1, $2)
       RETURNING *`,
      [appliance_id, issue_description]
    );

    res.status(201).json(newRequest.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create service request" });
  }
};

// GET SERVICE HISTORY (User)
exports.getMyServiceRequests = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const result = await pool.query(
      `
      SELECT sr.*
      FROM service_requests sr
      JOIN appliances a ON sr.appliance_id = a.appliance_id
      WHERE a.user_id = $1
      ORDER BY sr.created_at DESC
      `,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch service history" });
  }
};

// UPDATE SERVICE STATUS (Admin)
exports.updateServiceStatus = async (req, res) => {
  try {
    const { status, remark } = req.body;
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access only" });
    }

    const updated = await pool.query(
      `
      UPDATE service_requests
      SET status = $1
      WHERE request_id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (remark) {
      await pool.query(
        `
        INSERT INTO service_logs (request_id, remark)
        VALUES ($1, $2)
        `,
        [id, remark]
      );
    }

    res.json(updated.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to update service status" });
  }
};
