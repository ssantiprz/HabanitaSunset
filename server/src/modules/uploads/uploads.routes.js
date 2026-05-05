import { Router } from 'express';
import { prisma } from '../../config/prisma.js';
import { authRequired } from '../../middlewares/auth.js';
import { upload } from './upload.service.js';
const router = Router();
router.post('/', authRequired, upload.single('file'), async (req,res)=>{
  const attachment = await prisma.attachment.create({ data:{ requestId:req.body.requestId ? Number(req.body.requestId) : null, uploadedById:req.user.id, type:req.body.type || 'GENERAL', fileName:req.file.filename, originalName:req.file.originalname, mimeType:req.file.mimetype, size:req.file.size, path:req.file.path, url:`/uploads/${req.file.filename}` } });
  res.status(201).json(attachment);
});
export default router;
