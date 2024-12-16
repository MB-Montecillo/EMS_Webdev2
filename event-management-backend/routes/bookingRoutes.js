const express = require('express');
const router = express.Router();
const { Booking, Event } = require('../models'); // Import the Booking and Event models

// CREATE: Add a new booking
router.post('/', async (req, res) => {
  try {
    const { event_id, user_id, booking_date, slots_reserved } = req.body;

    // Validation checks
    if (!event_id || !user_id || !slots_reserved || !booking_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check available slots before booking
    if (event.available_slots < slots_reserved) {
      return res.status(400).json({ error: 'Not enough available slots' });
    }

    // Create the booking
    const newBooking = await Booking.create({
      event_id,
      user_id,
      booking_date,
      slots_reserved,
    });

    // Update available slots in the Event table
    await event.update({
      available_slots: event.available_slots - slots_reserved,
    });

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
    const { user_id, event_id, booking_date, slots_reserved } = req.body;

    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Find the event to check available slots
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // If the slots reserved have changed, update the event's available slots
    const previousSlotsReserved = booking.slots_reserved;

    if (previousSlotsReserved !== slots_reserved) {
      const slotDifference = slots_reserved - previousSlotsReserved;

      // Check if there are enough available slots for the updated booking
      if (event.available_slots < slotDifference) {
        return res.status(400).json({ error: 'Not enough available slots for this booking' });
      }

      // Update the event's available slots
      await event.update({
        available_slots: event.available_slots - slotDifference
      });
    }

    // Update the booking
    await booking.update({ user_id, event_id, booking_date, slots_reserved });

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

    // Find the associated event to update the available slots
    const event = await Event.findByPk(booking.event_id);

    // Update the event's available slots
    await event.update({
      available_slots: event.available_slots + booking.slots_reserved
    });

    // Delete the booking
    await booking.destroy();
    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;