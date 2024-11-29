const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes.js'); // Import the route
const eventRoutes = require('./routes/eventRoutes.js'); // Import the event routes
const userRoutes = require('./routes/userRoutes.js'); // Import the user routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Routes for booking, event and user routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

//Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
