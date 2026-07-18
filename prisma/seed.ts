import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const electronica = await prisma.category.create({
    data: { name: 'Electrónica', slug: 'electronica' },
  });
  const ropa = await prisma.category.create({
    data: { name: 'Ropa', slug: 'ropa' },
  });
  const hogar = await prisma.category.create({
    data: { name: 'Hogar', slug: 'hogar' },
  });

  // Products — Electrónica
  const productosElectronicos = [
    { name: 'Auriculares Bluetooth Pro', description: 'Auriculares inalámbricos con cancelación de ruido activa y 30h de batería.', price: 79.99, image: 'https://picsum.photos/seed/auriculares/400/400', stock: 45 },
    { name: 'Smartphone Galaxy X20', description: 'Pantalla AMOLED 6.7", 256GB, cámara cuádruple 108MP.', price: 599.00, image: 'https://picsum.photos/seed/smartphone/400/400', stock: 23 },
    { name: 'Portátil Ultradelgado 14"', description: 'Intel i7, 16GB RAM, SSD 512GB, pantalla retina.', price: 999.00, image: 'https://picsum.photos/seed/portatil/400/400', stock: 8 },
    { name: 'Smartwatch FitPlus', description: 'Reloj inteligente con monitor cardíaco, GPS y resistencia al agua.', price: 149.50, image: 'https://picsum.photos/seed/smartwatch/400/400', stock: 67 },
    { name: 'Altavoz Bluetooth Portátil', description: 'Sonido 360°, resistente al agua IPX7, 20h de batería.', price: 39.99, image: 'https://picsum.photos/seed/altavoz/400/400', stock: 3 },
    { name: 'Cargador Inalámbrico Fast', description: 'Carga rápida 15W, compatible Qi, diseño minimalista.', price: 24.99, image: 'https://picsum.photos/seed/cargador/400/400', stock: 89 },
    { name: 'Tablet 10" HD', description: 'Pantalla 10.1", 4GB RAM, 64GB expandible, Android 13.', price: 189.00, image: 'https://picsum.photos/seed/tablet/400/400', stock: 15 },
    { name: 'Webcam HD 1080p', description: 'Cámara web con micrófono integrado, autofocus, 1080p.', price: 34.99, image: 'https://picsum.photos/seed/webcam/400/400', stock: 5 },
  ];

  // Products — Ropa
  const productosRopa = [
    { name: 'Camiseta Algodón Premium', description: 'Camiseta 100% algodón orgánico, corte ajustado, varios colores.', price: 19.99, image: 'https://picsum.photos/seed/camiseta/400/400', stock: 120 },
    { name: 'Vaqueros Slim Fit', description: 'Vaqueros elásticos, corte slim, color azul oscuro.', price: 44.99, image: 'https://picsum.photos/seed/vaqueros/400/400', stock: 34 },
    { name: 'Chaqueta Impermeable', description: 'Chaqueta ligera impermeable, costuras selladas, capucha ajustable.', price: 69.99, image: 'https://picsum.photos/seed/chaqueta/400/400', stock: 2 },
    { name: 'Zapatillas Deportivas Run', description: 'Zapatillas running con amortiguación gel, malla transpirable.', price: 54.99, image: 'https://picsum.photos/seed/zapatillas/400/400', stock: 56 },
    { name: 'Sudadera Capucha Urban', description: 'Sudadera con capucha, interior afelpado, estilo urbano.', price: 34.99, image: 'https://picsum.photos/seed/sudadera/400/400', stock: 78 },
    { name: 'Vestido Verano Floral', description: 'Vestido ligero con estampado floral, manga corta, tejido fresco.', price: 29.99, image: 'https://picsum.photos/seed/vestido/400/400', stock: 41 },
  ];

  // Products — Hogar
  const productosHogar = [
    { name: 'Lámpara LED Inteligente', description: 'Lámpara RGB controlable por app, 16M colores, compatible Alexa.', price: 32.99, image: 'https://picsum.photos/seed/lampara/400/400', stock: 28 },
    { name: 'Set Sartenes Antiadherentes', description: 'Set 3 sartenes antiadherentes, aptas para inducción.', price: 59.99, image: 'https://picsum.photos/seed/sartenes/400/400', stock: 19 },
    { name: 'Robot Aspirador CleanBot', description: 'Robot aspirador con mapeo láser, app, 180 min autonomía.', price: 249.00, image: 'https://picsum.photos/seed/robot/400/400', stock: 7 },
    { name: 'Manta Térmica Doble', description: 'Manta de microfibra, doble cara, hiporalergénica, 200x220cm.', price: 27.50, image: 'https://picsum.photos/seed/manta/400/400', stock: 52 },
    { name: 'Cafetera Express Automática', description: 'Cafetera superautomática, molinillo integrado, 15 bares presión.', price: 189.00, image: 'https://picsum.photos/seed/cafetera/400/400', stock: 4 },
    { name: 'Organizador de Cocina 3 Niveles', description: 'Estante organizer para cocina, acero inoxidable, 3 niveles.', price: 22.99, image: 'https://picsum.photos/seed/organizador/400/400', stock: 63 },
    { name: 'Difusor Aromaterapia Madera', description: 'Difusor ultrasónico, madera natural, luz LED, 300ml.', price: 18.99, image: 'https://picsum.photos/seed/difusor/400/400', stock: 9 },
  ];

  // Insert products with inventory
  for (const p of productosElectronicos) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        categoryId: electronica.id,
        inventory: {
          create: { stock: p.stock, lowStockThreshold: 10 },
        },
      },
    });
    console.log(`Created: ${product.name}`);
  }

  for (const p of productosRopa) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        categoryId: ropa.id,
        inventory: {
          create: { stock: p.stock, lowStockThreshold: 15 },
        },
      },
    });
    console.log(`Created: ${product.name}`);
  }

  for (const p of productosHogar) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        categoryId: hogar.id,
        inventory: {
          create: { stock: p.stock, lowStockThreshold: 10 },
        },
      },
    });
    console.log(`Created: ${product.name}`);
  }

  // Create an admin user
  await prisma.user.create({
    data: {
      email: 'admin@forgedev.dev',
      name: 'Admin',
      password: 'admin123', // FIXME: should be hashed
      role: 'admin',
    },
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
