import { Router } from 'express';
import { prisma } from '../../config/prisma.js';
import { authRequired, permit } from '../../middlewares/auth.js';
const router = Router();
router.get('/', authRequired, async (_req,res)=> res.json(await prisma.supplier.findMany({ orderBy:{ name:'asc' } })));
router.post('/', authRequired, permit('ADMIN'), async (req,res)=> res.status(201).json(await prisma.supplier.create({ data:req.body })));
export default router;
