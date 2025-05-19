const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

dotenv.config();

const app = express();
app.use(express.json());

//const cors = require('cors');
//app.use(cors());

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Koneksi ke MongoDB berhasil'))
  .catch(err => console.error('Gagal koneksi ke MongoDB:', err));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
