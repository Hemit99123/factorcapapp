// app.js
const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/mainRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://patelvhemit:WHJv5u4mXgtJnJfZ@cluster0.m4sxpfa.mongodb.net/factorcap?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());

// Routes
app.use('/', mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
