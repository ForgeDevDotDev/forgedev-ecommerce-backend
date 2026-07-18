// Utility functions

export function paginate<T>(items: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

export function formatError(message: string, code?: string) {
  return { error: message, code: code || 'UNKNOWN' };
}

// FIXME: This validation is too basic
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// TODO: Add currency formatting helper
export function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}
