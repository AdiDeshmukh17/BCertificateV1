import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import BirthCertificate from './model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT; // ✅ Use dynamic PORT for Render

app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for Birth Certificate Data');
  } catch (error) {
    console.error('❌ DB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// ✅ API Routes

app.post('/api/check-duplicate', async (req, res) => {
  const { motherName, fatherName, birthDate } = req.body;
  try {
    const existingRecord = await BirthCertificate.findOne({ motherName, fatherName, birthDate });
    if (existingRecord) {
      return res.status(400).json({ message: 'Duplicate record found' });
    }
    res.json({ message: 'No duplicate record found' });
  } catch (error) {
    console.error('Error checking duplicate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/submit', async (req, res) => {
  try {
    const newRecord = new BirthCertificate(req.body);
    await newRecord.save();
    res.status(201).json({ message: 'Data added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting data' });
  }
});

app.get('/api/search', async (req, res) => {
  const { type, query } = req.query;

  if (!type || !query) {
    return res.status(400).json({ message: 'Missing search parameters' });
  }

  try {
    let filter = {};

    switch (type) {
      case 'motherName':
        filter = { motherName: { $regex: query, $options: 'i' } };
        break;
      case 'motherAadhar':
        filter = { motherAadhar: query };
        break;
      case 'birthDate':
        filter = { birthDate: query };
        break;
      case 'city':
        filter = { city: { $regex: query, $options: 'i' } };
        break;
      default:
        return res.status(400).json({ message: 'Invalid search type' });
    }

    const results = await BirthCertificate.find(filter);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No records found' });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching records' });
  }
});

// ✅ Root Test Route
app.get('/', (req, res) => {
  res.send('🌐 Backend is up and running!');
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
