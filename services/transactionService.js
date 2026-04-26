'use strict';

const Transaction = require('../models/transaction');

module.exports = {
  async getAll() {
    return Transaction.findAll();
  },

  async getById(id) {
    const t = await Transaction.findById(id);
    if (!t) throw Object.assign(new Error('Transaction not found'), { status: 404 });
    return t;
  },

  async getByCustomer(customerId) {
    return Transaction.findByCustomer(customerId);
  },

  async create(data) {
    // Generate invoice number if not provided
    const invoiceNumber =
      data.invoicenumber || `INV-${Date.now()}`;
    return Transaction.create({ ...data, invoicenumber: invoiceNumber });
  },

  async update(id, data) {
    await this.getById(id);
    return Transaction.update(id, data);
  },

  async delete(id) {
    await this.getById(id);
    return Transaction.delete(id);
  },

  async getCashFlowSummary(startDate, endDate) {
    const { total, count, rows } = await Transaction.sumByDateRange(startDate, endDate);

    // Group by payment method
    const byMethod = {};
    for (const t of rows) {
      const method = t.paymentmethod || 'Unknown';
      if (!byMethod[method]) byMethod[method] = { total: 0, count: 0 };
      byMethod[method].total += Number(t.transactionamount);
      byMethod[method].count += 1;
    }

    return { total, count, byMethod, rows };
  },
};
