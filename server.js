const mongoose = require('mongoose');

const app = require('./app');
const cors = require('cors');
const db = mongoose
  .connect(process.env.DB.replace('<password>', process.env.PASSWORD))
  .then((db) => {
    console.log('connected to database');
  });

app.use(
  cors({
    origin: 'https://test-abdullahcodesxds-projects.vercel.app/',
  }),
);
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
