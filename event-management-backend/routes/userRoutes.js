const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Import the User model
const bcrypt = require('bcrypt');
const db = require('../config/db');

// CREATE: Add a new user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  const values = [name, email, hashedPassword, role];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  });
});

// LOGIN: Authenticate a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  return res.status(200).json({ message: 'User authenticated successfully', userId: user.id });
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
