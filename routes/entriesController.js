const fs = require('fs');
const path = require('path')

const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const dbPath = path.join(__dirname, '..', 'models', 'entriesDb.json');


const getAllEntries = (req, res) => {
    try {
        fs.readFile(dbPath, 'utf8', (err, data) =>{
            if (err) throw err;
            if (data){
                res.status(200).json(JSON.parse(data));
            } else {
                res.status(200).json('');
            }
        })
    } catch (err) {
        res.status(500).json(`Error ${err}`);
    }
}

const getEntryById = (req, res) => {
    try {
        fs.readFile(dbPath, 'utf8', (err, data) =>{
            if (err) throw err;

            let allEntries = [];
            if (data){
                allEntries = JSON.parse(data);
            }
            let requiredEntry = allEntries.filter(entries => entries.id === req.params.id);
            if (requiredEntry.length > 0)
            {
                res.status(201).json(requiredEntry[0]);
            } else {
                res.status(404).send(`No entry with the required id`);
            }
        })
    } catch (err) {
        res.status(500).send(`Error ${err}`);
    }
}

const createEntry = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(`There were errors(log from createEntry): ${errors.array()}, ${JSON.stringify(errors.array())}`)
        return res.render('create', {messages: errors.array()}); 
    }
    try {
        let newEntry = {
            id: uuidv4(),
            title: req.body.title,
            temperature: req.body.temperature,
            bloodPressure: [req.body.sysPressure, req.body.diaPressure],
            saturation: req.body.saturation, 
            date: req.body.date,
            edited: new Date().toISOString()
        }

        fs.readFile(dbPath, 'utf8', (err, data) =>{
            if (err) throw err;
    
            let entries = [];
            if (data) {
                entries = JSON.parse(data);
            }
            entries = entries.concat(newEntry);
    
            fs.writeFile(dbPath, JSON.stringify(entries), err => {
                if (err) throw err;
                console.log(`I'm creating file (line 54). here is the data ${JSON.stringify(entries)}`)
                return res.render('create', {messages: {msg:'Entry was added successfully!'}});  
            });   
         })

    } catch (error) {
        res.status(500).send(`Error ${err}`);
    }

}


module.exports = {
    getAllEntries,
    createEntry,
    getEntryById
}