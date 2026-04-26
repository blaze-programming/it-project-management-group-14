'use strict';

const Part = require('../models/part');

const LOW_STOCK_THRESHOLD = 5;

module.exports = {
  async getAll() {
    return Part.findAll();
  },

  async getById(id) {
    const p = await Part.findById(id);
    if (!p) throw Object.assign(new Error('Part not found'), { status: 404 });
    return p;
  },

  async getLowStock() {
    const all = await Part.findAll();
    return all.filter((p) => p.quantityinstock <= LOW_STOCK_THRESHOLD);
  },

  async create(data) {
    return Part.create(data);
  },

  async update(id, data) {
    await this.getById(id);
    return Part.update(id, data);
  },

  async delete(id) {
    await this.getById(id);
    return Part.delete(id);
  },

  async decrementStock(partId, qty = 1) {
    return Part.decrementStock(partId, qty);
  },
};
