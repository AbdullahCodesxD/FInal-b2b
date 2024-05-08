const mongoose = require('mongoose');

const app = require('./app');

const db = mongoose
  .connect(process.env.DB.replace('<password>', process.env.PASSWORD))
  .then((db) => {
    console.log('connected to database');
  });

const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Successfull');
});

process.on('unhandledRejection', function (err) {
  server.close(() => {
    process.exit(1);
  });
});
process.on('uncaughtException', function (err) {
  console.log(err.name, err.message, '💥');
  console.log('SHUTTING THE SERVER DOWN');

  process.exit(1);
});

// const
