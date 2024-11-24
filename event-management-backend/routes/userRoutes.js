const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Import the User model
const bcrypt = require('bcrypt');

// CREATE: Add a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation checks
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Check for valid role
    if (!["organizer", "attendee"].includes(role)) {
      return res.status(400).json({ error: 'Invalid role provided' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE: Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the password if it's being updated
    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    // Update the user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: hashedPassword,
      role: role || user.role,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE: Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await user.destroy();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
