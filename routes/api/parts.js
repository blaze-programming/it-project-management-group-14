'use strict';

const express = require('express');
const router = express.Router();
const partService = require('../../services/partService');
const { requireJWT, requireJWTRole } = require('../../middleware/auth');

router.get('/', requireJWT, async (req, res, next) => {
  try {
    const parts = await partService.getAll();
    res.json(parts);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const part = await partService.create(req.body);
    res.status(201).json(part);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireJWT, async (req, res, next) => {
  try {
    const part = await partService.getById(req.params.id);
    res.json(part);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const part = await partService.update(req.params.id, req.body);
    res.json(part);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    await partService.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
