'use strict';

var express = require('express');
var router = express.Router();
var repairService = require('../services/repairService');
var partService = require('../services/partService');
var transactionService = require('../services/transactionService');
var serviceService = require('../services/serviceService');
var { requireSession } = require('../middleware/auth');

/* GET dashboard */
router.get('/', requireSession, async function (req, res, next) {
  try {
    const today = new Date().toDateString();

    const [allRepairs, lowStockParts, allServices, cashFlow] = await Promise.all([
      repairService.getAll(),
      partService.getLowStock(),
      serviceService.getAll(),
      transactionService.getCashFlowSummary(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      ),
    ]);

    const openRepairs = allRepairs.filter((r) => !r.iscompleted);
    const todayServices = allServices.filter(
      (s) => s.scheduleddate && new Date(s.scheduleddate).toDateString() === today
    );

    res.render('index', {
      title: 'Dashboard — Auto Repair Shop',
      user: req.session.user,
      openRepairs: openRepairs.length,
      todayServices: todayServices.length,
      lowStockCount: lowStockParts.length,
      weeklyRevenue: cashFlow.total.toFixed(2),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
