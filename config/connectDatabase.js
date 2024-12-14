

const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URL ).then((con) => {
    console.log('MongoDB connected to host ' + con.connection.host);
  }).catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit process with failure
  });
};

module.exports = connectDatabase;
