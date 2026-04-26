'use strict';

const express = require('express');
const router = express.Router();
const serviceService = require('../../services/serviceService');
const { requireJWT, requireJWTRole } = require('../../middleware/auth');

router.get('/', requireJWT, async (req, res, next) => {
  try {
    const services = await serviceService.getAll();
    res.json(services);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const service = await serviceService.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireJWT, async (req, res, next) => {
  try {
    const service = await serviceService.getById(req.params.id);
    res.json(service);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const service = await serviceService.update(req.params.id, req.body);
    res.json(service);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    await serviceService.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
