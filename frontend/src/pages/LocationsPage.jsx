import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocations } from "../hooks/useLocations";
import LocationCard from "../components/LocationCard";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import styles from "./LocationsPage.module.css";

export default function LocationsPage() {
  const {
    locations,
    loading,
    error,
    pagination,
    getLocations,
    removeLocation,
  } = useLocations();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    style: "",
    timeOfDay: "",
    season: "",
    difficulty: "",
    accessibility: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const searchParams = {};
    if (searchTerm) searchParams.search = searchTerm;
    if (filters.city) searchParams.city = filters.city;
    if (filters.style) searchParams.style = filters.style;
    if (filters.timeOfDay) searchParams.timeOfDay = filters.timeOfDay;
    if (filters.season) searchParams.season = filters.season;
    if (filters.difficulty) searchParams.difficulty = filters.difficulty;
    if (filters.accessibility)
      searchParams.accessibility = filters.accessibility;

    getLocations(searchParams, currentPage);
  }, [searchTerm, filters, currentPage, getLocations]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      city: "",
      style: "",
      timeOfDay: "",
      season: "",
      difficulty: "",
      accessibility: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await removeLocation(id);
    } catch (err) {
      alert("Failed to delete location");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Photography Locations</h1>
        <Link to="/add-location" className={styles.addButton}>
          + Add Location
        </Link>
      </div>

      <div className={styles.searchSection}>
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by name or description..."
        />
      </div>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <FilterPanel
            onFilter={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        <main className={styles.main}>
          {error && <div className={styles.error}>{error}</div>}

          {loading && <div className={styles.loading}>Loading locations...</div>}

          {!loading && locations.length === 0 && (
            <div className={styles.empty}>
              <p>No locations found. Try adjusting your filters.</p>
            </div>
          )}

          {!loading && locations.length > 0 && (
            <>
              <div className={styles.resultsInfo}>
              </div>

              <div className={styles.grid}>
                {locations.map((location) => (
                  <LocationCard
                    key={location._id}
                    location={location}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`${styles.pageButton} ${
                          currentPage === page ? styles.active : ""
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(pagination.pages, p + 1)
                      )
                    }
                    disabled={currentPage === pagination.pages}
                    className={styles.pageButton}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}