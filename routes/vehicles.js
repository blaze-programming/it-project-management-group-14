'use strict';

const express = require('express');
const router = express.Router();
const vehicleService = require('../services/vehicleService');
const { requireSession, requireRole } = require('../middleware/auth');

router.use(requireSession);

// GET /vehicles
router.get('/', requireRole('owner', 'technician'), async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAll();
    res.render('vehicles/index', { title: 'Vehicles', vehicles });
  } catch (err) {
    next(err);
  }
});

// GET /vehicles/new
router.get('/new', requireRole('owner'), (req, res) => {
  res.render('vehicles/form', { title: 'New Vehicle', vehicle: {}, error: null });
});

// POST /vehicles
router.post('/', requireRole('owner'), async (req, res, next) => {
  try {
    await vehicleService.create(req.body);
    res.redirect('/vehicles');
  } catch (err) {
    if (err.status === 409 || err.status === 404) {
      return res.render('vehicles/form', { title: 'New Vehicle', vehicle: req.body, error: err.message });
    }
    next(err);
  }
});

// GET /vehicles/:id
router.get('/:id', async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getById(req.params.id);
    res.render('vehicles/show', { title: 'Vehicle Detail', vehicle });
  } catch (err) {
    next(err);
  }
});

// GET /vehicles/:id/edit
router.get('/:id/edit', requireRole('owner'), async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getById(req.params.id);
    res.render('vehicles/form', { title: 'Edit Vehicle', vehicle, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /vehicles/:id
router.post('/:id', requireRole('owner'), async (req, res, next) => {
  try {
    await vehicleService.update(req.params.id, req.body);
    res.redirect(`/vehicles/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// POST /vehicles/:id/delete
router.post('/:id/delete', requireRole('owner'), async (req, res, next) => {
  try {
    await vehicleService.delete(req.params.id);
    res.redirect('/vehicles');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
