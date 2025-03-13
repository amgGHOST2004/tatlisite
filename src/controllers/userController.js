const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

async function registerUser(req, res) {
  try {
    const { username, password, email } = req.body;
    console.log('Request body:', req.body); // Log the request body
    if (!username || !password || !email) {
      console.log('Missing fields:', { username, password, email }); // Log missing fields
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Böyle bir hesap zaten var, şifrenizi unuttuysanız: <a href="/forgot-password.html">şifremi unuttum</a> ile şifrenizi yenileyebilirsiniz.' });
    }

    // Validate username and password
    if (username.length < 5) {
      return res.status(400).json({ message: 'Username must be at least 5 characters long' });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-+,.])[A-Za-z\d@$!%*?&\-+,.]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character' });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error); // Log the error
    res.status(400).json({ message: 'Error registering user: ' + error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    console.log('Request body:', req.body); // Log the request body
    if (!username || !password) {
      console.log('Missing fields:', { username, password }); // Log missing fields
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Set the user in the session
    req.session.user = user; // Create a session
    console.log('Session created:', req.session.user); // Log the session

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in user:', error); // Log the error
    res.status(400).json({ message: 'Error logging in user: ' + error.message });
  }
}

function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err); // Log the error
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logout successful', redirect: '/index.html' });
  });
}



async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account with that email address exists.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/reset-password.html?token=${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Error sending password reset email: ' + error.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully. Redirecting to login page...' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password: ' + error.message });
  }
}

module.exports = { registerUser, loginUser, logoutUser, forgotPassword, resetPassword };