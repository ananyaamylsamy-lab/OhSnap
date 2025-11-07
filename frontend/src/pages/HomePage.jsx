import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import PropTypes from 'prop-types';
import styles from './HomePage.module.css';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>📸 OhSnap!</h1>
        <p className={styles.tagline}>
          Capture spots worth saying &apos;Oh Snap!&apos;
        </p>
        <p className={styles.description}>
          Discover hidden gem photography locations, log your shoots with detailed camera metadata, 
          and help the community find the best spots based on style, time of day, and conditions.
        </p>
        
        {user ? (
          <Link to="/dashboard" className={styles.ctaButton}>
            Go to Dashboard
          </Link>
        ) : (
          <div className={styles.ctaButtons}>
            <Link to="/signup" className={styles.ctaButton}>
              Get Started
            </Link>
            <Link to="/login" className={styles.ctaButtonSecondary}>
              Login
            </Link>
          </div>
        )}
      </section>

      <section className={styles.features}>
        <h2>Why OhSnap?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>📍</div>
            <h3>Discover Locations</h3>
            <p>Find photography spots with GPS coordinates, best times, and accessibility info</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>📷</div>
            <h3>Track Your Shots</h3>
            <p>Log shoots with complete camera metadata, weather, and conditions</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>📊</div>
            <h3>Analyze Performance</h3>
            <p>View statistics on your favorite gear, keeper ratio, and top locations</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>🌟</div>
            <h3>Community Insights</h3>
            <p>See what camera gear works best at each location and learn from others</p>
          </div>
        </div>
      </section>
    </div>
  );
}

HomePage.propTypes = {};

export default HomePage;