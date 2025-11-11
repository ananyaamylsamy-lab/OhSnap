import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import MyShotsPage from './pages/MyShotsPage';
import AddShotPage from './pages/AddShotPage';
import ShotDetailPage from './pages/ShotDetailPage';
import PhotographerProfilePage from './pages/PhotographerProfilePage';
import LocationsPage from './pages/LocationsPage';
import AddLocationPage from './pages/AddLocationPage';
import LocationDetailPage from './pages/LocationDetailPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/shots" element={<ProtectedRoute><MyShotsPage /></ProtectedRoute>} />
          <Route path="/shots/new" element={<ProtectedRoute><AddShotPage /></ProtectedRoute>} />
          <Route path="/shots/:id" element={<ProtectedRoute><ShotDetailPage /></ProtectedRoute>} />
          <Route path="/photographer/:userId" element={<PhotographerProfilePage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route 
            path="/add-location" 
            element={
              <ProtectedRoute>
                <AddLocationPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/locations/:id" element={<LocationDetailPage />} />
          
          {/* 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;