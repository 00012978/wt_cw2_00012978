const express = require('express');
const router = express.Router();
const entriesController = require('./entriesController');
const axios = require('axios');
const { check, validationResult } = require('express-validator');
const validate = require('./validate');

// get all entries
router.route('/')
    .get(entriesController.getAllEntries);

// create route
router.route('/create')
    .get((req, res)=>{
        res.render('create');
    })
    .post(validate, entriesController.createEntry);

// get singly entry route
router.get('/id/:id', entriesController.getEntryById);

// view signle entry route 
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

// update route
router.route('/update/:id')
    .get(async (req, res) => {
        const apiUrl = `${process.env.API_BASE_URL}/api/entries/id/${req.params.id}`;
        try {
            const response = await axios.get(apiUrl);
            const entry = response.data;
            console.log(`entries variable at get(/update/:id) = ${entry}`)
            res.render('edit', {entry: entry, messages: ''});
        } catch (error) {
            if (error.response && error.response.status === 404) {
            res.status(404).render('error', { msg: 'Entry not found' });
            } else {
            res.render('error', { msg: 'Something went wrong' });
            }
        }
    })
    .post(validate, entriesController.updateEntry);

// delete route
router.route('/delete/:id')
    .get(async (req, res) => {
        const apiUrl = `${process.env.API_BASE_URL}/api/entries/delete/${req.params.id}`;
        try {
        const response = await axios.delete(apiUrl);
        res.redirect('/'); }
        catch (err){
            if (err.response && err.response.status === 404) {
                res.status(404).render('error', { msg: 'Entry not found' });
                } else {
                res.status(500).render('error', { msg: 'Something went wrong' });
                }        
            }
        })
    .delete(entriesController.deleteEntry);

module.exports = router;