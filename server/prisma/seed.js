import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const hash = (pwd) => bcrypt.hash(pwd, 10);
async function main(){
  const [adminRole, requesterRole, supplierRole] = await Promise.all(['ADMIN','SOLICITANTE','PROVEEDOR'].map(name=>prisma.role.upsert({ where:{ name }, update:{}, create:{ name } })));
  const supplier = await prisma.supplier.upsert({ where:{ id:1 }, update:{ name:'Proveedor Demo S.A.', cuit:'30-00000000-1', email:'ventas@proveedordemo.com', phone:'11 5555-0101', address:'Av. Principal 123' }, create:{ name:'Proveedor Demo S.A.', cuit:'30-00000000-1', email:'ventas@proveedordemo.com', phone:'11 5555-0101', address:'Av. Principal 123' } });
  const admin = await prisma.user.upsert({ where:{ email:'admin@demo.com' }, update:{}, create:{ name:'Administración Demo', email:'admin@demo.com', password:await hash('admin123'), roleId:adminRole.id } });
  const requester = await prisma.user.upsert({ where:{ email:'solicitante@demo.com' }, update:{}, create:{ name:'Solicitante Municipal', email:'solicitante@demo.com', password:await hash('demo123'), roleId:requesterRole.id } });
  await prisma.user.upsert({ where:{ email:'proveedor@demo.com' }, update:{ supplierId:supplier.id }, create:{ name:'Proveedor Demo', email:'proveedor@demo.com', password:await hash('demo123'), roleId:supplierRole.id, supplierId:supplier.id } });
  const existing = await prisma.request.findFirst({ where:{ code:'SOL-2026-00001' } });
  if (!existing) {
    const req = await prisma.request.create({ data:{ code:'SOL-2026-00001', requesterId:requester.id, authorizerId:requester.id, supplierId:supplier.id, area:'Obras Públicas', authorizedPickupPerson:'Juan Pérez', priority:'ALTA', status:'SENT_TO_SUPPLIER', observations:'Materiales para reparación de veredas.', items:{ create:[{ material:'Bolsas de cemento', quantity:20, unit:'bolsa' },{ material:'Arena fina', quantity:5, unit:'m3' }] } } });
    await prisma.requestStatusHistory.createMany({ data:[{ requestId:req.id, status:'CREATED', changedById:requester.id, comment:'Solicitud demo creada' },{ requestId:req.id, status:'SENT_TO_SUPPLIER', changedById:admin.id, comment:'Enviada al proveedor demo' }] });
  }
}
main().finally(()=>prisma.$disconnect());
