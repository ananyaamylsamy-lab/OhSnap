import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./LocationCard.module.css";

export default function LocationCard({ location, onDelete }) {
  const avgRating =
    location.ratingCount > 0
      ? (location.rating / location.ratingCount).toFixed(1)
      : "N/A";

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      onDelete(location._id);
    }
  };

  return (
    <div className={styles.card}>
      {location.samplePhotoUrl && (
        <div className={styles.imageWrapper}>
          <img
            src={location.samplePhotoUrl}
            alt={location.name}
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.content}>
        <Link to={`/locations/${location._id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{location.name}</h3>
        </Link>

        <p className={styles.city}>{location.city}</p>

        {location.description && (
          <p className={styles.description}>
            {location.description.substring(0, 100)}...
          </p>
        )}

        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <span className={styles.label}>Difficulty:</span>
            <span className={styles.value}>{location.difficulty}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>Rating:</span>
            <span className={styles.value}>★ {avgRating}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>Shots:</span>
            <span className={styles.value}>{location.shotCount}</span>
          </div>
        </div>

        {location.photographyStyles &&
          location.photographyStyles.length > 0 && (
            <div className={styles.tags}>
              {location.photographyStyles.map((style) => (
                <span key={style} className={styles.tag}>
                  {style}
                </span>
              ))}
            </div>
          )}
      </div>

      <div className={styles.actions}>
        <Link to={`/locations/${location._id}`} className={styles.button}>
          View
        </Link>
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete
        </button>
      </div>
    </div>
  );
}

LocationCard.propTypes = {
  location: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    description: PropTypes.string,
    samplePhotoUrl: PropTypes.string,
    difficulty: PropTypes.string,
    rating: PropTypes.number,
    ratingCount: PropTypes.number,
    shotCount: PropTypes.number,
    photographyStyles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};
