import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShots } from '../hooks/useShots.jsx';
import * as api from '../utils/api';
import styles from './AddShotPage.module.css';

function AddShotPage() {
  const navigate = useNavigate();
  const { createShot } = useShots();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    locationId: '',
    date: new Date().toISOString().split('T')[0],
    weather: '',
    description: '',
    cameraModel: '',
    lens: '',
    aperture: '',
    shutterSpeed: '',
    iso: '',
    photos: '',
    rating: 0,
    isPrivate: false,
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await api.fetchLocations();
      setLocations(data.locations || data || []);
    } catch (err) {
      console.error('Error loading locations:', err);
      setError('Failed to load locations. Please ensure locations are available.');
      setLocations([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const shotData = {
        ...formData,
        aperture: formData.aperture ? parseFloat(formData.aperture) : null,
        iso: formData.iso ? parseInt(formData.iso) : null,
        rating: parseFloat(formData.rating),
        photos: formData.photos ? formData.photos.split(',').map(p => p.trim()) : [],
      };

      await createShot(shotData);
      navigate('/shots');
    } catch (err) {
      setError(err.message || 'Failed to log shot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Log New Shot 📷</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>Location & Date</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="locationId" className={styles.label}>
              Location *
            </label>
            <select
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Select a location</option>
              {Array.isArray(locations) && locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date" className={styles.label}>
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="weather" className={styles.label}>
              Weather
            </label>
            <input
              type="text"
              id="weather"
              name="weather"
              value={formData.weather}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., Sunny, Cloudy, Golden hour"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Camera Settings</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="cameraModel" className={styles.label}>
              Camera Model *
            </label>
            <input
              type="text"
              id="cameraModel"
              name="cameraModel"
              value={formData.cameraModel}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., Canon 5D Mark IV"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lens" className={styles.label}>
              Lens
            </label>
            <input
              type="text"
              id="lens"
              name="lens"
              value={formData.lens}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., 24-70mm f/2.8"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="aperture" className={styles.label}>
                Aperture (f-stop)
              </label>
              <input
                type="number"
                step="0.1"
                id="aperture"
                name="aperture"
                value={formData.aperture}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., 2.8"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="shutterSpeed" className={styles.label}>
                Shutter Speed
              </label>
              <input
                type="text"
                id="shutterSpeed"
                name="shutterSpeed"
                value={formData.shutterSpeed}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., 1/500"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="iso" className={styles.label}>
                ISO
              </label>
              <input
                type="number"
                id="iso"
                name="iso"
                value={formData.iso}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., 400"
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Details</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Notes about this shoot..."
              rows="4"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="photos" className={styles.label}>
              Photo URLs (comma-separated)
            </label>
            <input
              type="text"
              id="photos"
              name="photos"
              value={formData.photos}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="rating" className={styles.label}>
                Rating (0-5)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="5"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                Make this shot private
              </label>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/shots')}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging...' : 'Log Shot'}
          </button>
        </div>
      </form>
    </div>
  );
}

AddShotPage.propTypes = {};

export default AddShotPage;