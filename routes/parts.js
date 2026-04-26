'use strict';

const express = require('express');
const router = express.Router();
const partService = require('../services/partService');
const { requireSession, requireRole } = require('../middleware/auth');

router.use(requireSession);

// GET /parts
router.get('/', async (req, res, next) => {
  try {
    const parts = await partService.getAll();
    res.render('parts/index', { title: 'Parts Inventory', parts });
  } catch (err) {
    next(err);
  }
});

// GET /parts/new
router.get('/new', requireRole('owner'), (req, res) => {
  res.render('parts/form', { title: 'New Part', part: {}, error: null });
});

// POST /parts
router.post('/', requireRole('owner'), async (req, res, next) => {
  try {
    await partService.create(req.body);
    res.redirect('/parts');
  } catch (err) {
    next(err);
  }
});

// GET /parts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const part = await partService.getById(req.params.id);
    res.render('parts/show', { title: 'Part Detail', part });
  } catch (err) {
    next(err);
  }
});

// GET /parts/:id/edit
router.get('/:id/edit', requireRole('owner'), async (req, res, next) => {
  try {
    const part = await partService.getById(req.params.id);
    res.render('parts/form', { title: 'Edit Part', part, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /parts/:id
router.post('/:id', requireRole('owner'), async (req, res, next) => {
  try {
    await partService.update(req.params.id, req.body);
    res.redirect(`/parts/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// POST /parts/:id/delete
router.post('/:id/delete', requireRole('owner'), async (req, res, next) => {
  try {
    await partService.delete(req.params.id);
    res.redirect('/parts');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
