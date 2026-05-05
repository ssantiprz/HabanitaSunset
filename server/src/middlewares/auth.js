import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
export const authRequired = async (req, res, next) => {
  try { const token = req.headers.authorization?.replace('Bearer ', ''); if (!token) return res.status(401).json({ message: 'Token requerido' }); const payload = jwt.verify(token, env.jwtSecret); const user = await prisma.user.findUnique({ where:{ id: payload.id }, include:{ role:true, supplier:true } }); if (!user?.active) return res.status(401).json({ message:'Usuario no autorizado' }); req.user = user; next(); } catch { res.status(401).json({ message:'Sesión inválida o vencida' }); }
};
export const permit = (...roles) => (req, res, next) => roles.includes(req.user.role.name) ? next() : res.status(403).json({ message:'No tenés permisos para esta acción' });
