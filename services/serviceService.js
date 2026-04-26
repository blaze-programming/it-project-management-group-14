'use strict';

const Service = require('../models/service');

module.exports = {
  async getAll() {
    return Service.findAll();
  },

  async getById(id) {
    const s = await Service.findById(id);
    if (!s) throw Object.assign(new Error('Service not found'), { status: 404 });
    return s;
  },

  async getByRepair(repairId) {
    return Service.findByRepair(repairId);
  },

  async getByTechnician(technicianId) {
    return Service.findByTechnician(technicianId);
  },

  async create(data) {
    return Service.create(data);
  },

  async update(id, data) {
    await this.getById(id);
    return Service.update(id, data);
  },

  async delete(id) {
    await this.getById(id);
    return Service.delete(id);
  },
};
