# Feeling Words — Emotion Families

A glossary helper website for therapists and clients to explore emotional vocabulary together. Browse **211 distinct feeling words across eight emotion families**, find connections, and reinforce vocabulary with short, gentle quizzes.

The families are **Happy, Confident, Calm, Sad, Fear, Anger, Love, and Surprise**. Words can appear in multiple families; the quiz accepts any family listed for the word in the source chart. This is a vocabulary reference and practice tool, with scores based on the chart rather than an assessment of a person's feelings.

## Using the glossary

- Open **Glossary** to search for a feeling word or filter by family. Select any word to read its dictionary definition and source.
- Use the family list to explore related words during a conversation.
- Open **Practice** for a randomized round of 10, 20, or all words.
- Use **Learn this word** to reveal a definition during practice. Definitions also open after answering or skipping a word.
- Review the families shown after each answer, then revisit missed words at the end of the round.
- Use keyboard shortcuts **1–8** to choose a family and **Enter** to continue when focus is outside a form control.

The glossary includes a sourced dictionary definition for every distinct word. Some words belong to more than one family, and the chart is a starting point for discussion.

## Website

[Open Feeling Words](https://tchlin.github.io/emotion_families/) · [Open the glossary](https://tchlin.github.io/emotion_families/#library)

The website is hosted on GitHub Pages. Each push to `main` checks and deploys the contents of `dist/`. Forks can use the one-time Pages setup below.

## Run locally

Requires Python 3 to serve the files. Node.js and npm are needed only for the convenience scripts and automated checks.

```sh
git clone git@github.com:tchLin/emotion_families.git
cd emotion_families
npm start
```

Open **http://localhost:5173**. No dependency installation or build step is required.

Without npm:

```sh
python3 -m http.server 5173 --directory dist
```

Serve over HTTP so the browser can load the JSON vocabulary file.

## Vocabulary data

[`dist/emotions.json`](dist/emotions.json) is the single source for both the glossary and quizzes. It contains 223 family entries representing 211 distinct words. Shared words are merged into one quiz question with multiple accepted families.

Each family has an `id`, `name`, `color`, and `terms` array:

```json
{
  "id": "calm",
  "name": "Calm",
  "color": "#91a77a",
  "terms": ["At ease", "Balanced", "Calm"]
}
```

Edit this file to adjust the vocabulary or family memberships, then run the tests. Keep family IDs unique and consistent with the eight-family interface.

### Word list attribution

Word lists provided by [Kids Mental Health Tools](https://www.kidsmentalhealthtools.com/). Thank you for providing the emotion vocabulary used in this glossary and quiz.

The vocabulary and original grouping were transcribed from the user-provided Kids Mental Health Tools feelings chart. The original chart image is not bundled in this repository. The website preserves its central reminder: feelings can belong to more than one emotional family, and there is no one “right” way to feel.

## Dictionary definitions

[`dist/definitions.json`](dist/definitions.json) contains 211 selected definitions, one for every distinct feeling word. The site serves this file alongside the vocabulary, so looking up a word does not require a live dictionary API request.

Definitions come from **Princeton WordNet 3.0** and **English Wiktionary contributors**, with an emotion-relevant sense chosen for ambiguous words such as *blue*, *warm*, and *present*. The interface calls them dictionary definitions: there is no single official dictionary standard for feelings. A definition of a base verb is explicitly identified when used for an inflected chart term (for example, *soothe* for *soothed*).

Each entry records its source, part of speech, lookup term, source URL, and license. WordNet entries also record the synset ID. Source wording is retained; examples and formatting are omitted, and the *fed up* and *spooked* entries use the first definition sentence.

WordNet excerpts retain the [WordNet license](dist/wordnet-license.txt). Wiktionary excerpts are attributed and distributed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). See the website's [dictionary sources and license notices](dist/dictionary-sources.html). These content licenses apply to the respective dictionary excerpts, not automatically to unrelated application code or the original emotion chart.

When changing the vocabulary, add or update the matching lowercase key in `definitions.json`. Preserve source attribution and choose the sense intentionally; do not automatically take the first dictionary meaning. Coverage and source-metadata tests catch missing entries.

## Project structure

```text
dist/
  index.html       Page structure and metadata
  styles.css       Responsive layout and family colors
  emotions.json    Vocabulary and family memberships
  definitions.json Sourced definitions for every distinct word
  definitions.js   Safe definition rendering
  dictionary-sources.html  Attribution and license notices
  wordnet-license.txt      WordNet license
  quiz.js          Word indexing, answer matching, randomization
  app.js           Quiz and glossary interactions
tests/
  quiz.test.mjs    Vocabulary and quiz logic checks
  definitions.test.mjs  Coverage, citations, and rendering checks
.github/workflows/
  pages.yml        Checks and deploys the website to GitHub Pages
```

The site uses plain HTML, CSS, and JavaScript. There is no application backend or database. Quiz answers remain in page memory and reset on refresh; the application includes no client records or analytics. Fonts load from Google Fonts, with system fallbacks.

## Checks

With Node.js 20 or newer:

```sh
npm test
node --check dist/app.js
```

Tests cover the eight families, duplicate handling, acceptance of overlapping families, randomization, complete definition coverage, source metadata, selected emotional senses, and safe definition rendering. Browser interaction and visual testing are separate from these checks.

## Hosting with GitHub Pages

The [deployment workflow](.github/workflows/pages.yml) publishes `dist/` directly to GitHub Pages. No build step, external hosting service, or deployment secret is needed.

### One-time repository setup

1. Open [Settings → Pages](https://github.com/tchLin/emotion_families/settings/pages).
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open [Deploy to GitHub Pages](https://github.com/tchLin/emotion_families/actions/workflows/pages.yml), click **Run workflow**, and choose `main`.
4. Wait for the deployment to succeed, then open **https://tchlin.github.io/emotion_families/**.

Subsequent pushes to `main` deploy automatically after the quiz tests and JavaScript syntax checks pass. GitHub's [publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) describes the repository setting.

All assets use relative paths so the site works under the `/emotion_families/` project path. Deep links use URL fragments (`#library` and `#quiz`), so no server routing rules are needed. The same `dist/` folder can also be served locally.
