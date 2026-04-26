'use strict';

/**
 * Centralised error handler.
 * Must be registered last in app.js with four parameters.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(status).json({ error: message });
  }

  res.locals.message = message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  return res.status(status).render('error');
}

module.exports = errorHandler;
