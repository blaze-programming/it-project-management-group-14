'use strict';

const express = require('express');
const router = express.Router();
const employeeService = require('../../services/employeeService');
const { requireJWTRole } = require('../../middleware/auth');

router.get('/', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const employees = await employeeService.getAll();
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const employee = await employeeService.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const employee = await employeeService.getById(req.params.id);
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    const employee = await employeeService.update(req.params.id, req.body);
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireJWTRole('owner'), async (req, res, next) => {
  try {
    await employeeService.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
