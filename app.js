const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { ERROR_CODE_DATA_NOT_FOUND } = require('./utills/utills');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res
    .status(ERROR_CODE_DATA_NOT_FOUND)
    .send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`listen a ${PORT}`);
});
