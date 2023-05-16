// Import Library
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const {Order, Sku, Tailor} = require('./module');
const app = express();

// Connection between client and server
// Read json data from client 
app.use(cors());
app.use(bodyParser.json());

// Url of mongodb Database
uri = 'mongodb+srv://admin:admin@styched.63sksdt.mongodb.net/styched?retryWrites=true&w=majority'

// Get all tailor data 
app.get('/getTailors', async (req, res) => {
    const tailors = await Tailor.find({});
    res.send(tailors);
})

// Delete paticular tailor from database
app.post('/deleteTailor', async (req, res) => {
    Tailor.deleteOne({username: req.body.username})
    .then(() => res.send({code: 2, msg: 'Tailor deleted successfully'}))
    .catch(() => res.send({code: 1, msg: 'Something wents Wrong'}))
})

// Add new Tailor
app.post('/addTailor', async (req, res) => {

    // Checking is tailor with same username already exits or not
    const tailor = await Tailor.findOne({username: req.body.username});
    if (tailor !== null) {
        res.send({code: 1, msg:'Tailor already exit with this username'})
        return 
    }

    // Create new tailor and add to our database
    const newTailor = new Tailor({name: req.body.name, username: req.body.username, processOrders: [], completeOrders: [], todayOrders: [], payment: 0});
    newTailor.save()
    .then(() => {
        res.send({code: 2, msg: 'User added successfully'})
    })
    .catch(() => res.send({code: 1, msg:'Something wents wrong'}));
})

// Connection with server
app.listen(8000, () => {
    console.log('Server started on port 8000')

    // Coonnection with mongodb Database
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Server connected with Database')
    })
    .catch((err) => console.log(err))
})