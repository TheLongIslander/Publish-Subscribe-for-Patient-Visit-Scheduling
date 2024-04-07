const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const reservationRoutes = require('./reservationsRoutes');
const Publisher = require('./publisher');
const { doctorNotification, secretaryNotification, auditLogger } = require('./notifications');

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database('./reservations.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the database.');
    }
});
// Create a publisher instance for cancellations
const cancellationPublisher = new Publisher();
// Bind the subscriber functions to the publisher
cancellationPublisher.bind(doctorNotification);
cancellationPublisher.bind(secretaryNotification);
cancellationPublisher.bind(auditLogger);

// Use the reservation routes with the db instance
app.use('/api', reservationRoutes(db, cancellationPublisher));

const port = 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
module.exports = app;