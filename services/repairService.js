'use strict';

const Repair = require('../models/repair');
const Part = require('../models/part');
const Vehicle = require('../models/vehicle');

module.exports = {
  async getAll() {
    return Repair.findAll();
  },

  async getById(id) {
    const r = await Repair.findById(id);
    if (!r) throw Object.assign(new Error('Repair not found'), { status: 404 });
    return r;
  },

  async getByVehicle(vehicleId) {
    return Repair.findByVehicle(vehicleId);
  },

  async getByTechnician(technicianId) {
    return Repair.findByTechnician(technicianId);
  },

  async create(data) {
    const { technicianid, scheduleddate, scheduledtime, vehicleid, partid } = data;

    // Check vehicle exists
    const vehicle = await Vehicle.findById(vehicleid);
    if (!vehicle) throw Object.assign(new Error('Vehicle not found'), { status: 404 });

    // Check technician availability (no overlap for same date+time)
    const existing = await Repair.findByTechnician(technicianid);
    const conflict = existing.find(
      (r) =>
        r.scheduleddate &&
        new Date(r.scheduleddate).toDateString() === new Date(scheduleddate).toDateString() &&
        r.scheduledtime === scheduledtime &&
        !r.iscompleted
    );
    if (conflict) {
      throw Object.assign(
        new Error('Technician already has a repair scheduled at that date and time'),
        { status: 409 }
      );
    }

    // Decrement part stock if part is specified
    if (partid) {
      await Part.decrementStock(partid, 1);
    }

    return Repair.create(data);
  },

  async update(id, data) {
    await this.getById(id);
    return Repair.update(id, data);
  },

  async complete(id) {
    await this.getById(id);
    return Repair.complete(id);
  },

  async delete(id) {
    await this.getById(id);
    return Repair.delete(id);
  },
};
