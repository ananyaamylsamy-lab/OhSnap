import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useShots } from "../hooks/useShots.jsx";
import ShotCard from "../components/ShotCard";
import * as api from "../utils/api";
import styles from "./PhotographerProfilePage.module.css";

function PhotographerProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { shots, loading: shotsLoading } = useShots({ userId });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getPhotographerStats(userId);
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const isOwnProfile = currentUser?.userId === userId;

  if (loading || shotsLoading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>📷</div>
          <div>
            <h1 className={styles.username}>
              {shots.length > 0 ? shots[0].username : "Photographer"}
            </h1>
            {isOwnProfile && <span className={styles.badge}>Your Profile</span>}
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.totalShots || 0}</div>
          <div className={styles.statLabel}>Total Shots</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.averageRating || 0}</div>
          <div className={styles.statLabel}>Average Rating</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.favoriteCamera || "-"}</div>
          <div className={styles.statLabel}>Favorite Camera</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats?.favoriteLens || "-"}</div>
          <div className={styles.statLabel}>Favorite Lens</div>
        </div>
      </div>

      {stats?.topLocations && stats.topLocations.length > 0 && (
        <div className={styles.topLocations}>
          <h2>Top Locations</h2>
          <div className={styles.locationList}>
            {stats.topLocations.map((loc, index) => (
              <div key={loc.locationId} className={styles.locationItem}>
                <span className={styles.locationRank}>#{index + 1}</span>
                <span className={styles.locationCount}>{loc.count} shots</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.gallery}>
        <h2>Photo Gallery</h2>
        {shots.length === 0 ? (
          <div className={styles.empty}>
            <p>No public shots yet</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {shots.map((shot) => (
              <ShotCard key={shot._id} shot={shot} showPhotographer={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

PhotographerProfilePage.propTypes = {};

export default PhotographerProfilePage;
