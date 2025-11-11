import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useShots } from '../hooks/useShots.jsx';
import ShotCard from '../components/ShotCard';
import styles from './MyShotsPage.module.css';

function MyShotsPage() {
  const { user } = useAuth();
  const { shots, loading, error } = useShots(
    user?.userId ? { userId: user.userId } : {}
  );

  if (loading) {
    return <div className="loading">Loading your shots...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Shots 📷</h1>
        <Link to="/shots/new" className={styles.addBtn}>
          + Log New Shot
        </Link>
      </div>

      {shots.length === 0 ? (
        <div className={styles.empty}>
          <p>No shots logged yet!</p>
          <Link to="/shots/new" className={styles.emptyBtn}>
            Log Your First Shot
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {shots.map((shot) => (
            <ShotCard key={shot._id} shot={shot} showPhotographer={false} />
          ))}
        </div>
      )}
    </div>
  );
}

MyShotsPage.propTypes = {};

export default MyShotsPage;