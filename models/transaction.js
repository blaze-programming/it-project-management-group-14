'use strict';

const db = require('../config/db');

const TABLE = 'transactions';

module.exports = {
  findAll: () => db.findAll(TABLE),

  findById: (id) => db.findById(TABLE, id),

  findByCustomer: (customerid) => db.findAll(TABLE, { customerid }),

  findByInvoiceNumber: (invoicenumber) => db.findOne(TABLE, { invoicenumber }),

  create: (data) => db.create(TABLE, data),

  update: (id, data) => db.update(TABLE, id, data),

  delete: (id) => db.delete(TABLE, id),

  async sumByDateRange(start, end) {
    const all = await db.findAll(TABLE);
    const startDate = new Date(start);
    const endDate = new Date(end);
    const filtered = all.filter((t) => {
      const d = new Date(t.created_at);
      return d >= startDate && d <= endDate;
    });
    const total = filtered.reduce((sum, t) => sum + Number(t.transactionamount), 0);
    return { total, count: filtered.length, rows: filtered };
  },
};
