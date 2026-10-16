import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildWords } from '../dist/quiz.js';
import { definitionMarkup } from '../dist/definitions.js';
const vocabulary = JSON.parse(await readFile(new URL('../dist/emotions.json', import.meta.url)));
const dictionary = JSON.parse(await readFile(new URL('../dist/definitions.json', import.meta.url)));
const words = buildWords(vocabulary.families);

test('every quiz word has a substantive, attributed dictionary definition', () => {
  assert.deepEqual(Object.keys(dictionary.entries).sort(), words.map(w => w.term.toLowerCase()).sort());
  for (const word of words) {
    const entry = dictionary.entries[word.term.toLowerCase()];
    assert.equal(entry.term, word.term);
    for (const key of ['definition','lookupTerm','partOfSpeech','source','license']) assert.ok(entry[key]?.trim(), `${word.term}: ${key}`);
    for (const key of ['sourceUrl','licenseUrl']) assert.equal(new URL(entry[key]).protocol, 'https:');
    assert.doesNotMatch(entry.definition, /simple past|past participle|\.mw-parser|<\/?[a-z][^>]*>/i, word.term);
    if (entry.source === 'Princeton WordNet 3.0') assert.match(entry.synsetId, /^(adj|noun|verb|adv):\d{8}$/);
    if (entry.lookupTerm !== word.term.toLowerCase()) assert.ok(entry.formNote, word.term);
  }
});

test('ambiguous words use emotion-relevant senses', () => {
  assert.match(dictionary.entries.blue.definition, /melancholy/i);
  assert.match(dictionary.entries.warm.definition, /affection/i);
  assert.match(dictionary.entries.present.definition, /attentive/i);
  assert.match(dictionary.entries.radiant.definition, /happiness/i);
  assert.match(dictionary.entries['left out'].definition, /not included/i);
  assert.equal(dictionary.entries.missing.lookupTerm, 'miss');
  assert.match(dictionary.entries.missing.definition, /lack of/i);
});

test('definition rendering escapes dictionary text and blocks unsafe link schemes', () => {
  const entry = { ...dictionary.entries.warm, definition:'<img src=x onerror=alert(1)> & "test"', sourceUrl:'javascript:alert(1)' };
  const html = definitionMarkup(entry);
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('&amp;'));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(html.includes('rel="noopener noreferrer"'));
});

test('base forms and licensing remain visible when rendering definitions', () => {
  const html = definitionMarkup(dictionary.entries.soothed);
  assert.ok(html.includes('Dictionary entry: soothe'));
  assert.ok(html.includes('WordNet license'));
  assert.ok(html.includes('inflected form'));
});
