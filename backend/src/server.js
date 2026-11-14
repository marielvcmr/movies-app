import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

try {
  await connectDB();
} catch (err) {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
  process.exit(1);
}

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server listening on http://${env.HOST}:${env.PORT}`);
});
