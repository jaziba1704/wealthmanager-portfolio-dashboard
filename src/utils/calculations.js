// calculations.js — documented calculation logic for reviewers

function toNum(v){ return typeof v === 'number' ? v : Number(v || 0); }

/**
 * calculateHoldingMetrics
 *  - value = quantity * currentPrice
 *  - invested = quantity * avgPrice
 *  - gainLoss = (currentPrice - avgPrice) * quantity
 *  - gainLossPercent = gainLoss / invested * 100 (guard divide by zero)
 */
function calculateHoldingMetrics(h){
  const quantity = toNum(h.quantity);
  const avgPrice = toNum(h.avgPrice);
  const currentPrice = toNum(h.currentPrice);

  const value = Number((quantity * currentPrice).toFixed(2));
  const invested = Number((quantity * avgPrice).toFixed(2));
  const gainLoss = Number(((currentPrice - avgPrice) * quantity).toFixed(2));
  const gainLossPercent = invested > 0 ? Number(((gainLoss / invested) * 100).toFixed(2)) : 0;

  return {...h, quantity, avgPrice, currentPrice, value, invested, gainLoss, gainLossPercent};
}

/**
 * calcAllocation: creates bySector & byMarketCap objects with value and percentage
 */
function calcAllocation(holdings){
  const total = holdings.reduce((s,h)=>s+h.value,0) || 1;
  const bySector = {}, byMarketCap = {};
  holdings.forEach(h=>{
    bySector[h.sector] = (bySector[h.sector] || 0) + h.value;
    byMarketCap[h.marketCap] = (byMarketCap[h.marketCap] || 0) + h.value;
  });
  Object.keys(bySector).forEach(k=>{
    const v = bySector[k];
    bySector[k] = { value: Number(v.toFixed(2)), percentage: Number(((v/total)*100).toFixed(2)) };
  });
  Object.keys(byMarketCap).forEach(k=>{
    const v = byMarketCap[k];
    byMarketCap[k] = { value: Number(v.toFixed(2)), percentage: Number(((v/total)*100).toFixed(2)) };
  });
  return { bySector, byMarketCap };
}

/**
 * calcSummary: totals, top/worst performer and diversification (HHI scaled)
 */
function calcSummary(holdings){
  const totalValue = Number(holdings.reduce((s,h)=>s+h.value,0).toFixed(2));
  const totalInvested = Number(holdings.reduce((s,h)=>s+(h.invested||0),0).toFixed(2));
  const totalGainLoss = Number((totalValue - totalInvested).toFixed(2));
  const totalGainLossPercent = totalInvested>0 ? Number(((totalGainLoss/totalInvested)*100).toFixed(2)) : 0;

  const sorted = [...holdings].sort((a,b)=>b.gainLossPercent - a.gainLossPercent);
  const topPerformer = sorted[0] ? { symbol: sorted[0].symbol, name: sorted[0].name, gainPercent: sorted[0].gainLossPercent } : null;
  const worstPerformer = sorted.length ? { symbol: sorted[sorted.length-1].symbol, name: sorted[sorted.length-1].name, gainPercent: sorted[sorted.length-1].gainLossPercent } : null;

  // HHI on sectors
  const sectorTotals = {};
  holdings.forEach(h=> sectorTotals[h.sector] = (sectorTotals[h.sector] || 0) + h.value);
  const total = Object.values(sectorTotals).reduce((s,v)=>s+v,0) || 1;
  let hhi = 0;
  Object.values(sectorTotals).forEach(v => { const share = v/total; hhi += share*share; });
  const diversificationScore = Number((10*(1-hhi)).toFixed(2));
  const riskLevel = diversificationScore < 4 ? 'High' : diversificationScore < 7 ? 'Moderate' : 'Low';

  return { totalValue, totalInvested, totalGainLoss, totalGainLossPercent, topPerformer, worstPerformer, diversificationScore, riskLevel };
}

module.exports = { calculateHoldingMetrics, calcAllocation, calcSummary };
