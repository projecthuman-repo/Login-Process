const express = require('express');
const bcrypt = require('bcrypt');
const xssFilters = require('xss-filters');
const emailValidator = require('email-validator');
const User = require('../models/user'); // Adjust if filename differs
const generateOTP = require('../utils/otpUtil');
const Email = require('../utils/email');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const cleanEmail = xssFilters.inHTMLData(req.body.email);
    const cleanPassword = xssFilters.inHTMLData(req.body.password);

    if (!emailValidator.validate(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const newUser = new User({
      email: cleanEmail,
      passwordHash: hashedPassword,
      otpCode,
      otpExpiresAt,
      firstName: "Temp", // Replace with req.body.firstName when frontend ready
      lastName: "User",
      username: cleanEmail.split('@')[0],
      phoneNumber: Date.now().toString()  // just for testing
      // Replace with req.body.phoneNumber when frontend ready
    });

    await newUser.save();

    const email = new Email(newUser, 'https://your-frontend-url.com/verify');
    await email.send('Your OTP Code', `Your OTP is: ${otpCode}`);

    res.status(201).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

router.post('/verify-otp', async (req, res) => {
  try {
    const cleanEmail = xssFilters.inHTMLData(req.body.email);
    const cleanOtp = xssFilters.inHTMLData(req.body.otp);

    const user = await User.findOne({ email: cleanEmail });

    console.log(`Stored OTP: ${user.otpCode}, Entered OTP: ${cleanOtp}`);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otpCode !== cleanOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const cleanEmail = xssFilters.inHTMLData(req.body.email);
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    const newOtp = generateOTP();
    user.otpCode = newOtp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const email = new Email(user, 'https://your-frontend-url.com/verify');
    await email.send('Your NEW OTP Code', `Your new OTP is: ${newOtp}`);

    console.log(`Resent OTP for ${cleanEmail}: ${newOtp}`);

    res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
