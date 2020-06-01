require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'));

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

// API Routes Files
const apiAuthRoute = require('./api/routes/auth');
const apiTransactionsRoute = require('./api/routes/transactions');
const apiBooksRoute = require('./api/routes/books');
const apiUsersRoute = require('./api/routes/users');
const apiProfileRoute = require('./api/routes/profile');
const apiCartRoute = require('./api/routes/cart');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser(process.env.SECRET_COOKIE));

app.use(cors());

// API Routes
app.use('/api/auth', apiAuthRoute);
app.use('/api/transactions', apiTransactionsRoute);
app.use('/api/books', apiBooksRoute);
app.use('/api/users', apiUsersRoute);
app.use('/api/profile', apiProfileRoute);
app.use('/api/cart', apiCartRoute);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
