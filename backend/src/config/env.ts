import dotenv from 'dotenv';
import path from 'path';

// Load .env before any other module reads process.env (e.g. email transporter).
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
