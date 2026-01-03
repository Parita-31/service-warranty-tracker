const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/* ================= USER ROUTES ================= */

/**
 * Get logged-in user's service requests
 * Relation:
 * users -> appliances -> service_requests
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        sr.request_id,
        a.name AS appliance_name,
        sr.issue_description,
        sr.status
      FROM service_requests sr
      JOIN appliances a ON sr.appliance_id = a.appliance_id
      WHERE a.user_id = $1
      ORDER BY sr.request_id DESC
      `,
      [req.user.user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("🔥 USER SERVICE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Create service request (USER)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { appliance_id, issue_description } = req.body;

    const result = await pool.query(
      `
      INSERT INTO service_requests
        (appliance_id, issue_description, status)
      VALUES
        ($1, $2, 'Open')
      RETURNING *
      `,
      [appliance_id, issue_description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 CREATE SERVICE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADMIN ROUTES ================= */

/**
 * ADMIN: Get ALL service requests
 * Relation:
 * service_requests -> appliances -> users
 */
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        sr.request_id,
        sr.issue_description,
        sr.status,
        u.email
      FROM service_requests sr
      JOIN appliances a ON sr.appliance_id = a.appliance_id
      JOIN users u ON a.user_id = u.user_id
      ORDER BY sr.request_id DESC
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("🔥 ADMIN ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Update service request status
 */
router.put("/admin/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // Check current status
    const existing = await pool.query(
      "SELECT status FROM service_requests WHERE request_id = $1",
      [req.params.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Service request not found" });
    }

    if (existing.rows[0].status === "Resolved") {
      return;
    }

    await pool.query(
      `
      UPDATE service_requests
      SET status = $1
      WHERE request_id = $2
      `,
      [status, req.params.id]
    );

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("🔥 ADMIN UPDATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADMIN: Service statistics
 */
router.get("/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS open,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS "inProgress",
        SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) AS resolved
      FROM service_requests
      `
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 ADMIN STATS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
