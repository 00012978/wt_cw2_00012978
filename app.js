require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = 3000
const app = express();
const axios = require('axios');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./public/'));

const entries = require('./routes/entries');
app.use('/api/entries', entries);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.get('/', async (req, res) => {
  try {
    const apiUrl = `${process.env.API_BASE_URL}/api/entries`;
    const response = await axios.get(apiUrl);
    const entries = response.data;
    res.render('index', { entries });
  } catch (err) {
    res.render('error', { msg: 'Something went wrong!' });
  }
});

app.get('/all', async (req, res) => {
  try {
    const apiUrl = `${process.env.API_BASE_URL}/api/entries`;
    const response = await axios.get(apiUrl);
    const entries = response.data;
    res.render('index', { entries, showAllEntries:'T' });
  } catch (err) {
    res.render('error', { msg: 'Something went wrong!' });
  }
});

app.get('/*', (req, res, next) => {
  res.render('error', {msg: 'Sorry, the page you requested could not be found.'});
});

app.listen(PORT, ()=>console.log('Health Assistant App'));
