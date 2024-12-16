const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 

const bookingRoutes = require('./routes/bookingRoutes.js'); 
const eventRoutes = require('./routes/eventRoutes.js'); 
const userRoutes = require('./routes/userRoutes.js'); 
const locationRoutes = require('./routes/locationRoutes.js'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
