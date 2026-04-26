'use strict';

require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// ── Routers ───────────────────────────────────────────────────────────────────
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var customersRouter = require('./routes/customers');
var vehiclesRouter = require('./routes/vehicles');
var employeesRouter = require('./routes/employees');
var partsRouter = require('./routes/parts');
var repairsRouter = require('./routes/repairs');
var servicesRouter = require('./routes/services');
var transactionsRouter = require('./routes/transactions');

// API routers
var apiCustomersRouter = require('./routes/api/customers');
var apiVehiclesRouter = require('./routes/api/vehicles');
var apiEmployeesRouter = require('./routes/api/employees');
var apiPartsRouter = require('./routes/api/parts');
var apiRepairsRouter = require('./routes/api/repairs');
var apiServicesRouter = require('./routes/api/services');
var apiTransactionsRouter = require('./routes/api/transactions');
var authRouterApi = require('./routes/auth'); // re-use /api/login endpoint

var errorHandler = require('./middleware/errorHandler');

var app = express();

// ── View engine ───────────────────────────────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// ── Standard middleware ───────────────────────────────────────────────────────
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ── Session ───────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// ── Make session user available in all Pug templates ─────────────────────────
app.use((req, res, next) => {
  res.locals.sessionUser = req.session && req.session.user;
  next();
});

// ── Web routes ────────────────────────────────────────────────────────────────
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/customers', customersRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/employees', employeesRouter);
app.use('/parts', partsRouter);
app.use('/repairs', repairsRouter);
app.use('/services', servicesRouter);
app.use('/transactions', transactionsRouter);

// ── REST API routes ───────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRouterApi);
app.use('/api/v1/customers', apiCustomersRouter);
app.use('/api/v1/vehicles', apiVehiclesRouter);
app.use('/api/v1/employees', apiEmployeesRouter);
app.use('/api/v1/parts', apiPartsRouter);
app.use('/api/v1/repairs', apiRepairsRouter);
app.use('/api/v1/services', apiServicesRouter);
app.use('/api/v1/transactions', apiTransactionsRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use(function (req, res, next) {
  next(createError(404));
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
