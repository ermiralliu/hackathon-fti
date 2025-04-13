
import type { PurchaseRequest } from "@prisma/client";
import prisma from "../prisma";


export async function paginate(page = 1, pageSize = 6, searchString?: string, typeFilter?: string) { // do shtohen extra arguments per search me specifike
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where = {
    AND: [
      searchString ? {
        name: {
          contains: searchString,
          mode: 'insensitive',
        }
      } : {},
      typeFilter ? {
        type: {
          equals: typeFilter as ProductType
          // No need for mode: 'insensitive' since enum values are case-sensitive
        }
      } : {}
    ].filter(condition => Object.keys(condition).length > 0) // Remove empty conditions
  };

  const [products, totalCount] = await prisma.$transaction([

    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'desc', // Or another field you want to order by
      },
      include: {
        farmer: {
          select: {
            name: true,
          }
        }
      },
    }),
    prisma.product.count({
      where: Object.keys(where.AND).length > 0 ? where : undefined
    })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    products,
    totalPages,
    currentPage: page,
    totalCount,
  };
}

export async function addProdRequest(consumerId: number, productId: number, entry: Omit<PurchaseRequest, 'id' | 'consumerId' | 'consumer' | 'createdAt' | 'product' | 'productId' | 'finished'>) {
  try {
    const purchaseRequest = await prisma.purchaseRequest.create({
      data: {
        ...entry,
        status: 'pending',
        product: {
          connect: { id: productId },
        },
        consumer: {
          connect: { id: consumerId },
        },
      },
    });
    console.log('Purchase Request created successfully');
    return purchaseRequest;
  } catch (err) {
    console.error('Error creating Purchase Request:', err);
    throw err;
  }
}