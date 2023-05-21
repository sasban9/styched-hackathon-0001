// Import Library
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { Order, Sku, Tailor } = require('./module');
const app = express();

// Connection between client and server
// Read json data from client 
app.use(cors());
app.use(bodyParser.json());

// Url of mongodb Database
uri = 'mongodb+srv://admin:admin@styched.63sksdt.mongodb.net/styched?retryWrites=true&w=majority'

// Get today date, month and year
function getTodayDMY() {
    const today = new Date();
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric' };
    const todayIstDate = today.toLocaleString('en-IN', options);
    return todayIstDate;
}

// Get all tailor data 
app.get('/getTailors', async (req, res) => {
    const tailors = await Tailor.find({});
    res.send(tailors);
})

// Get specific tailor
app.post('/getTailor', async (req, res) => {
    const tailor = await Tailor.findOne({ username: req.body.username });
    res.send(tailor);
})

// Get all Order data
app.get('/getOrders', async (req, res) => {
    const orders = await Order.find({});
    res.send(orders);
})

// Delete paticular tailor from database
app.post('/deleteTailor', async (req, res) => {
    Tailor.deleteOne({ username: req.body.username })
        .then(() => res.send({ code: 2, msg: 'Tailor deleted successfully' }))
        .catch(() => res.send({ code: 1, msg: 'Something wents Wrong' }))
})

// Add new Tailor
app.post('/addTailor', async (req, res) => {

    // Checking is tailor with same username already exits or not
    const tailor = await Tailor.findOne({ username: req.body.username });
    if (tailor !== null) {
        res.send({ code: 1, msg: 'Tailor already exit with this username' })
        return
    }

    // Create new tailor and add to our database
    const newTailor = new Tailor({ name: req.body.name, username: req.body.username, processOrders: [], completeOrders: [], todayOrders: [], payment: 0, negativeCommision: 0   });
    newTailor.save()
        .then(() => {
            res.send({ code: 2, msg: 'User added successfully' })
        })
        .catch(() => res.send({ code: 1, msg: 'Something wents wrong' }));
})

// Mark process order as completed and add payment to tailor account
app.post('/markAsCompleteOrder', (req, res) => {
    Tailor.updateOne(
        {username: req.body.username},
        {
            $pull: {processOrders: req.body.order}, 
            $push: {completeOrders: req.body.order},
            $inc: {payment: req.body.order.price}
        }
    ).then(() => res.send('Order mark as complete'))
})

// Mark process order as cancel and move order as open order
app.post('/markAsCancelOrder', async (req, res) => {
    await Tailor.updateOne(
        {username: req.body.username},
        {
            $pull: {processOrders: req.body.order},
            $inc: {negativeCommision: req.body.order.price } 
        }
    )
    const order = new Order(req.body.order)
    await order.save()
    res.send('Order mark as cancel')
})

// Assign order to tailor if it is eligible
app.post('/takeThisOrder', async (req, res) => {
    const tailor = await Tailor.findOne({username: req.body.username})

    // Calculate total today order become and different unique sku
    let todayOrderWillBecome = 0
    var todaySkuWillBecome = new Set()

    // Travel on todayOrderData
    tailor.todayOrders.forEach(todayOrderData => {
        if (todayOrderData.date == getTodayDMY()) {
            todayOrderWillBecome += todayOrderData.todayOrder.sku.length;
            todayOrderData.todayOrder.sku.forEach(sku => todaySkuWillBecome.add(sku.name));
        }
    })

    todayOrderWillBecome += req.body.order.sku.length
    req.body.order.sku.forEach(sku => todaySkuWillBecome.add(sku.name))

    // Verify is tailor eligible for this order
    if (10 < todayOrderWillBecome) {
        res.send({code: 1, msg: `You can't take more than 10 unit of SKU in a single day`})
    } else if (5 < todaySkuWillBecome.length) {
        res.send({code: 1, msg: `You can't take more than 5 time of same SKU unit in a single day`})
    } else {

        // if eligible then assign order to tailor
        tailor.processOrders.push(req.body.order);
        tailor.todayOrders.push({todayOrder: req.body.order, date: getTodayDMY()});
        tailor.save()
        .then(() => {

            // delete order from order list
            Order.deleteOne({_id: req.body.order._id})
            .then(() => res.send({code: 2, msg: 'Order assign to tailor'}))
        })
    }
})


// Maintain the per day order
app.post('/maintainPerDayOrder', async (req, res) => {
    const tailor = await Tailor.findOne({ username: req.body.username })
    const todayOrderData = []
    tailor.todayOrders.forEach(todayOrder => {
        if (todayOrder.date === getTodayDMY()) {
            todayOrderData.push(todayOrder)
        }
    })
    tailor.todayOrders = todayOrderData;
    tailor.save();
})

function addOrder() {

    const skuArray = []
    let totalPrice = 0
    const displacement = Math.floor(Math.random()*100) + 1
    // 85% orders have 1 line item, 10% have 2, etc.
    const noOfSkusInOrder = 
    (displacement < 85) ? 1 : 
    (displacement < 95) ? 2 : 
    (displacement < 98) ? 3 :
    (displacement < 100) ? 4 : 5
    sizeArray = ['XS', 'S', 'M', 'L', 'XL']
    // 99% orders will be all items of same size
    const size = sizeArray[Math.floor(Math.random() * 5)]

    for(var index = 0; index < noOfSkusInOrder; index++) {
        const name = 'SKU-' + (Math.floor(Math.random() * 5000) + 1)
        const price =  Math.floor(Math.random() * 651) + 345

        skuArray.push(new Sku({name: name, size: size, price: price}))
        totalPrice+=price
    }
    const order = new Order({sku: skuArray, price: totalPrice, date: getTodayDMY()})
    order.save()
    .then(res => {
        console.log('New order created at ', Date.now())
    }).catch(err => console.log(err))
}

// Connection with server
app.listen(8000, () => {
    console.log('Server started on port 8000')

    // Coonnection with mongodb Database
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Server connected with Database')
            setInterval(addOrder, 864000)
        })
        .catch((err) => console.log(err))
})