'use strict';

require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var rateLimit = require('express-rate-limit');
var { doubleCsrf } = require('csrf-csrf');

// ── Fail-fast for required secrets in production ──────────────────────────────
if (process.env.NODE_ENV === 'production') {
  ['SESSION_SECRET', 'JWT_SECRET', 'CSRF_SECRET'].forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
  });
}

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
  secret: process.env.SESSION_SECRET || 'dev_session_secret_do_not_use_in_prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// ── CSRF protection for web (HTML form) routes ────────────────────────────────
const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'dev_csrf_secret_do_not_use_in_prod',
  getSessionIdentifier: (req) => req.session.id,
  cookieName: '_csrf',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
  },
});

// Expose CSRF token to all Pug templates
app.use(doubleCsrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = generateCsrfToken(req, res);
  res.locals.sessionUser = req.session && req.session.user;
  next();
});

// ── Rate limiting on auth endpoints ──────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

// ── Web routes ────────────────────────────────────────────────────────────────
app.use('/auth', authLimiter);
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/customers', customersRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/employees', employeesRouter);
app.use('/parts', partsRouter);
app.use('/repairs', repairsRouter);
app.use('/services', servicesRouter);
app.use('/transactions', transactionsRouter);

// ── REST API routes (CSRF-exempt, protected by JWT) ───────────────────────────
app.use('/api/v1/auth', authLimiter);
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
