const { Op } = require("sequelize");
const Cinema = require("../models/Cinema");

// Move cities data to a separate constant
const CITIES = [
  { id: 1, name: "Ho Chi Minh City" },
  { id: 2, name: "Hanoi" },
  { id: 3, name: "Da Nang" },
];

exports.getCinemaById = async (req, res) => {
  const { id } = req.params;

  try {
    const cinema = await Cinema.findByPk(id);

    if (!cinema) {
      return res.status(404).json({
        status: "error",
        message: "Cinema not found",
        description: `No cinema found with id: ${id}`,
      });
    }

    // Find the city data
    const cityData = CITIES.find((city) => city.id === cinema.cityId);

    // Format the response according to the specified structure
    const response = {
      createdBy: cinema.lastModifiedBy, // Using lastModifiedBy as createdBy since it's not in current model
      lastModifiedBy: cinema.lastModifiedBy,
      createdDate: cinema.createdAt,
      lastModifiedDate: cinema.updatedAt,
      id: cinema.id,
      city: {
        createdBy: 0, // Default value since we don't track this in the CITIES constant
        lastModifiedBy: 0,
        createdDate: new Date().toISOString(), // Using current date since we don't track this
        lastModifiedDate: new Date().toISOString(),
        id: cinema.cityId,
        name: cityData?.name || "Unknown City",
        status: cityData?.status || 0,
      },
      name: cinema.name,
      address: cinema.address,
      status: cinema.status === "active" ? 1 : 0,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching cinema:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch cinema",
      description: error.message,
    });
  }
};

exports.getAllCinemas = async (req, res) => {
  const { query = "" } = req.query;

  try {
    const cinemas = await Cinema.findAll({
      where: query
        ? {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${query}%`,
                },
              },
              {
                address: {
                  [Op.like]: `%${query}%`,
                },
              },
            ],
          }
        : {},
      order: [["createdAt", "DESC"]],
    });

    const formattedCinemas = cinemas.map((cinema) => ({
      id: cinema.id,
      name: cinema.name,
      status: cinema.status === "active" ? 1 : 0,
      lastModifiedDate: cinema.updatedAt,
      city:
        CITIES.find((city) => city.id === cinema.cityId)?.name ||
        "Unknown City",
      lastModifiedBy: cinema.lastModifiedBy,
      numberOfScreens: 0,
      address: cinema.address,
    }));

    res.status(200).json(formattedCinemas);
  } catch (error) {
    console.error("Error fetching cinemas:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch cinemas",
      description: error.message,
    });
  }
};

exports.createCinema = async (req, res) => {
  const { cityId, name, address } = req.body;

  try {
    if (!cityId || !name || !address) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        description: "cityId, name, and address are required",
      });
    }

    // Validate cityId
    if (!CITIES.some((city) => city.id === cityId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid city ID",
        description: "The provided city ID does not exist",
      });
    }

    const existingCinema = await Cinema.findOne({
      where: {
        name,
        cityId,
      },
    });

    if (existingCinema) {
      return res.status(400).json({
        status: "error",
        message: "Cinema already exists",
        description: "A cinema with this name already exists in this city",
      });
    }

    const cinema = await Cinema.create({
      cityId,
      name,
      address,
      status: "active",
      lastModifiedBy: req.user?.id || 1, // You might want to implement proper user authentication
    });

    res.status(201).json({
      status: "success",
      message: "Cinema created successfully",
      data: {
        id: cinema.id,
        name: cinema.name,
        cityId: cinema.cityId,
        city: CITIES.find((city) => city.id === cinema.cityId)?.name,
        address: cinema.address,
        status: 1, // Convert to numeric status for frontend
        lastModifiedDate: cinema.updatedAt,
        lastModifiedBy: cinema.lastModifiedBy,
        numberOfScreens: 0,
      },
    });
  } catch (error) {
    console.error("Error creating cinema:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create cinema",
      description: error.message,
    });
  }
};

exports.updateCinema = async (req, res) => {
  const { id } = req.params;
  const { cityId, name, address, status } = req.body;

  try {
    // Validate required fields
    if (!cityId || !name || !address || typeof status !== "number") {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
        description: "cityId, name, address, and status are required",
      });
    }

    // Validate cityId
    if (!CITIES.some((city) => city.id === cityId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid city ID",
        description: "The provided city ID does not exist",
      });
    }

    // Check if cinema exists
    const cinema = await Cinema.findByPk(id);
    if (!cinema) {
      return res.status(404).json({
        status: "error",
        message: "Cinema not found",
        description: `No cinema found with id: ${id}`,
      });
    }

    // Check for duplicate name in the same city (excluding current cinema)
    const existingCinema = await Cinema.findOne({
      where: {
        name,
        cityId,
        id: { [Op.ne]: id }, // Exclude current cinema
      },
    });

    if (existingCinema) {
      return res.status(400).json({
        status: "error",
        message: "Cinema already exists",
        description: "A cinema with this name already exists in this city",
      });
    }

    // Update cinema
    await cinema.update({
      cityId,
      name,
      address,
      status: status === 1 ? "active" : "inactive",
      lastModifiedBy: req.user?.id || 1, // You might want to implement proper user authentication
    });

    // Format response
    const response = {
      id: cinema.id,
      name: cinema.name,
      cityId: cinema.cityId,
      city: CITIES.find((city) => city.id === cinema.cityId)?.name,
      address: cinema.address,
      status: cinema.status === "active" ? 1 : 0,
      lastModifiedDate: cinema.updatedAt,
      lastModifiedBy: cinema.lastModifiedBy,
      numberOfScreens: 0,
    };

    res.status(200).json({
      status: "success",
      message: "Cinema updated successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error updating cinema:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update cinema",
      description: error.message,
    });
  }
};

exports.toggleCinemaStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const cinema = await Cinema.findByPk(id);

    if (!cinema) {
      return res.status(404).json({
        status: "error",
        message: "Cinema not found",
        description: `No cinema found with id: ${id}`,
      });
    }

    // Toggle the status
    const newStatus = cinema.status === "active" ? "inactive" : "active";

    await cinema.update({
      status: newStatus,
      lastModifiedBy: req.user?.id || 1, // You might want to implement proper user authentication
    });

    res.status(200).json({
      status: "success",
      message: "Cinema status updated successfully",
      data: {
        id: cinema.id,
        status: newStatus === "active" ? 1 : 0,
      },
    });
  } catch (error) {
    console.error("Error toggling cinema status:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to toggle cinema status",
      description: error.message,
    });
  }
};

exports.deleteCinemas = async (req, res) => {
  try {
    // Get cinema IDs from request body
    const { cinemaIds } = req.body; // Change to expect an object with cinemaIds property

    if (!Array.isArray(cinemaIds) || cinemaIds.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid input",
        description: "Request body must contain an array of cinema IDs",
      });
    }

    // Delete the cinemas
    const result = await Cinema.destroy({
      where: {
        id: cinemaIds,
      },
    });

    if (result === 0) {
      return res.status(404).json({
        status: "error",
        message: "No cinemas found",
        description: "None of the provided cinema IDs were found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Cinemas deleted successfully",
      data: {
        deletedCount: result,
      },
    });
  } catch (error) {
    console.error("Error deleting cinemas:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete cinemas",
      description: error.message,
    });
  }
};
