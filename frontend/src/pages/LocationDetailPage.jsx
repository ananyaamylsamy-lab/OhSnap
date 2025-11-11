import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocations } from "../hooks/useLocations";
import { useAuth } from "../hooks/useAuth";
import styles from "./LocationDetailPage.module.css";

export default function LocationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentLocation,
    loading,
    error,
    getLocationById,
    editLocation,
    removeLocation,
  } = useLocations();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

  const PHOTOGRAPHY_STYLES = [
    "landscape",
    "portrait",
    "macro",
    "wildlife",
    "architecture",
    "street",
    "aerial",
    "nature",
  ];
  const TIMES_OF_DAY = ["sunrise", "golden hour", "midday", "blue hour", "night"];
  const SEASONS = ["spring", "summer", "fall", "winter"];
  const DIFFICULTIES = ["easy", "moderate", "challenging"];
  const ACCESSIBILITY_LEVELS = [
    "very accessible",
    "moderate",
    "difficult to access",
  ];

  useEffect(() => {
    getLocationById(id);
  }, [id, getLocationById]);

  useEffect(() => {
    if (currentLocation) {
      setFormData(currentLocation);
      setEditError(null);
    }
  }, [currentLocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("coordinates")) {
      const [, coord] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        coordinates: { ...prev.coordinates, [coord]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setEditError(null);
    setIsSubmitting(true);
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        city: formData.city,
        coordinates: formData.coordinates,
        bestTimeOfDay: formData.bestTimeOfDay,
        seasons: formData.seasons,
        difficulty: formData.difficulty,
        accessibility: formData.accessibility,
        photographyStyles: formData.photographyStyles,
        samplePhotoUrl: formData.samplePhotoUrl,
      };

      await editLocation(id, updateData);
      setIsEditing(false);
    
    } catch (err) {
      setEditError(err.message || "Failed to update location");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading location...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => navigate("/locations")} className={styles.backButton}>
          ← Back to Locations
        </button>
      </div>
    );
  }

  if (!currentLocation || !formData) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Location not found</div>
        <button onClick={() => navigate("/locations")} className={styles.backButton}>
          ← Back to Locations
        </button>
      </div>
    );
  }

  // Debug logging
  console.log("User:", user);
  console.log("Current Location Created By:", currentLocation?.createdBy);
  
  const userId = user?.userId || user?._id;
  const createdById = currentLocation?.createdBy?.toString ? currentLocation.createdBy.toString() : currentLocation?.createdBy;
  
  const isOwner = userId && createdById && userId.toString() === createdById;
  
  console.log("User ID:", userId);
  console.log("Created By ID:", createdById);
  console.log("Is Owner:", isOwner);
  
  const canEdit = user ? true : false;
  
  const avgRating =
    currentLocation.ratingCount > 0
      ? (currentLocation.rating / currentLocation.ratingCount).toFixed(1)
      : "N/A";

  return (
    <div className={styles.container}>
      <button
        onClick={() => {
          if (isEditing) {
            setIsEditing(false);
            setFormData(currentLocation);
          } else {
            navigate("/locations");
          }
        }}
        className={styles.backButton}
      >
        ← {isEditing ? "Cancel Edit" : "Back to Locations"}
      </button>

      {editError && <div className={styles.error}>{editError}</div>}

      {!isEditing ? (
        <div className={styles.viewMode}>
          {currentLocation.samplePhotoUrl && (
            <div className={styles.imageWrapper}>
              <img
                src={currentLocation.samplePhotoUrl}
                alt={currentLocation.name}
                className={styles.image}
              />
            </div>
          )}

          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>{currentLocation.name}</h1>
              <p className={styles.city}>{currentLocation.city}</p>
            </div>

            {canEdit && (
              <div className={styles.headerActions}>
                <button
                  onClick={() => setIsEditing(true)}
                  className={styles.editButton}
                >
                   Edit 
                </button>
              </div>
            )}
          </div>

          {currentLocation.description && (
            <div className={styles.section}>
              <h2>Description</h2>
              <p>{currentLocation.description}</p>
            </div>
          )}

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Rating</div>
              <div className={styles.statValue}>★ {avgRating}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Shots</div>
              <div className={styles.statValue}>{currentLocation.shotCount}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Difficulty</div>
              <div className={styles.statValue}>
                {currentLocation.difficulty.charAt(0).toUpperCase() +
                  currentLocation.difficulty.slice(1)}
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Accessibility</div>
              <div className={styles.statValue}>
                {currentLocation.accessibility.charAt(0).toUpperCase() +
                  currentLocation.accessibility.slice(1)}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Coordinates</h2>
            <p>
              Latitude: {currentLocation.coordinates.latitude.toFixed(4)}, Longitude:{" "}
              {currentLocation.coordinates.longitude.toFixed(4)}
            </p>
          </div>

          {currentLocation.bestTimeOfDay && currentLocation.bestTimeOfDay.length > 0 && (
            <div className={styles.section}>
              <h2>Best Time of Day</h2>
              <div className={styles.tagsList}>
                {currentLocation.bestTimeOfDay.map((time) => (
                  <span key={time} className={styles.tag}>
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentLocation.seasons && currentLocation.seasons.length > 0 && (
            <div className={styles.section}>
              <h2>Best Seasons</h2>
              <div className={styles.tagsList}>
                {currentLocation.seasons.map((season) => (
                  <span key={season} className={styles.tag}>
                    {season}
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentLocation.photographyStyles &&
            currentLocation.photographyStyles.length > 0 && (
              <div className={styles.section}>
                <h2>Photography Styles</h2>
                <div className={styles.tagsList}>
                  {currentLocation.photographyStyles.map((style) => (
                    <span key={style} className={styles.tag}>
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      ) : (
        <div className={styles.editMode}>
          <h2>Edit Location</h2>
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.formSection}>
              <h3>Basic Information</h3>

              <div className={styles.formGroup}>
                <label htmlFor="name">Location Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows="4"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="samplePhotoUrl">Sample Photo URL</label>
                <input
                  id="samplePhotoUrl"
                  type="url"
                  name="samplePhotoUrl"
                  value={formData.samplePhotoUrl}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Coordinates *</h3>

              <div className={styles.coordGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="latitude">Latitude</label>
                  <input
                    id="latitude"
                    type="number"
                    name="coordinates.latitude"
                    value={formData.coordinates.latitude}
                    onChange={handleInputChange}
                    step="0.0001"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="longitude">Longitude</label>
                  <input
                    id="longitude"
                    type="number"
                    name="coordinates.longitude"
                    value={formData.coordinates.longitude}
                    onChange={handleInputChange}
                    step="0.0001"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Photography Attributes</h3>

              <div className={styles.formGroup}>
                <label>Best Time of Day</label>
                <div className={styles.checkboxGroup}>
                  {TIMES_OF_DAY.map((time) => (
                    <label key={time} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.bestTimeOfDay.includes(time)}
                        onChange={() =>
                          handleArrayToggle("bestTimeOfDay", time)
                        }
                      />
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Best Seasons</label>
                <div className={styles.checkboxGroup}>
                  {SEASONS.map((season) => (
                    <label key={season} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.seasons.includes(season)}
                        onChange={() => handleArrayToggle("seasons", season)}
                      />
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Photography Styles</label>
                <div className={styles.checkboxGroup}>
                  {PHOTOGRAPHY_STYLES.map((style) => (
                    <label key={style} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.photographyStyles.includes(style)}
                        onChange={() =>
                          handleArrayToggle("photographyStyles", style)
                        }
                      />
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.selectGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="difficulty">Difficulty</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="accessibility">Accessibility</label>
                  <select
                    id="accessibility"
                    name="accessibility"
                    value={formData.accessibility}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    {ACCESSIBILITY_LEVELS.map((a) => (
                      <option key={a} value={a}>
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(currentLocation);
                  setEditError(null);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}