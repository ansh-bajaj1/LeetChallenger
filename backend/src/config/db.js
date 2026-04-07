const mongoose = require('mongoose');

const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leetcode_tracer';
  await mongoose.connect(mongoUri);
};

module.exports = connectDb;
