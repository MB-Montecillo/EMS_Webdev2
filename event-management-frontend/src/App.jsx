import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from "./components/Navbar";

import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
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
        <Route path="/events/:id" element={isAuthenticated() ? <EventDetails /> : <Navigate to="/login" />} />
        <Route path="/bookings" element={isAuthenticated() ? <BookingsList /> : <Navigate to="/login" />} /> {/* New Bookings route */}
        <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;