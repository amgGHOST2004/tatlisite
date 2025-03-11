const express = require('express');
const app = express();
const adminRoutes = require('./src/routes/admin');

// Other imports and middleware...

app.use('/api/admin', adminRoutes);

// Other routes and server setup...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});