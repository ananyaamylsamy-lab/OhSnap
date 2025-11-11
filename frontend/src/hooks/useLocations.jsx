import { useState, useCallback, useEffect } from "react";
import {
  createLocation,
  fetchLocations,
  fetchLocationById,
  updateLocation,
  deleteLocation,
} from "../utils/api";

export const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch all locations with filters
  const getLocations = useCallback(async (filters = {}, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLocations({
        ...filters,
        page,
        limit: pagination.limit,
      });
      setLocations(data.locations);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching locations:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  // Fetch single location
  const getLocationById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLocationById(id);
      setCurrentLocation(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching location:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create location
  const addLocation = useCallback(async (locationData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createLocation(locationData);
      setLocations((prev) => [data.location, ...prev]);
      return data.location;
    } catch (err) {
      setError(err.message);
      console.error("Error creating location:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update location
  const editLocation = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateLocation(id, updates);
      setLocations((prev) =>
        prev.map((loc) => (loc._id === id ? data.location : loc))
      );
      if (currentLocation?._id === id) {
        setCurrentLocation(data.location);
      }
      return data.location;
    } catch (err) {
      setError(err.message);
      console.error("Error updating location:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLocation?._id]);

  // Delete location
  const removeLocation = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((loc) => loc._id !== id));
      if (currentLocation?._id === id) {
        setCurrentLocation(null);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error deleting location:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentLocation?._id]);

  return {
    locations,
    currentLocation,
    loading,
    error,
    pagination,
    getLocations,
    getLocationById,
    addLocation,
    editLocation,
    removeLocation,
  };
};