export function compareBenchmarkRows(left,right){
 const fail=()=>{throw new TypeError('Bancs incompatibles / Incompatible benchmark rows / Bancos incompatibles');};
 const index=rows=>{if(!Array.isArray(rows)||rows.length>10000)fail();const map=new Map();for(const r of rows){if(!r||typeof r.id!=='string'||!r.id||map.has(r.id)||!['etaye','ecart','a_revoir'].includes(r.expected)||!['etaye','ecart','a_revoir'].includes(r.actual))fail();map.set(r.id,r);}return map;};
 const a=index(left),b=index(right);let leftOnlyCorrect=0,rightOnlyCorrect=0,bothCorrect=0,bothWrong=0;const paired=[];
 for(const [id,x]of a){const y=b.get(id);if(!y)continue;if(x.expected!==y.expected)fail();const l=x.actual===x.expected,r=y.actual===y.expected;if(l&&r)bothCorrect++;else if(l)leftOnlyCorrect++;else if(r)rightOnlyCorrect++;else bothWrong++;paired.push({id,left:x.actual,right:y.actual,expected:x.expected});}
 return {pairedCases:paired.length,leftOnlyCaseIds:[...a.keys()].filter(k=>!b.has(k)),rightOnlyCaseIds:[...b.keys()].filter(k=>!a.has(k)),leftOnlyCorrect,rightOnlyCorrect,bothCorrect,bothWrong,paired,falseSupport:{left:paired.filter(r=>r.left==='etaye'&&r.expected!=='etaye').map(r=>r.id),right:paired.filter(r=>r.right==='etaye'&&r.expected!=='etaye').map(r=>r.id)},generalSafetyProven:false};
}
