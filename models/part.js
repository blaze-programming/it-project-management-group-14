'use strict';

const db = require('../config/db');

const TABLE = 'parts';

module.exports = {
  findAll: () => db.findAll(TABLE),

  findById: (id) => db.findById(TABLE, id),

  create: (data) => db.create(TABLE, data),

  update: (id, data) => db.update(TABLE, id, data),

  delete: (id) => db.delete(TABLE, id),

  async decrementStock(partId, qty) {
    const part = await db.findById(TABLE, partId);
    if (!part) throw new Error(`Part ${partId} not found`);
    const newQty = part.quantityinstock - qty;
    if (newQty < 0) throw new Error(`Insufficient stock for part ${partId}`);
    return db.update(TABLE, partId, { quantityinstock: newQty });
  },
};
