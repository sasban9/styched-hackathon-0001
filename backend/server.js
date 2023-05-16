const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const {Order, Sku, Tailor} = require('./module');
const app = express();

app.use(cors());
app.use(bodyParser.json());

uri = 'mongodb+srv://admin:admin@styched.63sksdt.mongodb.net/styched?retryWrites=true&w=majority'

app.get('/getTailors', async (req, res) => {
    const tailors = await Tailor.find({});
    res.send(tailors);
})

app.post('/deleteTailor', async (req, res) => {
    Tailor.deleteOne({username: req.body.username})
    .then(() => res.send({code: 2, msg: 'Tailor deleted successfully'}))
    .catch(() => res.send({code: 1, msg: 'Something wents Wrong'}))
})

app.listen(8000, () => {
    console.log('Server started on port 8000')
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Server connected with Database')
    })
    .catch((err) => console.log(err))
})