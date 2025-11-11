import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocations } from "../hooks/useLocations";
import styles from "./AddLocationPage.module.css";

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

export default function AddLocationPage() {
  const navigate = useNavigate();
  const { addLocation, loading, error } = useLocations();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    coordinates: { latitude: "", longitude: "" },
    bestTimeOfDay: [],
    seasons: [],
    difficulty: "moderate",
    accessibility: "moderate",
    photographyStyles: [],
    samplePhotoUrl: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

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

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Location name is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.coordinates.latitude || isNaN(formData.coordinates.latitude)) {
      errors.latitude = "Valid latitude is required";
    } else if (
      formData.coordinates.latitude < -90 ||
      formData.coordinates.latitude > 90
    ) {
      errors.latitude = "Latitude must be between -90 and 90";
    }

    if (!formData.coordinates.longitude || isNaN(formData.coordinates.longitude)) {
      errors.longitude = "Valid longitude is required";
    } else if (
      formData.coordinates.longitude < -180 ||
      formData.coordinates.longitude > 180
    ) {
      errors.longitude = "Longitude must be between -180 and 180";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await addLocation(formData);
      navigate("/locations");
    } catch (err) {
      setValidationErrors({
        submit: err.message || "Failed to create location",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Add New Location</h1>
        <p>Share a photography location with the community</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {validationErrors.submit && (
          <div className={styles.error}>{validationErrors.submit}</div>
        )}

        <div className={styles.formSection}>
          <h2>Basic Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="name">Location Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Sunset Cliff Overlook"
              className={styles.input}
            />
            {validationErrors.name && (
              <span className={styles.fieldError}>{validationErrors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">City *</label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g., San Francisco, CA"
              className={styles.input}
            />
            {validationErrors.city && (
              <span className={styles.fieldError}>{validationErrors.city}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the location, access, parking, etc."
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
              placeholder="https://example.com/photo.jpg"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Coordinates *</h2>

          <div className={styles.coordGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                type="number"
                name="coordinates.latitude"
                value={formData.coordinates.latitude}
                onChange={handleInputChange}
                placeholder="37.7749"
                step="0.0001"
                className={styles.input}
              />
              {validationErrors.latitude && (
                <span className={styles.fieldError}>
                  {validationErrors.latitude}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                type="number"
                name="coordinates.longitude"
                value={formData.coordinates.longitude}
                onChange={handleInputChange}
                placeholder="-122.4194"
                step="0.0001"
                className={styles.input}
              />
              {validationErrors.longitude && (
                <span className={styles.fieldError}>
                  {validationErrors.longitude}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Photography Attributes</h2>

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

        <div className={styles.actions}>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Creating..." : "Create Location"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/locations")}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}