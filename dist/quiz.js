export function buildWords(families) {
  const words = new Map();
  for (const family of families) for (const term of family.terms) {
    const key = term.toLowerCase();
    if (!words.has(key)) words.set(key, { term, families: [] });
    words.get(key).families.push(family.id);
  }
  return [...words.values()];
}
export function shuffled(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function accepts(word, family) { return word.families.includes(family); }
