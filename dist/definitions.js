export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function definitionMarkup(entry) {
  if (!entry) return '<p class="definition-text">Definition unavailable.</p>';
  const source = /^https:\/\//.test(entry.sourceUrl) ? entry.sourceUrl : '#';
  const license = /^https:\/\//.test(entry.licenseUrl) ? entry.licenseUrl : '#';
  return `<div class="definition-content"><p class="definition-label">${escapeHTML(entry.partOfSpeech)}${entry.lookupTerm.toLowerCase() !== entry.term.toLowerCase() ? ` · Dictionary entry: ${escapeHTML(entry.lookupTerm)}` : ''}</p><p class="definition-text">${escapeHTML(entry.definition)}</p>${entry.formNote ? `<p class="definition-form">${escapeHTML(entry.formNote)}</p>` : ''}<p class="definition-source"><a href="${escapeHTML(source)}" target="_blank" rel="noopener noreferrer">${escapeHTML(entry.source)}<span class="sr-only"> (opens in a new tab)</span> ↗</a> <span aria-hidden="true">·</span> <a href="${escapeHTML(license)}" target="_blank" rel="noopener noreferrer">${escapeHTML(entry.license)}<span class="sr-only"> (opens in a new tab)</span></a></p></div>`;
}
