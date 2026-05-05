import { validationResult } from 'express-validator';
export const validate = (req, _res, next) => { const errors = validationResult(req); if (!errors.isEmpty()) return next({ status: 422, message: 'Datos inválidos', details: errors.array() }); next(); };
export const notFound = (_req, _res, next) => next({ status: 404, message: 'Recurso no encontrado' });
export const errorHandler = (err, _req, res, _next) => res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor', details: err.details });
