const express = require('express');
const itemRoutes = require('./itemsRoutes');
const ExpressError = require('./expressError');

const app = express();

app.use(express.json());
app.use('/items', itemRoutes);

app.use((err, request, response, next) => {
    return response.status(err.status).json({error : {msg : err.msg, status: err.status}});
})

app.listen(3000, ()=> console.log('app listening on port 3000...'));
