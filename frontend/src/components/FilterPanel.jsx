import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./FilterPanel.module.css";

const FILTER_OPTIONS = {
  difficulty: ["easy", "moderate", "challenging"],
  accessibility: ["very accessible", "moderate", "difficult to access"],
  timeOfDay: ["sunrise", "golden hour", "midday", "blue hour", "night"],
  season: ["spring", "summer", "fall", "winter"],
  styles: ["landscape", "portrait", "macro", "wildlife", "architecture", "street"],
};

export default function FilterPanel({ onFilter, onReset }) {
  const [filters, setFilters] = useState({
    difficulty: "",
    accessibility: "",
    timeOfDay: "",
    season: "",
    style: "",
  });

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    setFilters({
      difficulty: "",
      accessibility: "",
      timeOfDay: "",
      season: "",
      style: "",
    });
    onReset();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filters</h3>
        <button onClick={handleReset} className={styles.resetButton}>
          Reset
        </button>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Difficulty</label>
        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          className={styles.select}
        >
          <option value="">All Levels</option>
          {FILTER_OPTIONS.difficulty.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Accessibility</label>
        <select
          value={filters.accessibility}
          onChange={(e) => handleFilterChange("accessibility", e.target.value)}
          className={styles.select}
        >
          <option value="">All</option>
          {FILTER_OPTIONS.accessibility.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Best Time of Day</label>
        <select
          value={filters.timeOfDay}
          onChange={(e) => handleFilterChange("timeOfDay", e.target.value)}
          className={styles.select}
        >
          <option value="">Any Time</option>
          {FILTER_OPTIONS.timeOfDay.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Season</label>
        <select
          value={filters.season}
          onChange={(e) => handleFilterChange("season", e.target.value)}
          className={styles.select}
        >
          <option value="">All Seasons</option>
          {FILTER_OPTIONS.season.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Photography Style</label>
        <select
          value={filters.style}
          onChange={(e) => handleFilterChange("style", e.target.value)}
          className={styles.select}
        >
          <option value="">All Styles</option>
          {FILTER_OPTIONS.styles.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

FilterPanel.propTypes = {
  onFilter: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};