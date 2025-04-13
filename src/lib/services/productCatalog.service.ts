
import { Prisma, type ProductType, type PurchaseRequest } from "@prisma-types";
import prisma from "../prisma";


export async function paginate(page = 1, pageSize = 6, searchString?: string, typeFilter?: ProductType) { // do shtohen extra arguments per search me specifike
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const conditions = [];

  if(searchString){
    conditions.push({
      name: {
        contains: searchString,
        mode: Prisma.QueryMode.insensitive, // it's just a 'insensitive' string, but we do it this way to make ts feel good
      }
    });
  }
  if(typeFilter){
    conditions.push({
      type: {
        equals: typeFilter
        // No need for mode: 'insensitive' since enum values are case-sensitive
      }
    });
  }
  
  let where: { AND: Prisma.ProductWhereInput[] } | Prisma.ProductWhereInput | undefined;
  if(conditions.length === 1){
    where = conditions[0];
  } else if(conditions.length === 2){
    where = { AND: conditions };
  }

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
    prisma.product.count({ where })
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
