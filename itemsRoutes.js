const items = require('./fakeDb');
const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router();

function validateJSON(req, res, next){
    const json = req.body;
    const errors = [];
    if (!json.name) errors.push('name');
    if (!json.price) errors.push('price');
    if (errors.length > 0){
        return next(new ExpressError(`Missing fields:${errors}`, 400));
    }
    // NaN
    if (+json.price !== +json.price){
        return next(new ExpressError('Price must be a number type.', 400));
    }

    return next();
}

// Should return a JSON list of all shopping items
router.get('/', (req, res) => {
    return res.json(items);
});
// Should accept JSON data and add it to the shopping list
router.post('/', validateJSON, (req, res) => {
    const newItem = {name: req.body.name, price: +(req.body.price.toFixed(2))}
    items.push(newItem);
    return res.json({'added' : newItem});
});

module.exports = router;