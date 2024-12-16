const express = require('express');
const router = express.Router();
const multer = require('multer');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pictures/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use timestamp + original name for uniqueness
  },
});
const upload = multer({ storage });

// Middleware to authenticate the user using JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// CREATE: Add a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN: Authenticate a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Include the user role in the JWT
    const token = jwt.sign(
      {
        userId: user.user_id,  // The user's ID
        role: user.role,        // Add the user's role
      },
      'your-secret-key',        // Use your actual secret key or environment variable
      { expiresIn: '1h' }      // Set token expiration
    );

    return res.status(200).json({
      message: 'User authenticated successfully',
      token,
      userId: user.user_id,
      role: user.role,         // Optionally you can also return the role in the response
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET: Get the logged-in user's information
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// READ: Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
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
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE: Update a user by ID (including profile picture)
router.put('/:id', upload.single('profile_picture'), async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    await user.update({
      name: name || user.name,
      email: email || user.email,
      password: hashedPassword,
      role: role || user.role,
      profile_picture: req.file ? req.file.path : user.profile_picture, // Update profile picture if uploaded
    });

    return res.status(200).json(user);
  } catch (error) {
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

    await user.destroy();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// UPLOAD: Upload or update profile picture for a user
router.post('/:id/upload-profile', upload.single('profile_picture'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      profile_picture: req.file.path,
    });

    return res.status(200).json({ message: 'Profile picture updated successfully', user });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Profile Picture
router.delete('/:id/profile-picture', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the path to the current profile picture
    const profilePicturePath = user.profile_picture;

    // Check if the file exists and remove it
    if (profilePicturePath) {
      const filePath = path.join(__dirname, '..', profilePicturePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete file' });
        }
      });
    }

    // Update the user's profile picture to null
    await user.update({
      profile_picture: null, // Or use an empty string if preferred
    });

    return res.status(200).json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;