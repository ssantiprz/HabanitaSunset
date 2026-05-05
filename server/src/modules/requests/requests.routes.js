import { Router } from 'express';
import { body } from 'express-validator';
import { prisma } from '../../config/prisma.js';
import { authRequired, permit } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/errorHandler.js';
import { asyncHandler, AppError } from '../../utils/errors.js';
import { addHistory, includeFull, nextCode, whereByRole } from './request.helpers.js';
const router = Router();
router.get('/', authRequired, asyncHandler(async (req,res)=>{
  const { status, supplierId, search } = req.query;
  const where = { ...whereByRole(req.user), ...(status ? { status } : {}), ...(supplierId ? { supplierId:Number(supplierId) } : {}), ...(search ? { OR:[{ code:{ contains:String(search), mode:'insensitive' } }, { area:{ contains:String(search), mode:'insensitive' } }] } : {}) };
  res.json(await prisma.request.findMany({ where, include:includeFull, orderBy:{ createdAt:'desc' } }));
}));
router.post('/', authRequired, permit('SOLICITANTE','ADMIN'), [body('supplierId').isInt(), body('area').notEmpty(), body('authorizedPickupPerson').notEmpty(), body('items').isArray({ min:1 }), validate], asyncHandler(async (req,res)=>{
  const created = await prisma.request.create({ data:{ code: await nextCode(), requesterId:req.user.id, authorizerId:req.user.id, supplierId:Number(req.body.supplierId), area:req.body.area, observations:req.body.observations, authorizedPickupPerson:req.body.authorizedPickupPerson, priority:req.body.priority || 'MEDIA', status:'SENT_TO_SUPPLIER', items:{ create:req.body.items.map(i=>({ material:i.material, quantity:Number(i.quantity), unit:i.unit || 'unidad' })) } }, include:includeFull });
  await addHistory(created.id, 'CREATED', req.user.id, 'Solicitud creada por el solicitante/autorizante'); await addHistory(created.id, 'SENT_TO_SUPPLIER', req.user.id, 'Solicitud enviada al proveedor');
  res.status(201).json(await prisma.request.findUnique({ where:{ id:created.id }, include:includeFull }));
}));
router.get('/:id', authRequired, asyncHandler(async (req,res)=>{ const request = await prisma.request.findUnique({ where:{ id:Number(req.params.id) }, include:includeFull }); if (!request) throw new AppError('Solicitud no encontrada',404); const visible = req.user.role.name==='ADMIN' || request.requesterId===req.user.id || request.supplierId===req.user.supplierId; if (!visible) throw new AppError('No tenés acceso a esta solicitud',403); res.json(request); }));
router.patch('/:id/status', authRequired, permit('ADMIN'), asyncHandler(async (req,res)=>{ const updated = await prisma.request.update({ where:{ id:Number(req.params.id) }, data:{ status:req.body.status }, include:includeFull }); await addHistory(updated.id, req.body.status, req.user.id, req.body.comment || 'Estado actualizado por administración'); res.json(updated); }));
router.post('/:id/respond', authRequired, permit('PROVEEDOR'), asyncHandler(async (req,res)=>{ const status = req.body.accepted ? 'ACCEPTED' : 'REJECTED'; const id = Number(req.params.id); const current = await prisma.request.findFirst({ where:{ id, supplierId:req.user.supplierId } }); if (!current) throw new AppError('Solicitud no encontrada para este proveedor',404); const request = await prisma.request.update({ where:{ id }, data:{ status, supplierObservations:req.body.observations }, include:includeFull }); await addHistory(request.id, 'RECEIVED_BY_SUPPLIER', req.user.id, 'Solicitud recibida por proveedor'); await addHistory(request.id, status, req.user.id, req.body.observations); res.json(request); }));
router.post('/:id/value', authRequired, permit('PROVEEDOR'), asyncHandler(async (req,res)=>{ const id = Number(req.params.id); const current = await prisma.request.findFirst({ where:{ id, supplierId:req.user.supplierId } }); if (!current) throw new AppError('Solicitud no encontrada para este proveedor',404); const request = await prisma.request.update({ where:{ id }, data:{ valuedAmount:Number(req.body.amount), status:'VALUED', supplierObservations:req.body.observations }, include:includeFull }); await addHistory(request.id, 'VALUED', req.user.id, `Valorización registrada: $${req.body.amount}`); res.json(request); }));
router.post('/:id/close', authRequired, permit('ADMIN','SOLICITANTE'), asyncHandler(async (req,res)=>{ const request = await prisma.request.update({ where:{ id:Number(req.params.id) }, data:{ status:'CLOSED' }, include:includeFull }); await addHistory(request.id, 'CLOSED', req.user.id, req.body.comment || 'Solicitud cerrada'); res.json(request); }));
export default router;
