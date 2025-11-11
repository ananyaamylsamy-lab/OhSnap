import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './HomePage.module.css';

function HomePage() {
  const { user } = useAuth();
  const [currentPhoto, setCurrentPhoto] = useState(0);

  // Add your photo URLs here
  const photos = [
    'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop',
  ];

  // Auto-rotate photos every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos.length]);

  const goToPhoto = (index) => {
    setCurrentPhoto(index);
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        {/* Photo Carousel Background */}
        <div className={styles.photoCarousel}>
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`${styles.photoSlide} ${
                index === currentPhoto ? styles.active : ''
              }`}
              style={{ backgroundImage: `url(${photo})` }}
            />
          ))}
          <div className={styles.overlay} />
        </div>

        {/* Carousel Controls */}
        <div className={styles.carouselControls}>
          {photos.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentPhoto ? styles.activeDot : ''
              }`}
              onClick={() => goToPhoto(index)}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.title}>OhSnap!</h1>
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
                Sign Up 
              </Link>
              <Link to="/login" className={styles.ctaButtonSecondary}>
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <h2>Get Started</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>1</div>
            <div>
              <h3>Create Your Account</h3>
              <p>Sign up and set up your photographer profile to start exploring and sharing locations.</p>
            </div>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>2</div>
            <div>
              <h3>Discover Locations</h3>
              <p>Browse photography spots with GPS coordinates, best times of day, and details shared by the community.</p>
            </div>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>3</div>
            <div>
              <h3>Log Your Shots</h3>
              <p>Document your photo shoots with camera metadata, weather, and conditions for future reference.</p>
            </div>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.icon}>4</div>
            <div>
              <h3>Track & Improve</h3>
              <p>Analyze your performance, learn from other photographers, and discover your most productive locations.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        <p>© 2025 OhSnap! Made with ❤️ by Ananyaa and Manasha</p>
      </footer>
    </div>
  );
}

HomePage.propTypes = {};

export default HomePage;