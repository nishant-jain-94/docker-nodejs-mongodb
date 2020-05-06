const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
let counter = 0;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Item');

app.use(morgan('combined'))

app.get('/', (req, res) => {
  counter = counter + 1;
  if (counter % 5 === 0) {
    res.status(500).json({ msg: 'Internal Server Error' });
  } else {
    Item.find()
      .then(items => res.render('index', { items }))
      .catch(err => res.status(404).json({ msg: 'No items found' }));
  }
});

app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });
  newItem.save().then(item => res.redirect('/'));
});

const port = 3000;

app.listen(port, () => console.log('Server running...'));
