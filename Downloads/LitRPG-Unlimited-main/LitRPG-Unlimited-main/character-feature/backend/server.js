const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('./db');
const portfinder = require('portfinder');

const characterRoutes = require('./routes/characterRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api', characterRoutes);

portfinder.getPortPromise()
  .then((port) => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error finding port:', err);
  });
