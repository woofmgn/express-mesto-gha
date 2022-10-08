const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`listen a ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb');
