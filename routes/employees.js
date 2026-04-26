'use strict';

const express = require('express');
const router = express.Router();
const employeeService = require('../services/employeeService');
const { requireSession, requireRole } = require('../middleware/auth');

router.use(requireSession, requireRole('owner'));

// GET /employees
router.get('/', async (req, res, next) => {
  try {
    const employees = await employeeService.getAll();
    res.render('employees/index', { title: 'Employees', employees });
  } catch (err) {
    next(err);
  }
});

// GET /employees/new
router.get('/new', (req, res) => {
  res.render('employees/form', { title: 'New Employee', employee: {}, error: null });
});

// POST /employees
router.post('/', async (req, res, next) => {
  try {
    await employeeService.create(req.body);
    res.redirect('/employees');
  } catch (err) {
    if (err.status === 409) {
      return res.render('employees/form', { title: 'New Employee', employee: req.body, error: err.message });
    }
    next(err);
  }
});

// GET /employees/:id
router.get('/:id', async (req, res, next) => {
  try {
    const employee = await employeeService.getById(req.params.id);
    res.render('employees/show', { title: 'Employee Detail', employee });
  } catch (err) {
    next(err);
  }
});

// GET /employees/:id/edit
router.get('/:id/edit', async (req, res, next) => {
  try {
    const employee = await employeeService.getById(req.params.id);
    res.render('employees/form', { title: 'Edit Employee', employee, error: null });
  } catch (err) {
    next(err);
  }
});

// POST /employees/:id
router.post('/:id', async (req, res, next) => {
  try {
    await employeeService.update(req.params.id, req.body);
    res.redirect(`/employees/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// POST /employees/:id/delete
router.post('/:id/delete', async (req, res, next) => {
  try {
    await employeeService.delete(req.params.id);
    res.redirect('/employees');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
