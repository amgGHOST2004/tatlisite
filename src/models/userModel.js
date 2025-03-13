const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'Username must be at least 5 characters long']
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Only validate password if it is being set or modified
        if (this.isModified('password')) {
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
        }
        return true;
      },
      message: props => 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;