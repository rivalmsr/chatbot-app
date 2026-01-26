import type { Product } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

export const productRepository = {
  getProduct(productId: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id: productId },
    });
  },
};
