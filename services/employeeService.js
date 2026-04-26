'use strict';

const bcrypt = require('bcrypt');
const Employee = require('../models/employee');

const SALT_ROUNDS = 10;

module.exports = {
  async getAll() {
    const employees = await Employee.findAll();
    // Never expose password hashes in listings
    return employees.map(({ password, ...e }) => e);
  },

  async getById(id) {
    const e = await Employee.findById(id);
    if (!e) throw Object.assign(new Error('Employee not found'), { status: 404 });
    const { password, ...rest } = e;
    return rest;
  },

  async create(data) {
    const { email, password, ...rest } = data;
    const existing = await Employee.findByEmail(email);
    if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const created = await Employee.create({ ...rest, email, password: hashedPassword });
    const { password: _pw, ...result } = created;
    return result;
  },

  async update(id, data) {
    await this.getById(id);
    const { password, ...rest } = data;
    const updates = { ...rest };
    if (password) {
      updates.password = await bcrypt.hash(password, SALT_ROUNDS);
    }
    const updated = await Employee.update(id, updates);
    const { password: _pw, ...result } = updated;
    return result;
  },

  async delete(id) {
    await this.getById(id);
    return Employee.delete(id);
  },

  async verifyCredentials(email, password) {
    const employee = await Employee.findByEmail(email);
    if (!employee) return null;
    const match = await bcrypt.compare(password, employee.password);
    return match ? employee : null;
  },
};
