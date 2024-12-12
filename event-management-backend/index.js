const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import path for file serving

const bookingRoutes = require('./routes/bookingRoutes.js'); // Import the route
const eventRoutes = require('./routes/eventRoutes.js'); // Import the event routes
const userRoutes = require('./routes/userRoutes.js'); // Import the user routes
const locationRoutes = require('./routes/locationRoutes.js'); // Import location routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware to serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes for booking, event, user, and location routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
