'use strict';

const express = require('express');
const router = express.Router();
const repairService = require('../services/repairService');
const employeeService = require('../services/employeeService');
const vehicleService = require('../services/vehicleService');
const partService = require('../services/partService');
const { requireSession, requireRole } = require('../middleware/auth');

router.use(requireSession);

// GET /repairs
router.get('/', async (req, res, next) => {
  try {
    let repairs = await repairService.getAll();
    // Technicians only see their own repairs
    if (req.session.user.role === 'technician') {
      repairs = repairs.filter((r) => String(r.technicianid) === String(req.session.user.id));
    }
    res.render('repairs/index', { title: 'Repairs', repairs });
  } catch (err) {
    next(err);
  }
});

// GET /repairs/new
router.get('/new', requireRole('owner', 'technician'), async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAll();
    const technicians = await employeeService.getAll();
    const parts = await partService.getAll();
    res.render('repairs/form', {
      title: 'Schedule Repair',
      repair: {},
      vehicles,
      technicians,
      parts,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// POST /repairs
router.post('/', requireRole('owner', 'technician'), async (req, res, next) => {
  try {
    await repairService.create(req.body);
    res.redirect('/repairs');
  } catch (err) {
    if (err.status === 409 || err.status === 404) {
      const [vehicles, technicians, parts] = await Promise.all([
        vehicleService.getAll(),
        employeeService.getAll(),
        partService.getAll(),
      ]);
      return res.render('repairs/form', {
        title: 'Schedule Repair',
        repair: req.body,
        vehicles,
        technicians,
        parts,
        error: err.message,
      });
    }
    next(err);
  }
});

// GET /repairs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const repair = await repairService.getById(req.params.id);
    res.render('repairs/show', { title: 'Repair Detail', repair });
  } catch (err) {
    next(err);
  }
});

// GET /repairs/:id/edit
router.get('/:id/edit', requireRole('owner', 'technician'), async (req, res, next) => {
  try {
    const [repair, vehicles, technicians, parts] = await Promise.all([
      repairService.getById(req.params.id),
      vehicleService.getAll(),
      employeeService.getAll(),
      partService.getAll(),
    ]);
    res.render('repairs/form', { title: 'Edit Repair', repair, vehicles, technicians, parts, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /repairs/:id
router.post('/:id', requireRole('owner', 'technician'), async (req, res, next) => {
  try {
    await repairService.update(req.params.id, req.body);
    res.redirect(`/repairs/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// POST /repairs/:id/complete
router.post('/:id/complete', requireRole('owner', 'technician'), async (req, res, next) => {
  try {
    await repairService.complete(req.params.id);
    res.redirect(`/repairs/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// POST /repairs/:id/delete
router.post('/:id/delete', requireRole('owner'), async (req, res, next) => {
  try {
    await repairService.delete(req.params.id);
    res.redirect('/repairs');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
