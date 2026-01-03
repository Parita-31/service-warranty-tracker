const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addAppliance,
  getMyAppliances,
} = require("../controllers/appliance.controller");

// Protected routes
router.post("/", authMiddleware, addAppliance);
router.get("/", authMiddleware, getMyAppliances);

module.exports = router;
