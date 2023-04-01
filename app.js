const express = require('express');
const path = require('path');
const PORT = 3000
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./public/'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  try {
    res.render('index', { entries });
  } catch (err) {
    res.render('error', { msg: 'Something went wrong!' });
  }
});

app.listen(PORT, ()=>console.log('Health Assistant App'));