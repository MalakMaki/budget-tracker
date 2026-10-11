# Budget Tracker
  ![Test and deploy](https://github.com/MalakMaki/budget-tracker/actions/workflows/deploy.yml/badge.svg)

A student budget tracker that runs entirely in your browser.
Your bank data never leaves your device.

**Status:** in development

## Planned features
- Upload a bank statement CSV (HSBC first)
- Automatic spending categories
- Monthly charts
- Subscription detection


- Standardising to one Transaction shape keeps the parser separate from everything else.
- Returning skipped rows instead of throwing makes failures visible to the user.
- No backend, accounts or bank connections, which keeps the privacy claim simple and true.
