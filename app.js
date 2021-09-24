const express = require('express');
const itemRoutes = require('./itemsRoutes');

const app = express();

app.use(express.json());
app.use('/items', itemRoutes);

app.use((err, request, response, next) => {
    const error = err || {msg: 'Internal server error', status: 500};
    return response.status(error.status).json({error : error});
});

module.exports = app;
