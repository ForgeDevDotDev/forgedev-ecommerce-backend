import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// GET /products — list with pagination, search, filter by category
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId as string;

    const where: any = {};
    if (search) {
      where.name = { contains: search };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true, inventory: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.product.count({ where });

    // FIXME: inconsistent response format — sometimes returns {data}, sometimes array directly
    res.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, inventory: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Inconsistent: returns product directly instead of { data: product }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /products
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, categoryId, stock } = req.body;

    // TODO: validate with zod
    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        image,
        categoryId,
        inventory: stock ? { create: { stock: parseInt(stock) } } : undefined,
      },
      include: { category: true, inventory: true },
    });

    res.status(201).json({ data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /products/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        image,
        categoryId,
      },
      include: { category: true, inventory: true },
    });

    res.json({ data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /products/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
