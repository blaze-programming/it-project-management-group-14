'use strict';

const bcrypt = require('bcrypt');
const Customer = require('../models/customer');
const Vehicle = require('../models/vehicle');

const SALT_ROUNDS = 10;

module.exports = {
  async getAll() {
    return Customer.findAll();
  },

  async getById(id) {
    const customer = await Customer.findById(id);
    if (!customer) throw Object.assign(new Error('Customer not found'), { status: 404 });
    return customer;
  },

  async getWithDetails(id) {
    const customer = await this.getById(id);
    const vehicles = await Vehicle.findByCustomer(id);
    return { ...customer, vehicles };
  },

  async create(data) {
    const { email, password, ...rest } = data;
    const existing = await Customer.findByEmail(email);
    if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return Customer.create({ ...rest, email, password: hashedPassword });
  },

  async update(id, data) {
    await this.getById(id); // 404 if not found
    const { password, ...rest } = data;
    const updates = { ...rest };
    if (password) {
      updates.password = await bcrypt.hash(password, SALT_ROUNDS);
    }
    return Customer.update(id, updates);
  },

  async delete(id) {
    await this.getById(id);
    return Customer.delete(id);
  },

  async verifyCredentials(email, password) {
    const customer = await Customer.findByEmail(email);
    if (!customer) return null;
    const match = await bcrypt.compare(password, customer.password);
    return match ? customer : null;
  },
};
