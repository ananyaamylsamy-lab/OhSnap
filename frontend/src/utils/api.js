const API_URL = "/api";

// Generic request handler
async function request(endpoint, options = {}) {
  const config = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ============ AUTH ENDPOINTS ============
export const signup = (userData) => {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const login = (credentials) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const logout = () => {
  return request("/auth/logout", {
    method: "POST",
  });
};

export const getCurrentUser = () => {
  return request("/auth/me");
};

export const updateProfile = (profileData) => {
  return request("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

// ============ SHOT ENDPOINTS (Ananyaa) ============
export const createShot = (shotData) => {
  return request("/shots", {
    method: "POST",
    body: JSON.stringify(shotData),
  });
};

export const fetchShots = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return request(`/shots${query ? `?${query}` : ""}`);
};

export const fetchShotById = (id) => {
  return request(`/shots/${id}`);
};

export const updateShot = (id, updates) => {
  return request(`/shots/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

export const deleteShot = (id) => {
  return request(`/shots/${id}`, {
    method: "DELETE",
  });
};

export const getPhotographerStats = (userId) => {
  return request(`/shots/stats/${userId}`);
};

export const getShotsByLocation = (locationId) => {
  return request(`/shots/by-location/${locationId}`);
};

// ============ LOCATION ENDPOINTS (Manasha) ============
export const createLocation = (locationData) => {
  return request("/locations", {
    method: "POST",
    body: JSON.stringify(locationData),
  });
};

export const fetchLocations = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return request(`/locations${query ? `?${query}` : ""}`);
};

export const fetchLocationById = (id) => {
  return request(`/locations/${id}`);
};

export const updateLocation = (id, updates) => {
  return request(`/locations/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
};

export const deleteLocation = (id) => {
  return request(`/locations/${id}`, {
    method: "DELETE",
  });
};