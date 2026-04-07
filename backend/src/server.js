const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const authRoutes = require('./routes/auth');
const trackerRoutes = require('./routes/tracker');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const dbRetryMs = Number(process.env.DB_RETRY_MS || 5000);

let dbConnected = false;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ ok: true, service: 'leetcode-tracer-api', dbConnected });
});

app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);

const connectWithRetry = async () => {
  try {
    await connectDb();
    dbConnected = true;
    console.log('Database connected');
  } catch (error) {
    dbConnected = false;
    console.error(`Database connection failed: ${error.message}`);
    console.log(`Retrying database connection in ${dbRetryMs / 1000}s...`);
    setTimeout(connectWithRetry, dbRetryMs);
  }
};

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
  connectWithRetry();
});
