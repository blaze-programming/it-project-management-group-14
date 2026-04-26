'use strict';

const db = require('../config/db');

const TABLE = 'services';

module.exports = {
  findAll: () => db.findAll(TABLE),

  findById: (id) => db.findById(TABLE, id),

  findByRepair: (repairid) => db.findAll(TABLE, { repairid }),

  findByTechnician: (technicianid) => db.findAll(TABLE, { technicianid }),

  create: (data) => db.create(TABLE, data),

  update: (id, data) => db.update(TABLE, id, data),

  delete: (id) => db.delete(TABLE, id),
};
