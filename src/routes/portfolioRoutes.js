const express = require('express');
const svc = require('../services/portfolioService');
const router = express.Router();

router.get('/holdings', (req,res) => {
  try { res.json(svc.getHoldings()); }
  catch(err){ console.error(err); res.status(500).json({ error:'Failed to fetch holdings' }); }
});

router.get('/allocation', (req,res) => {
  try { res.json(svc.getAllocation()); }
  catch(err){ console.error(err); res.status(500).json({ error:'Failed to fetch allocation' }); }
});

router.get('/performance', (req,res) => {
  try { res.json(svc.getPerformance()); }
  catch(err){ console.error(err); res.status(500).json({ error:'Failed to fetch performance' }); }
});

router.get('/summary', (req,res) => {
  try { res.json(svc.getSummary()); }
  catch(err){ console.error(err); res.status(500).json({ error:'Failed to fetch summary' }); }
});

module.exports = router;
