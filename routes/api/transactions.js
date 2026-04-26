'use strict';

const express = require('express');
const router = express.Router();
const transactionService = require('../../services/transactionService');
const invoiceService = require('../../services/invoiceService');
const { requireJWT, requireJWTRole } = require('../../middleware/auth');

router.get('/', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const transactions = await transactionService.getAll();
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const transaction = await transactionService.create(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
});

router.get('/cashflow', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const startDate = start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = end || new Date().toISOString().split('T')[0];
    const summary = await transactionService.getCashFlowSummary(startDate, endDate);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireJWT, async (req, res, next) => {
  try {
    const transaction = await transactionService.getById(req.params.id);
    if (req.user.role === 'customer' && String(transaction.customerid) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(transaction);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/invoice', requireJWT, async (req, res, next) => {
  try {
    const { format } = req.query;
    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${req.params.id}.pdf"`);
      await invoiceService.generateInvoicePdf(req.params.id, res);
      return;
    }
    const invoice = await invoiceService.generateInvoice(req.params.id);
    res.json(invoice);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
