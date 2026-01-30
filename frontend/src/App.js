import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './Components/layout/Navbar';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import CourseFormPage from './pages/CourseFormPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CourseBuilder from './pages/CourseBuilder';
import './styles/App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

// Trainer Only Route
const TrainerRoute = ({ children }) => {
  const { user, isTrainer, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isTrainer()) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Access denied. This page is only accessible to trainers and admins.
        </div>
      </div>
    );
  }

  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/courses" /> : <LoginPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/courses" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Trainer Only Routes */}
        <Route
          path="/courses/create"
          element={
            <TrainerRoute>
              <CourseFormPage />
            </TrainerRoute>
          }
        />

        <Route
          path="/courses/:id/edit"
          element={
            <TrainerRoute>
              <CourseFormPage isEdit={true} />
            </TrainerRoute>
          }
        />

        <Route
          path="/courses/:id/builder"
          element={
            <TrainerRoute>
              <CourseBuilder />
            </TrainerRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div className="container"><h1>404 - Page Not Found</h1></div>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;