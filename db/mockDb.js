'use strict';

/**
 * db/mockDb.js
 * In-memory mock database for development and testing.
 * Exposes the same DataService interface used by models so the rest of the
 * app never needs to know which back-end is active.
 */

const bcrypt = require('bcrypt');

// ─── Seed data ────────────────────────────────────────────────────────────────

const HASH = '$2b$10$abcdefghijklmnopqrstuuVGmBCxG4/PJH5Ber9VHgjRiEKLo.hAa'; // "password123"

const _store = {
  customers: [
    {
      customerid: 1,
      firstname: 'Alice',
      lastname: 'Johnson',
      streetaddress: '123 Maple St',
      city: 'Springfield',
      zipcode: '62701',
      email: 'alice@example.com',
      phonenumber: '555-0101',
      password: HASH,
      created_at: new Date('2024-01-10'),
    },
    {
      customerid: 2,
      firstname: 'Bob',
      lastname: 'Williams',
      streetaddress: '456 Oak Ave',
      city: 'Shelbyville',
      zipcode: '62702',
      email: 'bob@example.com',
      phonenumber: '555-0102',
      password: HASH,
      created_at: new Date('2024-02-15'),
    },
    {
      customerid: 3,
      firstname: 'Carol',
      lastname: 'Martinez',
      streetaddress: '789 Pine Rd',
      city: 'Capital City',
      zipcode: '62703',
      email: 'carol@example.com',
      phonenumber: '555-0103',
      password: HASH,
      created_at: new Date('2024-03-20'),
    },
  ],

  vehicles: [
    {
      vehicleid: 1,
      customerid: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      color: 'Silver',
      licenseplatenumber: 'ABC-1234',
      vin: '1HGBH41JXMN109186',
      created_at: new Date('2024-01-11'),
    },
    {
      vehicleid: 2,
      customerid: 2,
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      color: 'Blue',
      licenseplatenumber: 'XYZ-5678',
      vin: '2T1BURHE0JC034303',
      created_at: new Date('2024-02-16'),
    },
    {
      vehicleid: 3,
      customerid: 3,
      make: 'Ford',
      model: 'F-150',
      year: 2020,
      color: 'Red',
      licenseplatenumber: 'DEF-9012',
      vin: '1FTEW1EF0GKE12345',
      created_at: new Date('2024-03-21'),
    },
  ],

  employees: [
    {
      employeeid: 1,
      firstname: 'Mike',
      lastname: 'Owner',
      streetaddress: '10 Boss Lane',
      city: 'Springfield',
      zipcode: '62701',
      email: 'owner@autorepair.com',
      password: HASH,
      phonenumber: '555-0001',
      hourlywage: 50.00,
      position: 'Owner',
      hiringdate: new Date('2020-01-01'),
      role: 'owner',
      created_at: new Date('2020-01-01'),
    },
    {
      employeeid: 2,
      firstname: 'Jane',
      lastname: 'Wrench',
      streetaddress: '20 Tool St',
      city: 'Springfield',
      zipcode: '62701',
      email: 'jane@autorepair.com',
      password: HASH,
      phonenumber: '555-0002',
      hourlywage: 25.00,
      position: 'Lead Technician',
      hiringdate: new Date('2021-06-01'),
      role: 'technician',
      created_at: new Date('2021-06-01'),
    },
    {
      employeeid: 3,
      firstname: 'Tom',
      lastname: 'Bolt',
      streetaddress: '30 Gear Ave',
      city: 'Springfield',
      zipcode: '62701',
      email: 'tom@autorepair.com',
      password: HASH,
      phonenumber: '555-0003',
      hourlywage: 22.00,
      position: 'Technician',
      hiringdate: new Date('2022-03-15'),
      role: 'technician',
      created_at: new Date('2022-03-15'),
    },
  ],

  parts: [
    {
      partid: 1,
      partname: 'Oil Filter',
      vendorname: 'AutoParts Co.',
      cost: 8.99,
      quantityinstock: 50,
      created_at: new Date('2024-01-05'),
    },
    {
      partid: 2,
      partname: 'Brake Pad Set',
      vendorname: 'BrakeMaster Ltd.',
      cost: 45.00,
      quantityinstock: 20,
      created_at: new Date('2024-01-05'),
    },
    {
      partid: 3,
      partname: 'Air Filter',
      vendorname: 'AutoParts Co.',
      cost: 12.50,
      quantityinstock: 3,
      created_at: new Date('2024-01-05'),
    },
  ],

  repairs: [
    {
      repairid: 1,
      vehicleid: 1,
      technicianid: 2,
      partid: 1,
      scheduleddate: new Date('2024-04-10'),
      scheduledtime: '09:00',
      isplanned: true,
      iscompleted: false,
      created_at: new Date('2024-04-01'),
    },
    {
      repairid: 2,
      vehicleid: 2,
      technicianid: 3,
      partid: 2,
      scheduleddate: new Date('2024-04-11'),
      scheduledtime: '10:00',
      isplanned: true,
      iscompleted: true,
      created_at: new Date('2024-04-02'),
    },
    {
      repairid: 3,
      vehicleid: 3,
      technicianid: 2,
      partid: 3,
      scheduleddate: new Date('2024-04-12'),
      scheduledtime: '14:00',
      isplanned: true,
      iscompleted: false,
      created_at: new Date('2024-04-03'),
    },
  ],

  services: [
    {
      serviceid: 1,
      servicename: 'Oil Change',
      hourlycost: 30.00,
      scheduleddate: new Date('2024-04-10'),
      scheduledtime: '09:00',
      technicianid: 2,
      repairid: 1,
      created_at: new Date('2024-04-01'),
    },
    {
      serviceid: 2,
      servicename: 'Brake Replacement',
      hourlycost: 60.00,
      scheduleddate: new Date('2024-04-11'),
      scheduledtime: '10:00',
      technicianid: 3,
      repairid: 2,
      created_at: new Date('2024-04-02'),
    },
    {
      serviceid: 3,
      servicename: 'Air Filter Replacement',
      hourlycost: 20.00,
      scheduleddate: new Date('2024-04-12'),
      scheduledtime: '14:00',
      technicianid: 2,
      repairid: 3,
      created_at: new Date('2024-04-03'),
    },
  ],

  transactions: [
    {
      transactionid: 1,
      customerid: 2,
      serviceid: 2,
      repairid: 2,
      transactionamount: 105.00,
      paymentmethod: 'Credit Card',
      routingnumber: null,
      invoicenumber: 'INV-2024-001',
      created_at: new Date('2024-04-11'),
    },
  ],
};

// ─── Auto-increment counters ───────────────────────────────────────────────────

const _counters = {
  customers: 3,
  vehicles: 3,
  employees: 3,
  parts: 3,
  repairs: 3,
  services: 3,
  transactions: 1,
};

function nextId(table) {
  _counters[table] += 1;
  return _counters[table];
}

// ─── Generic CRUD helpers ──────────────────────────────────────────────────────

function idKey(table) {
  const map = {
    customers: 'customerid',
    vehicles: 'vehicleid',
    employees: 'employeeid',
    parts: 'partid',
    repairs: 'repairid',
    services: 'serviceid',
    transactions: 'transactionid',
  };
  return map[table];
}

const DataService = {
  // ── Generic table operations ─────────────────────────────────────────────────

  findAll(table, filter = {}) {
    let rows = _store[table];
    for (const [key, val] of Object.entries(filter)) {
      rows = rows.filter((r) => r[key] == val); // eslint-disable-line eqeqeq
    }
    return Promise.resolve(rows.map((r) => ({ ...r })));
  },

  findById(table, id) {
    const pk = idKey(table);
    const row = _store[table].find((r) => r[pk] == id); // eslint-disable-line eqeqeq
    return Promise.resolve(row ? { ...row } : null);
  },

  findOne(table, filter = {}) {
    let rows = _store[table];
    for (const [key, val] of Object.entries(filter)) {
      rows = rows.filter((r) => r[key] == val); // eslint-disable-line eqeqeq
    }
    return Promise.resolve(rows.length ? { ...rows[0] } : null);
  },

  create(table, data) {
    const pk = idKey(table);
    const id = nextId(table);
    const row = { [pk]: id, created_at: new Date(), ...data };
    _store[table].push(row);
    return Promise.resolve({ ...row });
  },

  update(table, id, data) {
    const pk = idKey(table);
    const idx = _store[table].findIndex((r) => r[pk] == id); // eslint-disable-line eqeqeq
    if (idx === -1) return Promise.resolve(null);
    _store[table][idx] = { ..._store[table][idx], ...data };
    return Promise.resolve({ ..._store[table][idx] });
  },

  delete(table, id) {
    const pk = idKey(table);
    const idx = _store[table].findIndex((r) => r[pk] == id); // eslint-disable-line eqeqeq
    if (idx === -1) return Promise.resolve(false);
    _store[table].splice(idx, 1);
    return Promise.resolve(true);
  },

  // ── Utility: reset store (used in tests) ─────────────────────────────────────
  _reset() {
    // Re-seed is complex; for tests just clear and re-require
    throw new Error('Use jest.resetModules() to reset mockDb in tests');
  },

  // ── Expose raw store for advanced test assertions ─────────────────────────────
  _store,
};

module.exports = DataService;
