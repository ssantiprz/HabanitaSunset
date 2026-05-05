import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { env } from '../../config/env.js';
fs.mkdirSync(env.uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: (_req,_file,cb)=>cb(null, env.uploadDir), filename: (_req,file,cb)=>cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`) });
export const upload = multer({ storage, limits:{ fileSize: 10 * 1024 * 1024 }, fileFilter: (_req,file,cb)=> file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf' ? cb(null,true) : cb(new Error('Solo se permiten PDF o imágenes')) });
