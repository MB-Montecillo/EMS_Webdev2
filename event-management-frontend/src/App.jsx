import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from "./components/Navbar";
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import EventForm from './components/EventForm';  
import EditEvent from './components/EditEvent'; 
import BookingsList from './components/BookingsList'; 
import LocationList from './components/LocationList'; 
import Profile from './components/Profile';
import NotFound from './pages/NotFound';
import { isAuthenticated, getCurrentUser } from './services/auth';

const PrivateRoute = ({ element, role }) => {
  const user = getCurrentUser();
  const userRole = user ? user.role : null;
  return (
    isAuthenticated() && (!role || userRole === role) ? (
      element
    ) : (
      <Navigate to="/login" />
    )
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/events" element={<PrivateRoute element={<EventList />} />} />
        <Route path="/events/new" element={<PrivateRoute element={<EventForm />} />} />
        <Route path="/events/:id" element={<PrivateRoute element={<EventDetails />} />} />
        <Route path="/events/edit/:id" element={<PrivateRoute element={<EditEvent />} />} /> {/* Added edit route */}
        <Route path="/bookings" element={<PrivateRoute element={<BookingsList />} />} />
        <Route path="/locations" element={<PrivateRoute element={<LocationList />} role="organizer" />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
