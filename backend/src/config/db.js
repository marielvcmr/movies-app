import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

// Fail after 10s instead of Mongoose's default 30s when the server can't be reached.
const SERVER_SELECTION_TIMEOUT_MS = 10_000;

// Work around machines where Node can't read the system DNS settings (querySrv ETIMEOUT).
if (env.DNS_SERVERS.length > 0) {
  dns.setServers(env.DNS_SERVERS);
}

export async function connectDB() {
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
  });
  console.log(`MongoDB connected (database: ${mongoose.connection.name})`);

  // Registered only after the first successful connection, so a failed startup doesn't log a fake "disconnected".
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
  mongoose.connection.on('error', (err) => console.error(`MongoDB error: ${err.message}`));
}


export async function disconnectDB() {
  await mongoose.disconnect();
}
