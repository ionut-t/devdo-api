require('dotenv').config();
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create user
exports.createUser = async (req, res) => {
  try {
    const hash = await bcryptjs.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash
    });
    const createdUser = await user.save();
    res.status(201).json({
      message: 'User created',
      user: createdUser
    });
  } catch (error) {
    res.status(500).json({
      message: 'A user with this email address already exists.'
    });
  }
};

// Log in user
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        message: 'Authentication failed. This email is not registered.'
      });
    }
    const result = await bcryptjs.compare(req.body.password, user.password);
    if (!result) {
      return res.status(401).json({
        message: 'Authentication failed. This email is not registered.'
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.status(200).json({
      message: 'Authentication succeeded',
      token: token,
      expiresIn: 28800
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Authentication failed. This email is not registered.'
    });
  }
};