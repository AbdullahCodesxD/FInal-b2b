const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const errorController = require('./controllers/errorController');

///////////////////////////////////////////////////
////////////////////Routes/////////////////////////
//////////////////////////////////////////////////
const searchRouter = require('./routes/searchRoute');
const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');
const chatRouter = require('./routes/chatRoute');
const shopRouter = require('./routes/shopRoute');
const quoteRouter = require('./routes/quoteRoute');
const cors = require('cors');
dotenv.config({
  path: './config.env',
});

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    credentials: false,
  }),
);
app.use(express.static(`./images`));
app.use(express.json());

app.use(cookieParser());
// app.use((req, res, next) => {
//   // console.log(req.cookies);
//   next();
// });

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', userRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/shop', shopRouter);
app.use('/api/v1/quote', quoteRouter);
app.use(errorController);

module.exports = app;
