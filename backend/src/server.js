import app from './app.js';

// Hardcoded until Step 2 introduces src/config/env.js (the only module allowed to read process.env).
const PORT = 3000;
// Loopback only — binding to all interfaces (0.0.0.0) requires explicit confirmation per CLAUDE.md.
const HOST = '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
