import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import BirthCertificate from './model.js';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// ✅ Improved MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for Birth Certificate Data');
  } catch (error) {
    console.error('❌ DB connection error:', error);
    process.exit(1); // Stop server if DB connection fails
  }
};

connectDB();

// API to check for duplicates
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

// API to submit data
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

// API to search Birth Certificates
app.get('/api/search', async (req, res) => {
  const { type, query } = req.query;

  if (!type || !query) {
    return res.status(400).json({ message: 'Missing search parameters' });
  }

  try {
    let filter = {};

    if (type === 'motherName') {
      filter = { motherName: { $regex: query, $options: 'i' } };
    } else if (type === 'motherAadhar') {
      filter = { motherAadhar: query };
    } else if (type === 'birthDate') {
      filter = { birthDate: query };
    } else if (type === 'city') {
      filter = { city: { $regex: query, $options: 'i' } };
    } else {
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

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
