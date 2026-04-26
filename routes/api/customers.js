'use strict';

const express = require('express');
const router = express.Router();
const customerService = require('../../services/customerService');
const vehicleService = require('../../services/vehicleService');
const { requireJWT, requireJWTRole } = require('../../middleware/auth');

// GET /api/v1/customers
router.get('/', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const customers = await customerService.getAll();
    res.json(customers);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/customers
router.post('/', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const customer = await customerService.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/customers/:id
router.get('/:id', requireJWT, async (req, res, next) => {
  try {
    if (req.user.role === 'customer' && String(req.user.id) !== String(req.params.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const customer = await customerService.getWithDetails(req.params.id);
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/customers/:id
router.put('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const customer = await customerService.update(req.params.id, req.body);
    res.json(customer);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/customers/:id
router.delete('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    await customerService.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/customers/:id/vehicles
router.get('/:id/vehicles', requireJWT, async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getByCustomer(req.params.id);
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/customers/:id/vehicles
router.post('/:id/vehicles', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const vehicle = await vehicleService.create({ ...req.body, customerid: req.params.id });
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
