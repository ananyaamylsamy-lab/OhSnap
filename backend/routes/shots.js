import express from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../config/database.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// CREATE - Log a new photo shoot
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      locationId,
      date,
      weather,
      description,
      cameraModel,
      lens,
      aperture,
      shutterSpeed,
      iso,
      photos,
      rating,
      isPrivate,
    } = req.body;

    if (!locationId || !date || !cameraModel) {
      return res.status(400).json({ 
        error: "Location, date, and camera model are required" 
      });
    }

    const shots = getCollection("shots");

    const shot = {
      locationId: new ObjectId(locationId),
      userId: new ObjectId(req.session.userId),
      username: req.session.username,
      date: new Date(date),
      weather: weather || "",
      description: description || "",
      cameraModel,
      lens: lens || "",
      aperture: aperture || null,
      shutterSpeed: shutterSpeed || "",
      iso: iso || null,
      photos: photos || [],
      rating: rating || 0,
      isPrivate: isPrivate || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await shots.insertOne(shot);

    res.status(201).json({
      message: "Shot logged successfully",
      shotId: result.insertedId,
    });
  } catch (error) {
    console.error("Create shot error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// READ - Get all shots
router.get("/", async (req, res) => {
  try {
    const { userId, locationId, cameraModel, lens } = req.query;
    const shots = getCollection("shots");

    let filter = { isPrivate: false }; // Only public shots by default

    if (userId) {
      filter.userId = new ObjectId(userId);
      // If viewing own shots, show private ones too
      if (req.session.userId === userId) {
        delete filter.isPrivate;
      }
    }

    if (locationId) {
      filter.locationId = new ObjectId(locationId);
    }

    if (cameraModel) {
      filter.cameraModel = { $regex: cameraModel, $options: "i" };
    }

    if (lens) {
      filter.lens = { $regex: lens, $options: "i" };
    }

    const results = await shots.find(filter).sort({ date: -1 }).toArray();

    res.json(results);
  } catch (error) {
    console.error("Get shots error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// READ - Get single shot
router.get("/:id", async (req, res) => {
  try {
    const shots = getCollection("shots");
    const shot = await shots.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!shot) {
      return res.status(404).json({ error: "Shot not found" });
    }

    // Check privacy
    if (shot.isPrivate && shot.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "This shot is private" });
    }

    res.json(shot);
  } catch (error) {
    console.error("Get shot error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE - Edit shot
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const {
      weather,
      description,
      cameraModel,
      lens,
      aperture,
      shutterSpeed,
      iso,
      photos,
      rating,
      isPrivate,
    } = req.body;

    const shots = getCollection("shots");

    const shot = await shots.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!shot) {
      return res.status(404).json({ error: "Shot not found" });
    }

    if (shot.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updates = {
      ...(weather !== undefined && { weather }),
      ...(description !== undefined && { description }),
      ...(cameraModel && { cameraModel }),
      ...(lens !== undefined && { lens }),
      ...(aperture !== undefined && { aperture }),
      ...(shutterSpeed !== undefined && { shutterSpeed }),
      ...(iso !== undefined && { iso }),
      ...(photos && { photos }),
      ...(rating !== undefined && { rating }),
      ...(isPrivate !== undefined && { isPrivate }),
      updatedAt: new Date(),
    };

    await shots.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    res.json({ message: "Shot updated successfully" });
  } catch (error) {
    console.error("Update shot error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE - Remove shot
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const shots = getCollection("shots");

    const shot = await shots.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!shot) {
      return res.status(404).json({ error: "Shot not found" });
    }

    if (shot.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await shots.deleteOne({ _id: new ObjectId(req.params.id) });

    res.json({ message: "Shot deleted successfully" });
  } catch (error) {
    console.error("Delete shot error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Photographer stats
router.get("/stats/:userId", async (req, res) => {
  try {
    const shots = getCollection("shots");
    const userId = new ObjectId(req.params.userId);

    const userShots = await shots.find({ userId }).toArray();

    if (userShots.length === 0) {
      return res.json({
        totalShots: 0,
        averageRating: 0,
        favoriteCamera: null,
        favoriteLens: null,
        topLocations: [],
      });
    }

    // Calculate stats
    const totalShots = userShots.length;
    const averageRating = 
      userShots.reduce((sum, shot) => sum + (shot.rating || 0), 0) / totalShots;

    // Most used camera
    const cameraCount = {};
    userShots.forEach(shot => {
      if (shot.cameraModel) {
        cameraCount[shot.cameraModel] = (cameraCount[shot.cameraModel] || 0) + 1;
      }
    });
    const favoriteCamera = Object.keys(cameraCount).reduce((a, b) => 
      cameraCount[a] > cameraCount[b] ? a : b, null
    );

    // Most used lens
    const lensCount = {};
    userShots.forEach(shot => {
      if (shot.lens) {
        lensCount[shot.lens] = (lensCount[shot.lens] || 0) + 1;
      }
    });
    const favoriteLens = Object.keys(lensCount).reduce((a, b) => 
      lensCount[a] > lensCount[b] ? a : b, null
    );

    // Top locations
    const locationCount = {};
    userShots.forEach(shot => {
      const locId = shot.locationId.toString();
      locationCount[locId] = (locationCount[locId] || 0) + 1;
    });
    const topLocations = Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([locationId, count]) => ({ locationId, count }));

    res.json({
      totalShots,
      averageRating: Math.round(averageRating * 10) / 10,
      favoriteCamera,
      favoriteLens,
      topLocations,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Shots by location
router.get("/by-location/:locationId", async (req, res) => {
  try {
    const shots = getCollection("shots");
    const locationId = new ObjectId(req.params.locationId);

    const results = await shots
      .find({ locationId, isPrivate: false })
      .sort({ rating: -1, date: -1 })
      .toArray();

    res.json(results);
  } catch (error) {
    console.error("Get shots by location error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;