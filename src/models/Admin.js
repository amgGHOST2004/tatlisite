const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth'); // Adjust the path as necessary

router.get('/check-auth', auth, async (req, res) => {
  try {
    // Your route logic here
    res.status(200).json({ message: 'Authenticated' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
