const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '63415e20e6ce48991e929c1e',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`listen a ${PORT}`);
});
