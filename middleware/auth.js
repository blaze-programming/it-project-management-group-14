'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

/**
 * requireSession – protects web routes.
 * Expects req.session.user to be set after login.
 */
function requireSession(req, res, next) {
  if (req.session && req.session.user) return next();
  if (req.accepts('html')) {
    return res.redirect('/auth/login');
  }
  return res.status(401).json({ error: 'Authentication required' });
}

/**
 * requireRole(role) – additionally checks the user's role.
 * Use after requireSession.
 * role can be 'owner', 'technician', or 'customer'.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.session && req.session.user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(user.role)) {
      if (req.accepts('html')) {
        return res.status(403).render('error', {
          message: 'Forbidden',
          error: { status: 403, stack: '' },
        });
      }
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    return next();
  };
}

/**
 * requireJWT – protects API routes.
 * Expects Authorization: Bearer <token>.
 */
function requireJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * requireJWTRole(role) – additionally checks JWT payload role.
 */
function requireJWTRole(...roles) {
  return (req, res, next) => {
    requireJWT(req, res, () => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return next();
    });
  };
}

module.exports = { requireSession, requireRole, requireJWT, requireJWTRole };
