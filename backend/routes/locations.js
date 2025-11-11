import express from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../config/database.js";

const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized - Please login first" });
  }
  next();
};

// POST - Create location
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      city,
      coordinates,
      bestTimeOfDay,
      seasons,
      difficulty,
      accessibility,
      photographyStyles,
      samplePhotoUrl,
    } = req.body;

    if (!name || !city || !coordinates) {
      return res
        .status(400)
        .json({ error: "Name, city, and coordinates required" });
    }

    if (
      !coordinates.latitude ||
      !coordinates.longitude ||
      isNaN(coordinates.latitude) ||
      isNaN(coordinates.longitude)
    ) {
      return res.status(400).json({ error: "Invalid coordinates format" });
    }

    const locationsCollection = getCollection("locations");

    const newLocation = {
      name,
      description: description || "",
      city,
      coordinates: {
        latitude: parseFloat(coordinates.latitude),
        longitude: parseFloat(coordinates.longitude),
      },
      bestTimeOfDay: bestTimeOfDay || [],
      seasons: seasons || [],
      difficulty: difficulty || "moderate",
      accessibility: accessibility || "moderate",
      photographyStyles: photographyStyles || [],
      samplePhotoUrl: samplePhotoUrl || "",
      createdBy: new ObjectId(req.session.userId),
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 0,
      ratingCount: 0,
      shotCount: 0,
    };

    const result = await locationsCollection.insertOne(newLocation);

    res.status(201).json({
      message: "Location created successfully",
      location: { _id: result.insertedId, ...newLocation },
    });
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ error: "Failed to create location" });
  }
});

// GET - Get all locations with filters
router.get("/", async (req, res) => {
  try {
    const {
      city,
      style,
      timeOfDay,
      season,
      difficulty,
      accessibility,
      search,
      limit = 20,
      page = 1,
    } = req.query;

    const locationsCollection = getCollection("locations");

    const filter = {};

    if (city) filter.city = { $regex: city, $options: "i" };
    if (search)
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    if (style) filter.photographyStyles = style;
    if (timeOfDay) filter.bestTimeOfDay = timeOfDay;
    if (season) filter.seasons = season;
    if (difficulty) filter.difficulty = difficulty;
    if (accessibility) filter.accessibility = accessibility;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const locations = await locationsCollection
      .find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await locationsCollection.countDocuments(filter);

    res.json({
      locations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// GET id - Get single location
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid location ID" });
    }

    const locationsCollection = getCollection("locations");

    const location = await locationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

// PUT id - Update location
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid location ID" });
    }

    const locationsCollection = getCollection("locations");

    const location = await locationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    if (location.createdBy.toString() !== req.session.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this location" });
    }

    if (updates.coordinates) {
      if (
        !updates.coordinates.latitude ||
        !updates.coordinates.longitude ||
        isNaN(updates.coordinates.latitude) ||
        isNaN(updates.coordinates.longitude)
      ) {
        return res.status(400).json({ error: "Invalid coordinates format" });
      }
      updates.coordinates.latitude = parseFloat(
        updates.coordinates.latitude
      );
      updates.coordinates.longitude = parseFloat(
        updates.coordinates.longitude
      );
    }

    updates.updatedAt = new Date();

    const result = await locationsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result || !result.value) {
      const updatedLocation = await locationsCollection.findOne({
        _id: new ObjectId(id),
      });
      
      if (!updatedLocation) {
        return res.status(404).json({ error: "Location not found" });
      }
      
      return res.json({
        message: "Location updated successfully",
        location: updatedLocation,
      });
    }

    res.json({
      message: "Location updated successfully",
      location: result.value,
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Failed to update location" });
  }
});

// DELETE id - Delete location
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid location ID" });
    }

    const locationsCollection = getCollection("locations");

    const location = await locationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    if (location.createdBy.toString() !== req.session.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this location" });
    }

    await locationsCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Failed to delete location" });
  }
});

export default router;