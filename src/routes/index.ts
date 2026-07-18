import { Router } from 'express';
import productRoutes from './products';
import cartRoutes from './cart';
import orderRoutes from './orders';
import categoryRoutes from './categories';
import inventoryRoutes from './inventory';

const router = Router();

router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/inventory', inventoryRoutes);

// TODO: Implement wishlist routes
// router.use('/wishlist', wishlistRoutes);

export { router as routes };
