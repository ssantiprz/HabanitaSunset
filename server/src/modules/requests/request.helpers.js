import { prisma } from '../../config/prisma.js';
export const includeFull = { requester:{select:{id:true,name:true,email:true}}, authorizer:{select:{id:true,name:true}}, supplier:true, items:true, invoice:{include:{attachment:true}}, remito:{include:{attachment:true}}, attachments:true, history:{include:{changedBy:{select:{id:true,name:true,role:{select:{name:true}}}}}, orderBy:{changedAt:'asc'}} };
export const addHistory = (requestId, status, userId, comment) => prisma.requestStatusHistory.create({ data:{ requestId, status, changedById:userId, comment } });
export const nextCode = async () => `SOL-${new Date().getFullYear()}-${String((await prisma.request.count()) + 1).padStart(5,'0')}`;
export const whereByRole = (user) => user.role.name === 'ADMIN' ? {} : user.role.name === 'PROVEEDOR' ? { supplierId: user.supplierId || 0 } : { requesterId: user.id };
