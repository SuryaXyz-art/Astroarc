const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/astrotalk', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const chartRoutes = require('./routes/chart');
const aiRoutes = require('./routes/ai');
const compatRoutes = require('./routes/compatibility');
app.use('/api/auth', authRoutes);
app.use('/api/chart', chartRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/compatibility', compatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'AstroTalk Backend is running', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
