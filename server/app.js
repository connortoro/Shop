const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')
require('dotenv').config();


//ROUTES
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(cors())

//DB
mongoose.connect(process.env.DB_URL)
app.use(express.json())

//LOGGING
app.use(morgan('dev'))

//BODY PARSING
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//ENDPOINTS
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)


//ERROR HANDLING
app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error);
})

app.use((error, req, res, next) => {
    res.status((error.status || 500))
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;

