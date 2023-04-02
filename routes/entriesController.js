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
        res.status(500).render('error', {msg:`Error ${err}`});
    }
}

const createEntry = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
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
            addInfo: req.body.addInfo,
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
                return res.render('create', {messages: {msg:'Entry was added successfully!'}});  
            });   
         })

    } catch (error) {
        res.status(500).render('error', {msg:`Error ${err}`});
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

const updateEntry = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        let entry = {
            title: req.body.title,
            temperature: req.body.temperature,
            bloodPressure: [req.body.sysPressure, req.body.diaPressure],
            saturation: req.body.saturation, 
            date: req.body.date,
            addInfo: req.body.addInfo
        }
        return res.render('edit', {messages: errors.array(), entry: entry}); 
    }
    try {
      const { title, temperature, sysPressure, diaPressure, saturation, date, addInfo } = req.body;
      const bloodPressure = [sysPressure, diaPressure];
      const entryId = req.params.id;
  
      fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
  
        const entries = JSON.parse(data);
        const entryIndex = entries.findIndex(entry => entry.id === entryId);
  
        if (entryIndex === -1) {
          return res.status(404).render('error', {
            msg: `Entry with id ${entryId} not found`,
          });
        }
  
        entries[entryIndex] = {
          ...entries[entryIndex],
          title,
          temperature,
          bloodPressure,
          saturation,
          date,
          addInfo,
          edited: new Date().toISOString()
        };
  
        fs.writeFile(dbPath, JSON.stringify(entries), err => {
          if (err) throw err;
          return res.render('viewEntry', {entry: entries[entryIndex], messages: {msg:'Entry was updated successfully!'}});
        });
      });
    } catch (error) {
      res.status(500).render('error', {msg: `Error ${err}`});
    }
  };

const deleteEntry = (req, res) => {
    try {
        fs.readFile(dbPath, 'utf8', (err, data) =>{
            if (err) throw err;

            let entry;

            let allEntries = [];
            if (data.length > 0){
                allEntries = JSON.parse(data);
                entry = allEntries.filter(entry => entry.id === req.params.id)[0];
            }

            if (!entry){
                return res.status(404).json({
                    msg: `Entry ${req.params.id} not found`
                });
            }
        
            const filteredArray = allEntries.filter(entry => entry.id !== req.params.id);
            data = filteredArray;
        
            fs.writeFile(dbPath, JSON.stringify(data), (err) => {
                if (err) throw err;
                res.status(200).json(data);
              })
         })
    } catch (error) {
        res.status(500).send(`Error ${err}`);
    }
}


module.exports = {
    getAllEntries,
    createEntry,
    getEntryById,
    updateEntry,
    deleteEntry,
}