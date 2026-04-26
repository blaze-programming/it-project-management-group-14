'use strict';

const express = require('express');
const router = express.Router();
const serviceService = require('../services/serviceService');
const employeeService = require('../services/employeeService');
const repairService = require('../services/repairService');
const { requireSession, requireRole } = require('../middleware/auth');

router.use(requireSession);

// GET /services
router.get('/', async (req, res, next) => {
  try {
    const services = await serviceService.getAll();
    res.render('services/index', { title: 'Services', services });
  } catch (err) {
    next(err);
  }
});

// GET /services/new
router.get('/new', requireRole('owner'), async (req, res, next) => {
  try {
    const [technicians, repairs] = await Promise.all([
      employeeService.getAll(),
      repairService.getAll(),
    ]);
    res.render('services/form', { title: 'New Service', service: {}, technicians, repairs, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /services
router.post('/', requireRole('owner'), async (req, res, next) => {
  try {
    await serviceService.create(req.body);
    res.redirect('/services');
  } catch (err) {
    next(err);
  }
});

// GET /services/:id
router.get('/:id', async (req, res, next) => {
  try {
    const service = await serviceService.getById(req.params.id);
    res.render('services/show', { title: 'Service Detail', service });
  } catch (err) {
    next(err);
  }
});

// GET /services/:id/edit
router.get('/:id/edit', requireRole('owner'), async (req, res, next) => {
  try {
    const [service, technicians, repairs] = await Promise.all([
      serviceService.getById(req.params.id),
      employeeService.getAll(),
      repairService.getAll(),
    ]);
    res.render('services/form', { title: 'Edit Service', service, technicians, repairs, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /services/:id
router.post('/:id', requireRole('owner'), async (req, res, next) => {
  try {
    await serviceService.update(req.params.id, req.body);
    res.redirect(`/services/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// POST /services/:id/delete
router.post('/:id/delete', requireRole('owner'), async (req, res, next) => {
  try {
    await serviceService.delete(req.params.id);
    res.redirect('/services');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
