const pool = require("../db/connection");

// ADD APPLIANCE
exports.addAppliance = async (req, res) => {
  try {
    const { name, brand, purchase_date, warranty_end_date } = req.body;
    const user_id = req.user.user_id;

    if (!name || !purchase_date || !warranty_end_date) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const newAppliance = await pool.query(
      `INSERT INTO appliances
       (user_id, name, brand, purchase_date, warranty_end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, name, brand, purchase_date, warranty_end_date]
    );

    res.status(201).json(newAppliance.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to add appliance" });
  }
};

// GET USER APPLIANCES
exports.getMyAppliances = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const appliances = await pool.query(
      "SELECT * FROM appliances WHERE user_id = $1 ORDER BY appliance_id DESC",
      [user_id]
    );

    res.json(appliances.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch appliances" });
  }
};
