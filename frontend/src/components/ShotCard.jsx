import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './ShotCard.module.css';

function ShotCard({ shot, showPhotographer = false }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/shots/${shot._id}`} className={styles.card}>
      {shot.photos && shot.photos.length > 0 ? (
        <img 
          src={shot.photos[0]} 
          alt={shot.cameraModel} 
          className={styles.image}
        />
      ) : (
        <div className={styles.placeholder}>📷</div>
      )}
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.camera}>{shot.cameraModel}</h3>
          {shot.rating > 0 && (
            <span className={styles.rating}>⭐ {shot.rating}</span>
          )}
        </div>
        
        {shot.lens && (
          <p className={styles.lens}>🔍 {shot.lens}</p>
        )}
        
        <div className={styles.metadata}>
          {shot.aperture && <span className={styles.badge}>f/{shot.aperture}</span>}
          {shot.shutterSpeed && <span className={styles.badge}>{shot.shutterSpeed}</span>}
          {shot.iso && <span className={styles.badge}>ISO {shot.iso}</span>}
        </div>
        
        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(shot.date)}</span>
          {showPhotographer && (
            <span className={styles.photographer}>👤 {shot.username}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

ShotCard.propTypes = {
  shot: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    cameraModel: PropTypes.string.isRequired,
    lens: PropTypes.string,
    aperture: PropTypes.number,
    shutterSpeed: PropTypes.string,
    iso: PropTypes.number,
    photos: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
    date: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  showPhotographer: PropTypes.bool,
};

export default ShotCard;