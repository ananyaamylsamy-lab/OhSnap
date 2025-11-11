import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import styles from "./DashboardPage.module.css";
import * as api from "../utils/api";

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.userId) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const data = await api.getPhotographerStats(user.userId);
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Welcome back, {user?.username}!</h1>
        </div>
      </div>

      <div className={styles.quickActions}>
        <div className={styles.actionGrid}>
          <Link to="/map" className={styles.imageCard}>
            <div className={styles.imageContent}>
              <div className={styles.imageTag}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
                <span>Map View</span>
              </div>
              <h3>Explore Photography Locations</h3>
            </div>
          </Link>

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

          <Link to="/shots" className={styles.actionCard}>
            <h3>View My Shots</h3>
            <p>Browse your shot history and statistics</p>
            <button className={styles.actionBtn}>My Shots</button>
          </Link>

          <Link to="/shots/new" className={styles.actionCard}>
            <h3>Log New Shot</h3>
            <p>Upload your latest photo shoot</p>
            <button className={styles.actionBtn}>Add Shot</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

DashboardPage.propTypes = {};

export default DashboardPage;
