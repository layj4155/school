const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const students = require('./routes/students');
const books = require('./routes/bookRoutes');
const marks = require('./routes/marks');
const classes = require('./routes/classes');
const reports = require('./routes/reports');
const performance = require('./routes/performance');
const discipline = require('./routes/discipline');
const trainers = require('./routes/trainers');
const programs = require('./routes/programs');
const news = require('./routes/news');
const fees = require('./routes/fees');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/students', students);
app.use('/api/books', books);
app.use('/api/classes', classes);
app.use('/api/marks', marks);
app.use('/api/reports', reports);
app.use('/api/performance', performance);
app.use('/api/discipline', discipline);
app.use('/api/trainers', trainers);
app.use('/api/programs', programs);
app.use('/api/news', news);
app.use('/api/fees', fees);

app.use(errorHandler);

const PORT = process.env.PORT || 5002;

app.get('/', (req, res) => {
    res.send('KTSS API is running...');
});

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});