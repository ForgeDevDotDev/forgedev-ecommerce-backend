import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// Helper: calculate cart total
// FIXME: rounding issue — toFixed returns a string but we parse it back to float
// This can cause floating point precision problems
function calculateCartTotal(items: any[]): number {
  let total = 0;
  for (const item of items) {
    total += item.product.price * item.quantity;
  }
  // TODO: use a proper decimal library instead of this hack
  return parseFloat(total.toFixed(2));
}

// GET /cart — get cart by cartId (query param) or create new
router.get('/', async (req: Request, res: Response) => {
  try {
    const cartId = req.query.cartId as string;

    if (!cartId) {
      // Create empty cart
      const cart = await prisma.cart.create({
        data: {},
        include: { items: { include: { product: true } } },
      });
      return res.json({ data: cart, total: 0 });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const total = calculateCartTotal(cart.items);
    res.json({ data: cart, total });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /cart/add — add item to cart
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { cartId, productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Missing productId or quantity' });
    }

    let cart;
    if (cartId) {
      cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      });
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
    } else {
      cart = await prisma.cart.create({ data: {}, include: { items: true } });
    }

    // Check if product already in cart
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
        include: { product: true },
      });
      return res.json({ data: updatedItem });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: parseInt(quantity),
      },
      include: { product: true },
    });

    // Inconsistent: returns item directly, not wrapped in { data }
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// DELETE /cart/:itemId — remove item from cart
router.delete('/:itemId', async (req: Request, res: Response) => {
  try {
    await prisma.cartItem.delete({
      where: { id: req.params.itemId },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// DELETE /cart/clear/:cartId — clear entire cart
router.delete('/clear/:cartId', async (req: Request, res: Response) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { cartId: req.params.cartId },
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// TODO: Implement wishlist — this was started but never finished
// router.get('/wishlist', ...)
// router.post('/wishlist/add', ...)

export default router;
