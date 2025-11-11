import { Link } from "react-router-dom";
import { useState } from "react";
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
        <h1>My Shots</h1>
        <Link to="/shots/new" className={styles.addBtn}>
          + Log New Shot
        </Link>
      </div>

      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search by camera or lens..."
      />

      {filteredShots.length === 0 ? (
        <div className={styles.empty}>
          <p>No shots logged yet!</p>
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
