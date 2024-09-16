
const express = require('express');
const cors = require('cors');

const APIError = require("./app/api-error");
const contactRouter = require('./app/routes/contact.route');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to contact book application.',
    });
});

// Handle 404 response
app.use((req, res, next) => {
    return next(new APIError(404, 'Resource not found'));
});

// Middleware handle errors
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;
