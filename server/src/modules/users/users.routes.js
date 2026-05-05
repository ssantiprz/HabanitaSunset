import { Router } from 'express';
import { prisma } from '../../config/prisma.js';
import { authRequired, permit } from '../../middlewares/auth.js';
const router = Router();
router.get('/', authRequired, permit('ADMIN'), async (_req,res)=> res.json(await prisma.user.findMany({ include:{ role:true, supplier:true }, orderBy:{ name:'asc' } })));
export default router;
