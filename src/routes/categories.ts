import { Router, Request, Response } from 'express';
import { prisma } from '../models';

const router = Router();

// GET /categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /categories
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Missing name or slug' });
    }

    const category = await prisma.category.create({
      data: { name, slug },
    });

    res.status(201).json({ data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /categories/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name, slug },
    });

    res.json({ data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /categories/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
