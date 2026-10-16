import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildWords, shuffled, accepts } from '../dist/quiz.js';
const data = JSON.parse(await readFile(new URL('../dist/emotions.json', import.meta.url)));
const words = buildWords(data.families);
test('all eight chart families have nonempty, unique terms', () => {
  assert.equal(data.families.length, 8);
  assert.equal(new Set(data.families.map(f => f.id)).size, 8);
  for (const f of data.families) { assert.ok(f.terms.length); assert.equal(new Set(f.terms).size, f.terms.length); }
});
test('overlapping words accept each chart family and reject others', () => {
  for (const [term, families] of [['Hurt', ['sad','anger']], ['Delighted',['happy','surprise']], ['Balanced',['confident','calm']], ['Warm',['calm','love']]]) {
    const word = words.find(w => w.term === term);
    assert.deepEqual(word.families, families);
    for (const f of data.families) assert.equal(accepts(word, f.id), families.includes(f.id));
  }
});
test('quiz pool includes every chart entry once per distinct word', () => {
  assert.equal(words.length, new Set(data.families.flatMap(f => f.terms.map(t => t.toLowerCase()))).size);
  for (const f of data.families) for (const term of f.terms) assert.ok(accepts(words.find(w => w.term === term),f.id));
});
test('shuffle preserves the complete pool without mutating it', () => {
  const original = [...words], result = shuffled(words);
  assert.deepEqual(words, original);
  assert.equal(new Set(result).size, words.length);
  assert.deepEqual(new Set(result), new Set(words));
});
