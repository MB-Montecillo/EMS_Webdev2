import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from "./components/Navbar";

import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import EventForm from './components/EventForm';  // New component for creating events
import BookingsList from './components/BookingsList'; // Import the new component
import Profile from './components/Profile';
import NotFound from './pages/NotFound';
import { isAuthenticated } from './services/auth';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/events" element={isAuthenticated() ? <EventList /> : <Navigate to="/login" />} />
        <Route path="/events/new" element={isAuthenticated() ? <EventForm /> : <Navigate to="/login" />} /> {/* New route for creating events */}
        <Route path="/events/:id" element={isAuthenticated() ? <EventDetails /> : <Navigate to="/login" />} />
        <Route path="/bookings" element={isAuthenticated() ? <BookingsList /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
