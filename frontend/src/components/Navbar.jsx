import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import PropTypes from 'prop-types';
import styles from './Navbar.module.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          OhSnap!
        </Link>
        
        <div className={styles.links}>
          {user ? (
            <>
              <Link to="/dashboard" className={styles.link}>Dashboard</Link>
              
              {/* TODO: Ananyaa - Add shot navigation links */}
              {/* <Link to="/shots" className={styles.link}>My Shots</Link> */}
              {/* <Link to="/shots/new" className={styles.link}>Log Shot</Link> */}
              
              {/* Manasha - Location navigation links */}
              <Link to="/locations" className={styles.link}>Locations</Link>
              <Link to="/add-location" className={styles.link}>+ Add Location</Link>
              
              <span className={styles.username}>👤 {user.username}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>Login</Link>
              <Link to="/signup" className={styles.link}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {};

export default Navbar;