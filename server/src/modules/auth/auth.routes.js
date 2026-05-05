import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { validate } from '../../middlewares/errorHandler.js';
import { authRequired } from '../../middlewares/auth.js';
import { asyncHandler, AppError } from '../../utils/errors.js';
const router = Router();
const publicUser = (u) => ({ id:u.id, name:u.name, email:u.email, role:u.role.name, supplier:u.supplier });
router.post('/login', [body('email').isEmail(), body('password').notEmpty(), validate], asyncHandler(async (req,res)=>{
  const user = await prisma.user.findUnique({ where:{ email:req.body.email }, include:{ role:true, supplier:true } });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) throw new AppError('Email o contraseña incorrectos', 401);
  const token = jwt.sign({ id:user.id, role:user.role.name }, env.jwtSecret, { expiresIn:'8h' });
  res.json({ token, user: publicUser(user) });
}));
router.get('/me', authRequired, (req,res)=>res.json({ user: publicUser(req.user) }));
export default router;
