const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION!');
  process.exit(1);
});

// const methodForTours = require('./dev-data/data/import-dev-data');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => {
  console.log('DB connection successfull');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
// methodForTours.importData();

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!');

  server.close(() => {
    process.exit(1);
  });
});
