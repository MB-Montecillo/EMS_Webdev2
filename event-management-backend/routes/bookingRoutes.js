const express = require('express');
const router = express.Router();
const { Booking } = require('../models'); // Import the Booking model

// CREATE: Add a new booking
router.post('/', async (req, res) => {
  try {
    const { user_id, event_id, booking_date } = req.body;

    // Validation checks
    if (!user_id || !event_id) {
      return res.status(400).json({ error: 'User ID and Event ID are required' });
    }

    const newBooking = await Booking.create({ user_id, event_id, booking_date });
    return res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get a single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE: Update a booking by ID
router.put('/:id', async (req, res) => {
  try {
    const { user_id, event_id, booking_date } = req.body;

    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update the booking
    await booking.update({ user_id, event_id, booking_date });
    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE: Delete a booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Delete the booking
    await booking.destroy();
    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
