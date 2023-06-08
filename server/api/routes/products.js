const express = require('express')
const router = express.Router()

const Product = require('../models/product')
const mongoose = require('mongoose')


//GET ALL
router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .then(docs => {
        console.log(docs)
        const response = {
            count: docs.length,
            products: docs
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

//POST
router.post('/', (req, res, next) => {
    console.log(req.body);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.body.productImage
    })
    product
    .save()
    .then(result => {
        console.log(result)
        res.status(200).json({
            message: "Handling POST request to /products",
            createdProduct: result
        })
    })
    .catch((err => {
        console.log(err)
        res.status(500).json({error: err})
    }))
})

//GET BY ID
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
    .select('name price _id productImage')
    .then(doc => {
        console.log(doc)
        if(doc) {
            res.status(200).json(doc)
        } else {
            res.status(404).json({message: "No valid entry for ID given"})
        }

    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    });
})

//DELETE BY ID
router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    Product.findByIdAndDelete(id)
    .then(result => {
        console.log(result)
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

//PATCH (UPDATE)
router.patch('/:id', (req, res, next) => {
    const updateData = {
        name: req.body.name,
        price: req.body.price,
        productImage: req.body.productImage
    }
    const id = req.params.id

    Product.findByIdAndUpdate(id, updateData, {new: true})
    .then(doc => {
        console.log(doc)
        if(doc == null) {
            res.status(404).json({message: "No entry for given id"})
        } else {
            res.status(200).json(doc)
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

module.exports = router
