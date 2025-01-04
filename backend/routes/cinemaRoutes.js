const express = require("express");
const {
  getAllCinemas,
  createCinema,
  getCinemaById,
  updateCinema,
  toggleCinemaStatus,
  deleteCinemas,
} = require("../controllers/cinemaController");

const router = express.Router();

// Define routes
router.get("/", getAllCinemas);
router.get("/:id", getCinemaById);
router.post("/", createCinema);
router.put("/:id", updateCinema);
router.patch("/:id", toggleCinemaStatus);
router.delete("/", deleteCinemas);

module.exports = router;
