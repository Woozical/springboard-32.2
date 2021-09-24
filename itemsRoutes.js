const items = require('./fakeDb');
const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router();

function validatePOST(req, res, next){
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

function validateName(req, res, next){
    if (items.find(elem => elem.name === req.params.name)){
        return next();
    } else {
        return next(new ExpressError(`Item with name '${req.params.name}' does not exist.`, 404))
    }
}

// Should return a JSON list of all shopping items
router.get('/', (req, res) => {
    return res.json(items);
});
// Should accept JSON data and add it to the shopping list
router.post('/', validatePOST, (req, res) => {
    const newItem = {name: req.body.name, price: +(req.body.price.toFixed(2))}
    items.push(newItem);
    return res.status(201).json({'added' : newItem});
});
// Should display a single item’s name and price
router.get('/:name', validateName, (req, res) => {
    const item = items.find(elem => elem.name === req.params.name);
    return res.json(item);
});
// Should modify a single item’s name and/or price.
router.patch('/:name', validateName, (req, res) => {
    const item = items.find(elem => elem.name === req.params.name);
    if (req.body.name) item.name = req.body.name;
    if (req.body.price) item.price = +req.body.price.toFixed(2);
    return res.json({'updated': item});
});
router.delete('/:name', validateName, (req, res) => {
    const deleteIdx = items.findIndex(elem => elem.name === req.params.name);
    items.splice(deleteIdx, 1);
    return res.json({message: `Deleted ${req.params.name}`});
})


module.exports = router;