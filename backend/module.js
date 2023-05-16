const mongoose = require('mongoose');

// Schema for each sku unit
const skuSchema = new mongoose.Schema({
    name: String,
    size: String,
    price: Number,
})

// Schema of Order
const orderSchema = new mongoose.Schema({
    sku: [skuSchema],
    price: Number
})

// Schema of tailor
const tailorSchema = new mongoose.Schema({
    name: String,
    username: String,
    processOrders: [orderSchema],
    completeOrders: [orderSchema],
    todayOrders: [{todayOrder: orderSchema, date: String}],
    payment: Number
})


const orderModel = new mongoose.model('Order', orderSchema)
const skuModel = new mongoose.model('Sku', skuSchema)
const tailorModel = new mongoose.model('Tailor', tailorSchema)


module.exports = {Order: orderModel, Sku: skuModel, Tailor: tailorModel}