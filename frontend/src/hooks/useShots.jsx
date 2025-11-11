import { useState, useEffect } from "react";
import * as api from "../utils/api";

export function useShots(filters = {}) {
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadShots();
  }, [JSON.stringify(filters)]);

  const loadShots = async () => {
    try {
      setLoading(true);
      const data = await api.fetchShots(filters);
      setShots(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createShot = async (shotData) => {
    const response = await api.createShot(shotData);
    await loadShots();
    return response;
  };

  const updateShot = async (id, updates) => {
    const response = await api.updateShot(id, updates);
    await loadShots();
    return response;
  };

  const deleteShot = async (id) => {
    const response = await api.deleteShot(id);
    await loadShots();
    return response;
  };

  return {
    shots,
    loading,
    error,
    createShot,
    updateShot,
    deleteShot,
    refresh: loadShots,
  };
}
