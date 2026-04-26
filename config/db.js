'use strict';

require('dotenv').config();

/**
 * config/db.js
 * Exports a DataService object whose methods are the same regardless of
 * whether we are using the in-memory mock DB or a real PostgreSQL pool.
 *
 * When USE_MOCK_DB=true  →  returns the mock data-service (no DB needed)
 * When USE_MOCK_DB=false →  returns a thin wrapper around pg.Pool
 */

if (process.env.USE_MOCK_DB === 'false') {
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  /**
   * Execute a parameterised SQL query and return all rows.
   */
  const query = async (text, params) => {
    const result = await pool.query(text, params);
    return result.rows;
  };

  module.exports = { query, pool };
} else {
  // Default: use mock DB (safe for testing / development without a real DB)
  module.exports = require('../db/mockDb');
}
