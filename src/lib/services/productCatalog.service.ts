
import type { ProductType, PurchaseRequest } from "@prisma/client";
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

export async function paginateUserProducts(userId: any, page = 1, pageSize = 6) { // Unique name and userId parameter
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [products, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        farmerId: userId, // Filter products for the specific userId (farmerId)
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc', // Sort by creation date (or another field)
      },
      include: {
        farmer: {
          select: {
            name: true, // Include the farmer's name
          },
        },
      },
    }),
    prisma.product.count({
      where: {
        farmerId: userId, // Count products filtered by userId
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    products,      // Retrieved products for the specified userId
    totalPages,    // Total number of pages
    currentPage: page, // Current page number
    totalCount,    // Total number of products
  };
}

export async function paginateUserRequests(userId: number, page = 1, pageSize = 6) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [requests, totalCount] = await prisma.$transaction([
    prisma.purchaseRequest.findMany({
      where: {
        product: {
          farmerId: userId  // Filter requests where the product belongs to this farmer
        },
        status: 'pending', // Only get pending requests
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',  // Sort by creation date (newest first)
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imagePath: true,
          },
        },
        consumer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.purchaseRequest.count({
      where: {
        product: {
          farmerId: userId
        },
        status: 'pending',
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    requests,      // Array of purchase requests
    totalPages,    // Total number of pages
    currentPage: page, // Current page number
    totalCount,    // Total number of requests
  };
}
