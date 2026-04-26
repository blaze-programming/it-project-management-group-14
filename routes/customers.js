'use strict';

const express = require('express');
const router = express.Router();
const customerService = require('../services/customerService');
const vehicleService = require('../services/vehicleService');
const transactionService = require('../services/transactionService');
const { requireSession, requireRole } = require('../middleware/auth');

// All web customer routes require a session
router.use(requireSession);

// GET /customers — list all (owner only)
router.get('/', requireRole('owner'), async (req, res, next) => {
  try {
    const customers = await customerService.getAll();
    res.render('customers/index', { title: 'Customers', customers });
  } catch (err) {
    next(err);
  }
});

// GET /customers/new
router.get('/new', requireRole('owner'), (req, res) => {
  res.render('customers/form', { title: 'New Customer', customer: {}, error: null });
});

// POST /customers
router.post('/', requireRole('owner'), async (req, res, next) => {
  try {
    await customerService.create(req.body);
    res.redirect('/customers');
  } catch (err) {
    if (err.status === 409) {
      return res.render('customers/form', { title: 'New Customer', customer: req.body, error: err.message });
    }
    next(err);
  }
});

// GET /customers/:id — detail
router.get('/:id', async (req, res, next) => {
  try {
    const user = req.session.user;
    // Customers can only view their own profile
    if (user.role === 'customer' && String(user.id) !== String(req.params.id)) {
      return res.status(403).render('error', { message: 'Forbidden', error: { status: 403 } });
    }
    const customer = await customerService.getWithDetails(req.params.id);
    const transactions = await transactionService.getByCustomer(req.params.id);
    res.render('customers/show', { title: 'Customer Detail', customer, transactions });
  } catch (err) {
    next(err);
  }
});

// GET /customers/:id/edit
router.get('/:id/edit', requireRole('owner'), async (req, res, next) => {
  try {
    const customer = await customerService.getById(req.params.id);
    res.render('customers/form', { title: 'Edit Customer', customer, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /customers/:id (update via form)
router.post('/:id', requireRole('owner'), async (req, res, next) => {
  try {
    await customerService.update(req.params.id, req.body);
    res.redirect(`/customers/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// POST /customers/:id/delete
router.post('/:id/delete', requireRole('owner'), async (req, res, next) => {
  try {
    await customerService.delete(req.params.id);
    res.redirect('/customers');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
