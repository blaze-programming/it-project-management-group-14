'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const customerService = require('../services/customerService');
const employeeService = require('../services/employeeService');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ── Web: Login form ───────────────────────────────────────────────────────────

router.get('/login', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/');
  res.render('auth/login', { title: 'Login', error: null });
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    let user = null;
    if (role === 'customer') {
      user = await customerService.verifyCredentials(email, password);
      if (user) user.role = 'customer';
    } else {
      // Try employee login (owner or technician)
      user = await employeeService.verifyCredentials(email, password);
    }

    if (!user) {
      return res.render('auth/login', { title: 'Login', error: 'Invalid email or password' });
    }

    req.session.user = {
      id: user.customerid || user.employeeid,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    };
    return res.redirect('/');
  } catch (err) {
    return next(err);
  }
});

// ── Web: Register ─────────────────────────────────────────────────────────────

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register', error: null });
});

router.post('/register', async (req, res, next) => {
  try {
    const customer = await customerService.create(req.body);
    req.session.user = {
      id: customer.customerid,
      email: customer.email,
      firstname: customer.firstname,
      lastname: customer.lastname,
      role: 'customer',
    };
    return res.redirect('/');
  } catch (err) {
    if (err.status === 409) {
      return res.render('auth/register', { title: 'Register', error: err.message });
    }
    return next(err);
  }
});

// ── Web: Logout ───────────────────────────────────────────────────────────────

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
});

// ── API: Issue JWT ────────────────────────────────────────────────────────────

router.post('/api/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    let user = null;

    if (role === 'customer') {
      user = await customerService.verifyCredentials(email, password);
      if (user) user.role = 'customer';
    } else {
      user = await employeeService.verifyCredentials(email, password);
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = {
      id: user.customerid || user.employeeid,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ token, user: payload });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
