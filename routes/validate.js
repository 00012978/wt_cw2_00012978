const { check, validationResult } = require('express-validator');
const validate = [
    check('title', 'Title must be 3+ characters long')
        .exists()
        .isLength({min:3}),
    check('temperature', 'Temperature must be between 0 and 50')
        .exists()
        .toFloat()
        .isFloat({min:0, max:50}),
    check('sysPressure', 'Blood pressure must be between 0 and 500')
        .exists()
        .toInt()
        .isInt({min:0, max:500}),
    check('diaPressure', 'Blood pressure must be between 0 and 500')
        .exists()
        .toInt()
        .isInt({min:0, max:500}),
    check('saturation', 'Saturation must be between 0 and 100')
        .exists()
        .toInt()
        .isInt({min:0, max:100}),
    check('date', 'Make sure the date input is correct')
        .exists()
        .isISO8601()
]

module.exports = validate;