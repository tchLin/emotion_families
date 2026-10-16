import { buildWords, shuffled, accepts } from './quiz.js';
const $ = id => document.getElementById(id);
let data, words, round = [], index = 0, answers = [], selected = null, view = 'quiz', filter = 'all';
const descriptions = { happy: 'Joy & possibility', confident: 'Trust in yourself', calm: 'A little inner peace', sad: 'When things feel heavy', fear: 'Your protective instincts', anger: 'When something feels unfair', love: 'Connection & belonging', surprise: 'The unexpected' };
const familyName = id => data.families.find(f => f.id === id).name;
const familyNames = word => word.families.map(familyName).join(' · ');
function dot(f) { return `<span class="family-dot" style="--color:${f.color}" aria-hidden="true"></span>`; }
function switchView(next) {
  view = next;
  if (location.hash !== `#${next}`) history.replaceState(null, '', `#${next}`);
  $('quiz-view').hidden = next !== 'quiz'; $('library-view').hidden = next !== 'library';
  for (const [id, value] of [['quiz-tab', 'quiz'], ['library-tab', 'library']]) {
    $(id).classList.toggle('active', next === value);
    if (next === value) $(id).setAttribute('aria-current', 'page'); else $(id).removeAttribute('aria-current');
  }
  if (next === 'library') renderLibrary();
}
function start(pool = words) {
  const length = $('round-length').value;
  round = shuffled(pool).slice(0, length === 'all' ? pool.length : Number(length));
  index = 0; answers = []; selected = null; switchView('quiz'); renderQuiz();
}
function renderQuiz() {
  if (index >= round.length) return renderResults();
  const word = round[index], correct = answers.filter(a => a.correct).length;
  $('quiz-content').innerHTML = `<div class="round-meta"><span>WORD <strong>${String(index + 1).padStart(2, '0')}</strong> / ${round.length}</span><span>${correct} correct <span aria-hidden="true">✧</span></span></div><div class="progress" role="progressbar" aria-label="Round progress" aria-valuemin="0" aria-valuemax="${round.length}" aria-valuenow="${index}"><div style="width:${index / round.length * 100}%"></div></div><div class="prompt"><p>Which emotion family does this word belong to?</p><h2 id="current-word" tabindex="-1">${word.term}</h2><span class="prompt-rule"></span><p class="prompt-sub">Go with a family you recognize.</p></div><div class="choices">${data.families.map((f, i) => `<button class="choice" data-family="${f.id}" style="--color:${f.color}">${dot(f)}<span>${f.name}</span><kbd>${i + 1}</kbd></button>`).join('')}</div><div id="feedback" class="feedback" role="status" aria-live="polite"></div><div class="quiz-bottom"><span class="keyboard-hint"><kbd>1</kbd> – <kbd>8</kbd> to choose <span>·</span> <kbd>↵</kbd> to continue</span><button id="skip" class="text-button">Skip word ↗</button><button id="next" class="primary" hidden>Next word <span>→</span></button></div>`;
  document.querySelectorAll('.choice').forEach(b => b.addEventListener('click', () => answer(b.dataset.family)));
  $('skip').onclick = () => answer(null);
  $('next').onclick = () => { index++; selected = null; renderQuiz(); ($('current-word') || $('result-title'))?.focus(); };
}
function answer(family) {
  if (selected !== null || index >= round.length) return;
  selected = family || 'skipped';
  const word = round[index], correct = accepts(word, family);
  answers.push({ word, family, correct });
  document.querySelectorAll('.choice').forEach(b => {
    b.disabled = true;
    if (accepts(word, b.dataset.family)) { b.classList.add('correct'); b.querySelector('kbd').textContent = '✓'; }
    else if (b.dataset.family === family) { b.classList.add('incorrect'); b.querySelector('kbd').textContent = '×'; }
  });
  $('feedback').className = `feedback visible ${correct ? 'success' : 'learning'}`;
  $('feedback').innerHTML = `<strong>${correct ? 'That’s a match.' : family ? 'A word to get to know.' : 'Let’s take a look.'}</strong><span>The chart lists <b>${word.term}</b> under ${familyNames(word)}.${word.families.length > 1 ? ' Either family counts.' : ''}</span>`;
  $('skip').hidden = true; $('next').hidden = false;
  $('next').innerHTML = index === round.length - 1 ? 'See your round <span>→</span>' : 'Next word <span>→</span>';
}
function renderResults() {
  const correct = answers.filter(a => a.correct).length, missed = answers.filter(a => !a.correct);
  $('quiz-content').innerHTML = `<div class="results"><span class="result-symbol" aria-hidden="true">✳</span><p class="eyebrow">A LITTLE MORE UNDERSTANDING</p><h2 id="result-title" tabindex="-1">Round complete.</h2><div class="score">${correct}<span> / ${round.length}</span></div><p>${missed.length ? 'Every word is another chance to learn.' : 'You found a family for every feeling.'}</p><div class="result-actions"><button id="again" class="primary">Try a fresh round →</button>${missed.length ? '<button id="retry" class="secondary">Practice missed words</button>' : ''}</div></div>${missed.length ? `<div class="review"><h3>Take another look</h3>${missed.map(a => `<div><strong>${a.word.term}</strong><span>${familyNames(a.word)}</span></div>`).join('')}</div>` : ''}`;
  $('again').onclick = () => start();
  if ($('retry')) $('retry').onclick = () => start(missed.map(a => a.word));
}
function renderLibrary() {
  const query = $('search').value.trim().toLowerCase();
  $('library-filters').innerHTML = `<button data-filter="all" class="filter ${filter === 'all' ? 'selected' : ''}" aria-pressed="${filter === 'all'}">All families</button>${data.families.map(f => `<button data-filter="${f.id}" class="filter ${filter === f.id ? 'selected' : ''}" aria-pressed="${filter === f.id}">${dot(f)}${f.name}</button>`).join('')}`;
  document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { filter = b.dataset.filter; renderLibrary(); });
  const matching = words.filter(w => w.term.toLowerCase().includes(query) && (filter === 'all' || w.families.includes(filter))).sort((a,b) => a.term.localeCompare(b.term));
  $('word-count').textContent = `${matching.length} words`;
  $('library-content').innerHTML = matching.length ? matching.map(w => `<div class="library-row"><strong>${w.term}</strong><div>${w.families.map(id => { const f = data.families.find(f => f.id === id); return `<span class="word-family">${dot(f)}${f.name}</span>`; }).join('')}</div></div>`).join('') : '<p class="empty">No words found. Try a different spelling or family.</p>';
}
async function init() {
  try {
    const response = await fetch('./emotions.json');
    if (!response.ok) throw new Error('Cannot load words');
    data = await response.json(); words = buildWords(data.families);
    $('family-list').innerHTML = data.families.map(f => `<button class="family-link" data-browse="${f.id}">${dot(f)}<span><strong>${f.name}</strong><small>${descriptions[f.id]}</small></span><span class="family-total">${f.terms.length}</span></button>`).join('');
    document.querySelectorAll('[data-browse]').forEach(b => b.onclick = () => { filter = b.dataset.browse; $('search').value = ''; switchView('library'); });
    $('quiz-tab').onclick = () => switchView('quiz'); $('library-tab').onclick = () => switchView('library');
    $('search').oninput = renderLibrary; $('round-length').onchange = () => start();
    document.addEventListener('keydown', e => {
      if (view !== 'quiz' || /INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (/^[1-8]$/.test(e.key) && selected === null && index < round.length) { e.preventDefault(); answer(data.families[Number(e.key)-1].id); }
      if (e.key === 'Enter' && selected !== null && $('next')) { e.preventDefault(); $('next').click(); }
    });
    const initialView = location.hash === '#library' ? 'library' : 'quiz';
    start();
    if (initialView === 'library') switchView('library');
    window.addEventListener('hashchange', () => switchView(location.hash === '#library' ? 'library' : 'quiz'));
  } catch (error) { $('quiz-content').innerHTML = '<p class="empty">The word list couldn’t load. Please refresh the page. For local use, run <code>npm start</code> and open http://localhost:5173.</p>'; console.error(error); }
}
init();
