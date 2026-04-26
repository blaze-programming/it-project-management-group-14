'use strict';

/**
 * config/secrets.js
 * Single place where all runtime secrets are read from environment variables.
 * Exported values are used by middleware/auth.js and routes/auth.js.
 */

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_do_not_use_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
