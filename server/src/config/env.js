import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
export const env = { port: process.env.PORT || 4000, jwtSecret: process.env.JWT_SECRET || 'dev-secret', uploadDir: process.env.UPLOAD_DIR || 'uploads' };
