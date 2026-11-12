export function benchmarkConfusionCells(rows){
 const labels=['etaye','ecart','a_revoir'];const fail=()=>{throw new TypeError('Banc invalide / Invalid benchmark / Banco inválido');};
 if(!Array.isArray(rows)||rows.length>10000)fail();const ids=new Set(),matrix=Object.fromEntries(labels.map(a=>[a,Object.fromEntries(labels.map(b=>[b,0]))]));
 for(const r of rows){if(typeof r.id!=='string'||!r.id||ids.has(r.id)||!labels.includes(r.expected)||!labels.includes(r.actual))fail();ids.add(r.id);matrix[r.expected][r.actual]++;}
 const falseSupport=rows.filter(r=>r.actual==='etaye'&&r.expected!=='etaye');const requiredReview=rows.filter(r=>r.expected==='a_revoir');return {cases:rows.length,matrix,falseSupportCaseIds:falseSupport.map(r=>r.id),missedRequiredReviewCaseIds:requiredReview.filter(r=>r.actual!=='a_revoir').map(r=>r.id),generalSafetyProven:false};
}
