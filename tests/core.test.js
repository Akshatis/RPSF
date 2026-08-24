const assert = require('assert');
function reg(n, year=2026){ return `RPSF/GKP/${year}/BT/${String(n).padStart(6,'0')}` }
function result(answers, keys, pass=50){ const correct=answers.filter((a,i)=>a===keys[i]).length; return {correct, marks:correct, percent:correct/keys.length*100, pass:correct/keys.length*100>=pass} }
assert.equal(reg(1), 'RPSF/GKP/2026/BT/000001');
assert.deepEqual(result(['A','B'],['A','C']), {correct:1,marks:1,percent:50,pass:true});
assert.equal(result([],['A','B']).pass, false);
console.log('Core registration and result rules passed');
