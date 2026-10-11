# Budget Tracker
  ![Test and deploy](https://github.com/MalakMaki/budget-tracker/actions/workflows/deploy.yml/badge.svg)

A student budget tracker that runs entirely in your browser. Your bank data never leaves your device.

**[Try it live](https://malakmaki.github.io/budget-tracker/)** (use `sample-data/hsbc-three-months.csv` if you don't want to use your own statement)

![Demo](docs/demo.gif)

## What it does
- Reads HSBC statement CSVs (several months at once)
- Sorts transactions into categories automatically
- Lets you correct a category once and remembers it for that merchant
- Shows spending by category
- Spots likely monthly subscriptions

## Privacy
Banking data is sensitive, so privacy is built into how the app works rather than promised:
- **No backend, no accounts, no analytics.** The app is static files. Your CSV is read in the browser and never uploaded.
- **The browser enforces it.** A Content Security Policy blocks all network requests from the page, so even a bug couldn't send your data out. To check: open the console on the live site and run `fetch('https://example.com')`. It's blocked.
- **What is stored:** only your category corrections (merchant text and category) in the browser's localStorage. Never amounts, dates or statements. There's a button to clear it.

## How it works
1. **Parser**: turns an HSBC CSV (no header row, `dd/mm/yyyy`, one signed amount) into a standard `Transaction` type. Bad rows are skipped and reported, not crashed on.
2. **Categoriser**: cleans messy bank text (`TESCO STORES 3042 LONDON )))` becomes `tesco stores london`), then applies your corrections first, then keyword rules.
3. **Subscription detector**: groups spending by merchant and looks for charges about a month apart for about the same amount.
4. **UI**: plain TypeScript and Chart.js, with no framework.

## Design decisions
- **One standard transaction format.** Everything after the parser is independent of the bank, so supporting a second bank only means writing a new parser.
- **Corrections stored under the cleaned merchant name,** so fixing one branch fixes all of them, even when store numbers differ.
- **Rules are data, not code,** so adding a merchant is a one-line change.
- **Tested before it ships:** the deploy pipeline runs the unit tests and won't publish if one fails.

## Known limitations
- Only HSBC's CSV format is supported.
- Categorisation is keyword-based, so unfamiliar merchants fall into "Other" (you can fix them by hand).
- Subscription detection only looks at dates and amounts, so a place you visit regularly can be flagged as a subscription. It only detects monthly payments, and a merchant that has both a subscription and ordinary purchases is ignored.
- Corrections live in one browser, and clearing site data removes them.

## Run it locally
```bash
npm install
npm run dev     # development server
npm test        # unit tests
npm run build   # production build
```

## Tech
TypeScript, Vite, Vitest, Chart.js, Papa Parse, GitHub Actions and GitHub Pages.

## License
MIT
