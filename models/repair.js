'use strict';

const db = require('../config/db');

const TABLE = 'repairs';

module.exports = {
  findAll: () => db.findAll(TABLE),

  findById: (id) => db.findById(TABLE, id),

  findByVehicle: (vehicleid) => db.findAll(TABLE, { vehicleid }),

  findByTechnician: (technicianid) => db.findAll(TABLE, { technicianid }),

  create: (data) => db.create(TABLE, data),

  update: (id, data) => db.update(TABLE, id, data),

  delete: (id) => db.delete(TABLE, id),

  complete: (id) => db.update(TABLE, id, { iscompleted: true }),
};
