import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useShots } from "../hooks/useShots.jsx";
import ShotCard from "../components/ShotCard";
import SearchBar from "../components/SearchBar";
import styles from "./MyShotsPage.module.css";

function MyShotsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { shots, loading, error } = useShots(
    user?.userId ? { userId: user.userId } : {},
  );

  const stats = useMemo(() => {
    if (!shots || shots.length === 0) {
      return {
        totalShots: 0,
        topLocations: [],
        favoriteCamera: "-",
        averageRating: 0,
      };
    }

    const totalShots = shots.length;

    // Get unique locations
    const uniqueLocations = [
      ...new Set(shots.map((s) => s.locationName).filter(Boolean)),
    ];

    // Find most common camera
    const cameras = shots.map((s) => s.cameraModel).filter(Boolean);
    let favoriteCamera = "-";
    if (cameras.length > 0) {
      const cameraCount = {};
      cameras.forEach((camera) => {
        cameraCount[camera] = (cameraCount[camera] || 0) + 1;
      });
      favoriteCamera = Object.keys(cameraCount).reduce((a, b) =>
        cameraCount[a] > cameraCount[b] ? a : b,
      );
    }

    // Calculate average rating
    const totalRating = shots.reduce(
      (acc, shot) => acc + (shot.rating || 0),
      0,
    );
    const averageRating =
      totalShots > 0 ? (totalRating / totalShots).toFixed(1) : 0;

    return {
      totalShots,
      topLocations: uniqueLocations,
      favoriteCamera,
      averageRating,
    };
  }, [shots]);

  const filteredShots = shots.filter((shot) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      shot.cameraModel?.toLowerCase().includes(search) ||
      shot.lens?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <div className="loading">Loading your shots...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>My Shots</h1>
          <p>Track and manage your shots</p>
        </div>
        <Link to="/shots/new" className={styles.addBtn}>
          + Log New Shot
        </Link>
      </div>

      <div className={styles.statsSection}>
        <h2>MY STATS</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalShots}</div>
            <div className={styles.statLabel}>Total Shots</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.topLocations.length}</div>
            <div className={styles.statLabel}>Locations Visited</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.favoriteCamera}</div>
            <div className={styles.statLabel}>Favorite Camera</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.averageRating}</div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
        </div>
      </div>

      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search by camera or lens..."
      />

      {filteredShots.length === 0 ? (
        <div className={styles.empty}>
          <p>No shots found!</p>
          <Link to="/shots/new" className={styles.emptyBtn}>
            Log Your First Shot
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredShots.map((shot) => (
            <ShotCard key={shot._id} shot={shot} showPhotographer={false} />
          ))}
        </div>
      )}
    </div>
  );
}

MyShotsPage.propTypes = {};

export default MyShotsPage;
