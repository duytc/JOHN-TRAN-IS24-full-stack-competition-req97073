const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.yaml'); 

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH ,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/products', async (req, res) => {
  console.log('TRYING TO FETCH PRODUCTS');
  try {
    const products = jsonfile.readFileSync('./database/data.json');
    res.status(200).json({
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        developers: product.developers,
        ownerName: product.ownerName,
        scrumMasterName: product.scrumMasterName,
        startDate: product.startDate,
        methodology: product.methodology,
      })),
    });

    console.log('FETCHED PRODUCTS');
  } catch (err) {
    console.error('ERROR FETCHING PRODUCTS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load products.' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  console.log('TRYING TO FETCH PRODUCT');
  try {
    const products = jsonfile.readFileSync('./database/data.json');
    const productId = parseInt(req.params.id);
    const product = products.find((p) => p.id === productId);

    if (product) {
      res.status(200).json({
        id: product.id,
        name: product.name,
        developers: product.developers,
        productOwnerName: product.ownerName,
        scrumMasterName: product.scrumMasterName,
        startDate: product.startDate,
      });
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }

    console.log('FETCHED PRODUCT');
  } catch (err) {
    console.error('ERROR FETCHING PRODUCT');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load product.' });
  }
});

app.post('/api/products', async (req, res) => {
  console.log('TRYING TO ADD PRODUCT');
  const { name, developers, ownerName, scrumMasterName, startDate } = req.body;

  if (!name || !developers || !ownerName || !scrumMasterName || !startDate) {
    console.log('INVALID INPUT - MISSING DATA');
    return res.status(422).json({ message: 'Missing product data.' });
  }

  try {
    const products = jsonfile.readFileSync('./database/data.json');
    const lastProductId =
      products.length > 0 ? products[products.length - 1].id : 0;

    const newProduct = {
      id: lastProductId + 1,
      name,
      developers,
      ownerName,
      scrumMasterName,
      startDate,
    };

    products.push(newProduct);
    jsonfile.writeFileSync('./database/data.json', products);

    res.status(201).json({ message: 'Product added', product: newProduct });
    console.log('ADDED NEW PRODUCT');
  } catch (err) {
    console.error('ERROR ADDING PRODUCT');

    console.error(err.message);
    res.status(500).json({ message: 'Failed to add product.' });
  }
});

app.patch('/api/products/:id', async (req, res) => {
  console.log('TRYING TO UPDATE PRODUCT');
  const { name, developers, ownerName, scrumMasterName, startDate, methodology } = req.body;

  if (!name || !developers || !ownerName || !scrumMasterName || !startDate || !methodology) {
    console.log('INVALID INPUT - MISSING DATA');
    return res.status(422).json({ message: 'Missing product data.' });
  }

  try {
    const products = jsonfile.readFileSync('./database/data.json');
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      const product = products[productIndex];
      product.name = name;
      
      product.developers = developers;
      product.ownerName = ownerName;
      product.scrumMasterName = scrumMasterName;
      product.startDate = startDate;
      product.methodology = methodology;

      jsonfile.writeFileSync('./database/data.json', products);

      res.status(200).json({ message: 'Product updated!', product });
      console.log('UPDATED PRODUCT');
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (err) {
    console.error('ERROR UPDATING PRODUCT');
    console.error(err.message);

    res.status(500).json({ message: 'Failed to update product.' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  console.log('TRYING TO DELETE PRODUCT');
  try {
    const products = jsonfile.readFileSync('./database/data.json');
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      jsonfile.writeFileSync('./database/data.json', products);

      res.status(200).json({ message: 'Product deleted!' });
      console.log('DELETED PRODUCT');
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (err) {
    console.error('ERROR DELETING PRODUCT');
    console.error(err.message);

    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(80);
