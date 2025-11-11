import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Welcome back, {user?.username}!</h1>
          <p>Your photography command center</p>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <div className={styles.actionCard}>
            <h3>Log New Shot</h3>
            <p>Record your latest photo shoot with camera metadata</p>
            <Link to="/shots/new" className={styles.actionBtn}>Log Shot</Link>
          </div>
          
          <div className={styles.actionCard}>
            <h3>View My Shots</h3>
            <p>Browse your shot history and statistics</p>
            <Link to="/shots" className={styles.actionBtn}>My Shots</Link>
          </div>
          
          <Link to="/locations" className={styles.actionCard}>
            <h3>Discover Locations</h3>
            <p>Find photography spots near you</p>
            <button className={styles.actionBtn}>Browse</button>
          </Link>
          
          <Link to="/add-location" className={styles.actionCard}>
            <h3>Add Location</h3>
            <p>Share a new photography spot</p>
            <button className={styles.actionBtn}>Add</button>
          </Link>
        </div>
      </div>

      <div className={styles.statsSection}>
        <h2>Your Stats</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Total Shots</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Locations Visited</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>-</div>
            <div className={styles.statLabel}>Favorite Camera</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>0%</div>
            <div className={styles.statLabel}>Keeper Ratio</div>
          </div>
        </div>
      </div>
    </div>
  );
}

DashboardPage.propTypes = {};

export default DashboardPage;