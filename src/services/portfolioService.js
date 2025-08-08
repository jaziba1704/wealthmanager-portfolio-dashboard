const sample = require('../data/sampleData.json');
const { calculateHoldingMetrics, calcAllocation, calcSummary } = require('../utils/calculations');

// Return holdings with computed metrics
function getHoldings(){
  return (sample.holdings || []).map(h => calculateHoldingMetrics(h));
}

// Return allocation obj
function getAllocation(){
  return calcAllocation(getHoldings());
}

// Return performance object
function getPerformance(){
  return sample.performance || { timeline: [], returns: {} };
}

// Return summary object
function getSummary(){
  return calcSummary(getHoldings());
}

module.exports = { getHoldings, getAllocation, getPerformance, getSummary };
