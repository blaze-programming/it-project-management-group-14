'use strict';

const Vehicle = require('../models/vehicle');
const Customer = require('../models/customer');

module.exports = {
  async getAll() {
    return Vehicle.findAll();
  },

  async getById(id) {
    const v = await Vehicle.findById(id);
    if (!v) throw Object.assign(new Error('Vehicle not found'), { status: 404 });
    return v;
  },

  async getByCustomer(customerId) {
    return Vehicle.findByCustomer(customerId);
  },

  async create(data) {
    const { vin, customerid } = data;
    const existing = await Vehicle.findByVin(vin);
    if (existing) throw Object.assign(new Error('VIN already registered'), { status: 409 });
    const customer = await Customer.findById(customerid);
    if (!customer) throw Object.assign(new Error('Customer not found'), { status: 404 });
    return Vehicle.create(data);
  },

  async update(id, data) {
    await this.getById(id);
    return Vehicle.update(id, data);
  },

  async delete(id) {
    await this.getById(id);
    return Vehicle.delete(id);
  },
};
