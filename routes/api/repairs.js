'use strict';

const express = require('express');
const router = express.Router();
const repairService = require('../../services/repairService');
const { requireJWT, requireJWTRole } = require('../../middleware/auth');

router.get('/', requireJWT, async (req, res, next) => {
  try {
    let repairs = await repairService.getAll();
    if (req.user.role === 'technician') {
      repairs = repairs.filter((r) => String(r.technicianid) === String(req.user.id));
    }
    res.json(repairs);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireJWTRole('owner', 'technician'), async (req, res, next) => {
  try {
    const repair = await repairService.create(req.body);
    res.status(201).json(repair);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireJWT, async (req, res, next) => {
  try {
    const repair = await repairService.getById(req.params.id);
    res.json(repair);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireJWTRole('owner', 'technician'), async (req, res, next) => {
  try {
    const repair = await repairService.update(req.params.id, req.body);
    res.json(repair);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/complete', requireJWTRole('owner', 'technician'), async (req, res, next) => {
  try {
    const repair = await repairService.complete(req.params.id);
    res.json(repair);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    await repairService.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
