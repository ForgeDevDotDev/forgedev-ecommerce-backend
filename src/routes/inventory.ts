import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// GET /inventory — list all inventory
router.get('/', async (req: Request, res: Response) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { product: true },
    });

    res.json({ data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// GET /inventory/low-stock — products below threshold
router.get('/low-stock', async (req: Request, res: Response) => {
  try {
    const lowStock = await prisma.inventory.findMany({
      where: {
        stock: { lte: 10 }, // FIXME: should use lowStockThreshold from each product
      },
      include: { product: true },
    });

    // TODO: send alert email when stock is low
    res.json({ data: lowStock });
  } catch (error) {
    console.error('Error fetching low stock:', error);
    res.status(500).json({ error: 'Failed to fetch low stock items' });
  }
});

// PUT /inventory/:productId — update stock
router.put('/:productId', async (req: Request, res: Response) => {
  try {
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ error: 'Missing stock value' });
    }

    const inventory = await prisma.inventory.update({
      where: { productId: req.params.productId },
      data: { stock: parseInt(stock) },
      include: { product: true },
    });

    res.json({ data: inventory });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

export default router;
