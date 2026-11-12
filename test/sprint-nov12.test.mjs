import test from 'node:test';import assert from 'node:assert/strict';
import {benchmarkConfusionCells}from '../src/index.mjs';
test('unsafe support distinguished from generic error rate',()=>{const x=benchmarkConfusionCells([{id:'a',expected:'ecart',actual:'etaye'},{id:'b',expected:'a_revoir',actual:'ecart'},{id:'c',expected:'etaye',actual:'etaye'}]);assert.equal(x.matrix.ecart.etaye,1);assert.deepEqual(x.falseSupportCaseIds,['a']);assert.deepEqual(x.missedRequiredReviewCaseIds,['b']);assert.equal(x.generalSafetyProven,false);});
test('duplicate identifiers cannot inflate benchmark',()=>assert.throws(()=>benchmarkConfusionCells([{id:'a',expected:'etaye',actual:'etaye'},{id:'a',expected:'etaye',actual:'etaye'}])));
test('empty benchmark not general success claim',()=>assert.equal(benchmarkConfusionCells([]).generalSafetyProven,false));
