const mongoose = require('mongoose');

const connectToDB = () => {
  const mongoUrl = process.env.MONGO_DB && process.env.MONGO_DB.trim();

  if (!mongoUrl) {
    console.error('Missing MONGO_DB environment variable. Set it in .env');
    return Promise.resolve();
  }

  if (!mongoUrl.startsWith('mongodb://') && !mongoUrl.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB connection string in MONGO_DB. It must start with "mongodb://" or "mongodb+srv://"');
    console.error(`Current value: ${mongoUrl}`);
    return Promise.resolve();
  }

  return mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error(`Could not connect to MongoDB: ${err}`);
    });
};

module.exports = connectToDB;
