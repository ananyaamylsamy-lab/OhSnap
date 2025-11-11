import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import * as api from '../utils/api';
import PropTypes from 'prop-types';
import styles from './ShotDetailPage.module.css';

function ShotDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shot, setShot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    loadShot();
  }, [id]);

  const loadShot = async () => {
    try {
      setLoading(true);
      const data = await api.fetchShotById(id);
      setShot(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteShot(id);
      navigate('/shots');
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
};

  const handleEdit = () => {
    setEditFormData({
      weather: shot.weather || '',
      description: shot.description || '',
      cameraModel: shot.cameraModel || '',
      lens: shot.lens || '',
      aperture: shot.aperture || '',
      shutterSpeed: shot.shutterSpeed || '',
      iso: shot.iso || '',
      rating: shot.rating || 0,
      isPrivate: shot.isPrivate || false,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updates = {
        ...editFormData,
        aperture: editFormData.aperture ? parseFloat(editFormData.aperture) : null,
        iso: editFormData.iso ? parseInt(editFormData.iso) : null,
        rating: parseFloat(editFormData.rating),
      };
      await api.updateShot(id, updates);
      setShowEditModal(false);
      await loadShot(); // Reload to show updates
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading shot details...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <Link to="/shots">Back to My Shots</Link>
      </div>
    );
  }

  if (!shot) {
    return <div className={styles.error}>Shot not found</div>;
  }

  const isOwner = user?.userId && shot?.userId && 
    (user.userId === shot.userId.toString() || user.userId === shot.userId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/shots" className={styles.backBtn}>← Back to My Shots</Link>
        {isOwner && (
          <div className={styles.actions}>
            <button onClick={handleEdit} className={styles.editBtn}>
              Edit
            </button>
            <button onClick={handleDelete} className={styles.deleteBtn}>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.gallery}>
          {shot.photos && shot.photos.length > 0 ? (
            shot.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${shot.cameraModel} - ${index + 1}`}
                className={styles.photo}
              />
            ))
          ) : (
            <div className={styles.noPhoto}>📷 No photos</div>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.mainInfo}>
            <h1 className={styles.camera}>{shot.cameraModel}</h1>
            {shot.rating > 0 && (
              <div className={styles.rating}>
                ⭐ {shot.rating} / 5
              </div>
            )}
          </div>

          <div className={styles.metadata}>
            <div className={styles.metaSection}>
              <h2>Camera Settings</h2>
              <div className={styles.metaGrid}>
                {shot.lens && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Lens</span>
                    <span className={styles.metaValue}>{shot.lens}</span>
                  </div>
                )}
                {shot.aperture && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Aperture</span>
                    <span className={styles.metaValue}>f/{shot.aperture}</span>
                  </div>
                )}
                {shot.shutterSpeed && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Shutter Speed</span>
                    <span className={styles.metaValue}>{shot.shutterSpeed}</span>
                  </div>
                )}
                {shot.iso && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>ISO</span>
                    <span className={styles.metaValue}>{shot.iso}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.metaSection}>
              <h2>Shoot Details</h2>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Date</span>
                  <span className={styles.metaValue}>{formatDate(shot.date)}</span>
                </div>
                {shot.weather && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Weather</span>
                    <span className={styles.metaValue}>{shot.weather}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Photographer</span>
                  <span className={styles.metaValue}>{shot.username}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Privacy</span>
                  <span className={styles.metaValue}>
                    {shot.isPrivate ? '🔒 Private' : '🌐 Public'}
                  </span>
                </div>
              </div>
            </div>

            {shot.description && (
              <div className={styles.metaSection}>
                <h2>Description</h2>
                <p className={styles.description}>{shot.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className={styles.modal} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Shot</h2>
              <button onClick={() => setShowEditModal(false)} className={styles.modalClose}>
                &times;
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label>Camera Model</label>
                <input
                  type="text"
                  name="cameraModel"
                  value={editFormData.cameraModel}
                  onChange={handleEditChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Lens</label>
                <input
                  type="text"
                  name="lens"
                  value={editFormData.lens}
                  onChange={handleEditChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Aperture</label>
                  <input
                    type="number"
                    step="0.1"
                    name="aperture"
                    value={editFormData.aperture}
                    onChange={handleEditChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Shutter Speed</label>
                  <input
                    type="text"
                    name="shutterSpeed"
                    value={editFormData.shutterSpeed}
                    onChange={handleEditChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>ISO</label>
                  <input
                    type="number"
                    name="iso"
                    value={editFormData.iso}
                    onChange={handleEditChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Weather</label>
                <input
                  type="text"
                  name="weather"
                  value={editFormData.weather}
                  onChange={handleEditChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className={styles.textarea}
                  rows="4"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="5"
                    name="rating"
                    value={editFormData.rating}
                    onChange={handleEditChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="isPrivate"
                      checked={editFormData.isPrivate}
                      onChange={handleEditChange}
                      className={styles.checkbox}
                    />
                    Private
                  </label>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modal} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Delete Shot?</h2>
              <button onClick={() => setShowDeleteModal(false)} className={styles.modalClose}>
                &times;
              </button>
            </div>
            
            <div className={styles.deleteWarning}>
              <p>Are you sure you want to delete this shot permanently?</p>
              <p className={styles.warningText}>This action cannot be undone.</p>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className={styles.deleteConfirmBtn}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ShotDetailPage.propTypes = {};

export default ShotDetailPage;