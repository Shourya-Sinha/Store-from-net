const express = require('express');
const cors = require('cors');
const route = require('./Route/allRoutes');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(route);


app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});
module.exports = app;



