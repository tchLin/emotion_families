# Feeling Words

A responsive emotion-family quiz built with HTML, CSS, JavaScript, and JSON. The chart in the supplied photo is transcribed in `dist/emotions.json`. Duplicate terms are merged for quizzes and accept any family listed for them.

## Run locally

```sh
npm start
```

Open http://localhost:5173. No dependency installation or build step is needed. Serve the folder over HTTP so the JSON file can load.

## Features

- Randomized rounds of 10, 20, or all words
- All eight emotion families with instant feedback
- End-of-round score and missed-word practice
- Searchable library with family filters
- Keyboard shortcuts: 1–8 to answer, Enter to continue
- Responsive layout and accessible native controls

To edit the vocabulary, update `dist/emotions.json`. The quiz and library both use this file. Quiz answers reflect the supplied chart; feelings can belong to multiple families.

Run `npm test` to verify vocabulary indexing, overlapping answers, and question randomization.
