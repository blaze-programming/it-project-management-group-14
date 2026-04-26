'use strict';

const express = require('express');
const router = express.Router();
const vehicleService = require('../../services/vehicleService');
const { requireJWT, requireJWTRole } = require('../../middleware/auth');

router.get('/', requireJWT, async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAll();
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const vehicle = await vehicleService.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireJWT, async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getById(req.params.id);
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const vehicle = await vehicleService.update(req.params.id, req.body);
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    await vehicleService.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
