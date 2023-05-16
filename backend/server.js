const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const {Order, Sku, Tailor} = require('./module');
const app = express();

app.use(cors());

uri = 'mongodb+srv://admin:admin@styched.63sksdt.mongodb.net/styched?retryWrites=true&w=majority'

app.get('/getTailors', async (req, res) => {
    const tailors = await Tailor.find({});
    res.send(tailors);
})

app.listen(8000, () => {
    console.log('Server started on port 8000')
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Server connected with Database')
    })
    .catch((err) => console.log(err))
})