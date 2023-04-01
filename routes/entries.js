const express = require('express');
const router = express.Router();
const entriesController = require('./entriesController');
const axios = require('axios');
const validate = require('./validate');

router.route('/')
    .get(entriesController.getAllEntries);

router.route('/create')
    .get((req, res)=>{
        res.render('create');
    })
    .post(validate, entriesController.createEntry);


router.get('/id/:id', entriesController.getEntryById);

router.get('/view/:id', async (req, res) => {       
    const apiUrl = `${process.env.API_BASE_URL}/api/entries/id/${req.params.id}`;
    try {
        const response = await axios.get(apiUrl);
        const entry = response.data;
        console.log(`entries variable in .get(/view:id) route = ${JSON.stringify(entry)}`);
        res.render('viewEntry', {entry});
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).render('error', { msg: 'Entry not found' });
        } else {
            res.status(500).render('error', { msg: 'Something went wrong' });
        }
    }
});

module.exports = router;