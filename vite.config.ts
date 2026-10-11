import { defineConfig } from 'vite';

// The browser enforces this: the page may only load its own files
// and may not make any network requests (connect-src 'none').
const csp = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

export default defineConfig({
  base: '/budget-tracker/', // must match the GitHub repo name (needed for GitHub Pages)
  plugins: [
    {
      name: 'inject-csp',
      apply: 'build', // only in the production build: the dev server needs a connection for live reload
      transformIndexHtml(html) {
        return html.replace(
          '<head>',
          `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`
        );
      },
    },
  ],
});