'use strict';

const express = require('express');
const router = express.Router();
const transactionService = require('../services/transactionService');
const invoiceService = require('../services/invoiceService');
const { requireSession, requireRole } = require('../middleware/auth');

router.use(requireSession);

// GET /transactions
router.get('/', requireRole('owner'), async (req, res, next) => {
  try {
    const transactions = await transactionService.getAll();
    res.render('transactions/index', { title: 'Transactions', transactions });
  } catch (err) {
    next(err);
  }
});

// GET /transactions/cashflow
router.get('/cashflow', requireRole('owner'), async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const startDate = start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = end || new Date().toISOString().split('T')[0];
    const summary = await transactionService.getCashFlowSummary(startDate, endDate);
    res.render('transactions/cashflow', { title: 'Cash Flow Report', summary, startDate, endDate });
  } catch (err) {
    next(err);
  }
});

// GET /transactions/new
router.get('/new', requireRole('owner'), (req, res) => {
  res.render('transactions/form', { title: 'New Transaction', transaction: {}, error: null });
});

// POST /transactions
router.post('/', requireRole('owner'), async (req, res, next) => {
  try {
    await transactionService.create(req.body);
    res.redirect('/transactions');
  } catch (err) {
    next(err);
  }
});

// GET /transactions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const transaction = await transactionService.getById(req.params.id);
    // Customers can only view their own transactions
    const user = req.session.user;
    if (user.role === 'customer' && String(transaction.customerid) !== String(user.id)) {
      return res.status(403).render('error', { message: 'Forbidden', error: { status: 403 } });
    }
    res.render('transactions/show', { title: 'Transaction Detail', transaction });
  } catch (err) {
    next(err);
  }
});

// GET /transactions/:id/invoice
router.get('/:id/invoice', async (req, res, next) => {
  try {
    const { format } = req.query;
    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${req.params.id}.pdf"`);
      await invoiceService.generateInvoicePdf(req.params.id, res);
      return;
    }
    const invoice = await invoiceService.generateInvoice(req.params.id);
    res.render('transactions/invoice', { title: `Invoice ${invoice.invoicenumber}`, invoice });
  } catch (err) {
    next(err);
  }
});

// POST /transactions/:id/delete
router.post('/:id/delete', requireRole('owner'), async (req, res, next) => {
  try {
    await transactionService.delete(req.params.id);
    res.redirect('/transactions');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
