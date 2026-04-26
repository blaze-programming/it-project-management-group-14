'use strict';

const db = require('../config/db');

const TABLE = 'customers';

module.exports = {
  findAll: () => db.findAll(TABLE),

  findById: (id) => db.findById(TABLE, id),

  findByEmail: (email) => db.findOne(TABLE, { email }),

  findByCustomerId: (customerid) => db.findAll(TABLE, { customerid }),

  create: (data) => db.create(TABLE, data),

  update: (id, data) => db.update(TABLE, id, data),

  delete: (id) => db.delete(TABLE, id),
};
