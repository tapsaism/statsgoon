'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

//user imports
const routes= require('./src/statsgoonRoutes')

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express()
app.use(cors())
app.use(bodyParser.json({ extended: false }));

app.use('/api',routes)

app.listen(PORT, HOST);
console.log(`Statsgoon containerized API running on http://${HOST}:${PORT}`);
