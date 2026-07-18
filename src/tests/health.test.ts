import { describe, it, expect } from 'vitest';

describe('Health Check', () => {
  it('should pass basic sanity check', () => {
    expect(true).toBe(true);
  });

  it('should calculate cart total correctly', () => {
    // FIXME: this test will reveal the rounding bug
    const items = [
      { product: { price: 19.99 }, quantity: 3 },
      { product: { price: 5.50 }, quantity: 2 },
    ];
    let total = 0;
    for (const item of items) {
      total += item.product.price * item.quantity;
    }
    // This should be 70.97 but floating point might give 70.96999999
    expect(total).toBe(70.97);
  });
});
