const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')

//GET ALL
router.get('/', (req, res, next) => {
    Order.find()
    .select('quantity product _id')
    .populate('product', 'name price')
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs
        }
        console.log(response)
        res.status(200).json(response)
    })
    .catch(err => {

    })
})

//POST
router.post('/', (req, res, next) => {
    Product.findById(req.params.product)
    .then(product => {
        if(!product) {
            console.log("okay")
            return res.status(404).json({message: 'Product doesn\'t exist! :P'})
        }
    })

    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.product
    })

    order.save()
    .then(result => {
        console.log(result)
        res.status(200).json({result})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

//GET BY ID
router.get('/:id', (req, res, next) => {
    const id = req.params.id
    Order.findById(id)
    .select('_id product quantity')
    .populate('product', 'name price')
    .then(result => {
        console.log(result)
        if(result) {
            res.status(200).json(result)
        } else {
            res.status(404).json({message: "No entry found for given ID! lol :0"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

//DELETE BY ID
router.delete('/:id', (req, res, next) => {
    Order.findByIdAndDelete(req.params.id)
    .then(result => {
        res.status(200).json({message: 'Order Deleted!'})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

module.exports = router;
