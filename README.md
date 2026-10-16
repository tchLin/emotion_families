# Feeling Words — Emotion Families

A glossary helper website for therapists and clients to explore emotional vocabulary together. Browse **211 distinct feeling words across eight emotion families**, find connections, and reinforce vocabulary with short, gentle quizzes.

The families are **Happy, Confident, Calm, Sad, Fear, Anger, Love, and Surprise**. Words can appear in multiple families; the quiz accepts any family listed for the word in the source chart. This is a vocabulary reference and practice tool, with scores based on the chart rather than an assessment of a person's feelings.

## Using the glossary

- Open **Glossary** to search for a feeling word or filter by family.
- Use the family list to explore related words during a conversation.
- Open **Practice** for a randomized round of 10, 20, or all words.
- Review the families shown after each answer, then revisit missed words at the end of the round.
- Use keyboard shortcuts **1–8** to choose a family and **Enter** to continue when focus is outside a form control.

The glossary groups words by family; it does not currently provide dictionary definitions. Some words belong to more than one family, and the chart is a starting point for discussion.

## Website

[Open Feeling Words](https://emotion-families-practice.socialgleam9.chatgpt.site) · [Open the glossary](https://emotion-families-practice.socialgleam9.chatgpt.site/#library)

The current Sites deployment is private to its owner. Repository access and website access are separate; a GitHub clone can be served locally or deployed to another static host.

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

## Project structure

```text
dist/
  index.html       Page structure and metadata
  styles.css       Responsive layout and family colors
  emotions.json    Vocabulary and family memberships
  quiz.js          Word indexing, answer matching, randomization
  app.js           Quiz and glossary interactions
tests/
  quiz.test.mjs    Vocabulary and quiz logic checks
.openai/
  hosting.json     Existing Sites deployment configuration
```

The site uses plain HTML, CSS, and JavaScript. There is no application backend or database. Quiz answers remain in page memory and reset on refresh; the application includes no client records or analytics. Fonts load from Google Fonts, with system fallbacks.

## Checks

With Node.js 20 or newer:

```sh
npm test
node --check dist/app.js
```

Tests cover the eight families, duplicate handling, acceptance of overlapping families, and randomization without losing or duplicating questions. Browser interaction and visual testing are separate from these checks.

## Hosting

Deploy the contents of `dist/` to any static web host. Keep `index.html`, the JavaScript and CSS files, and `emotions.json` together. Deep links use URL fragments (`#library` and `#quiz`), so no server routing rules are needed.

`.openai/hosting.json` identifies the existing private Sites project. Configure your own project identity if deploying a fork with Sites.
