import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// POST /orders — create order from cart
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cartId, userEmail } = req.body;

    if (!cartId) {
      return res.status(400).json({ error: 'Missing cartId' });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or not found' });
    }

    // BUG: No stock validation — you can order more than what's in stock
    // Should check inventory.stock >= item.quantity before creating order

    // Calculate total
    let total = 0;
    for (const item of cart.items) {
      total += item.product.price * item.quantity;
    }

    // TODO: Implement payment gateway integration
    // FIXME: total has floating point issues, same as cart
    const order = await prisma.order.create({
      data: {
        userEmail,
        total: parseFloat(total.toFixed(2)),
        status: 'pending',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // TODO: decrement stock after order
    // TODO: send confirmation email

    res.status(201).json({ data: order });
  } catch (error) {
    // FIXME: missing proper error handling — error is not typed
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /orders — list orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.order.count();

    res.json({
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /orders/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Inconsistent: returns order directly
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
