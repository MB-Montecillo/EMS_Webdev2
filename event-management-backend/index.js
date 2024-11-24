const express = require('express');
const bookingRoutes = require('./routes/bookingRoutes.js'); // Import the route
const eventRoutes = require('./routes/eventRoutes.js'); // Import the event routes
const userRoutes = require('./routes/userRoutes.js'); // Import the user routes

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes for booking, event and user routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.use("/register", require("./routes/userRoutes"));
app.use("/login", require("./routes/userRoutes"));
app.use("/events", require("./routes/eventRoutes"));
app.use("/bookings", require("./routes/bookingRoutes"));

const cors = require('cors');
app.use(cors());
