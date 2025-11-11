import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./HomePage.module.css";

function HomePage() {
  const { user } = useAuth();
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const photos = [
    "../images/sample1.jpg",
    "../images/sample2.jpg",
    "../images/sample3.jpg",
    "../images/sample4.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.photoCarousel}>
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`${styles.photoSlide} ${
                index === currentPhoto ? styles.active : ""
              }`}
              style={{ backgroundImage: `url(${photo})` }}
            />
          ))}
          <div className={styles.overlay} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.contentBox}>
            <img
              src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=400&fit=crop"
              alt="Camera"
              className={styles.featuredImage}
            />

            <div className={styles.textContent}>
              <h1 className={styles.title}>OhSnap!</h1>
              <p className={styles.tagline}>
                Capture spots worth saying &apos;Oh Snap!&apos;
              </p>
              <p className={styles.description}>
                Discover hidden gem photography locations, log your shoots with
                detailed camera metadata, and help the community find the best
                spots based on style, time of day, and conditions.
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
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Get Started</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>1</div>
            <div>
              <h3>Create Your Account</h3>
              <p>
                Sign up and set up your photographer profile to start exploring
                and sharing locations.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}>2</div>
            <div>
              <h3>Discover Locations</h3>
              <p>
                Browse photography spots with GPS coordinates, best times of
                day, and details shared by the community.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}>3</div>
            <div>
              <h3>Log Your Shots</h3>
              <p>
                Document your photo shoots with camera metadata, weather, and
                conditions for future reference.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.icon}>4</div>
            <div>
              <h3>Track & Improve</h3>
              <p>
                Analyze your performance, learn from other photographers, and
                discover your most productive locations.
              </p>
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
