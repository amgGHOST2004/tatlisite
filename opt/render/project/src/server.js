const express = require('express');
const adminRoutes = require('../../../../src/routes/admin');
const app = express();

// Other imports and middleware...

// Initialize the router
const router = express.Router();

// Use the router for admin routes
app.use('/api/admin', adminRoutes);

// Define your routes using the router
router.post('/login', async (req, res) => {
  // Your login logic here
});

// Add other routes as needed

// Use the router in your app
app.use('/', router);
// Other routes and server setup...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
