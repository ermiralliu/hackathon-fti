
import prisma from "../prisma";

export async function paginate( page = 1, pageSize = 6){ // do shtohen extra arguments per search me specifike
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [products, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      // where: {
      //   userId
      // },
      skip,
      take,
      orderBy: {
        createdAt: 'desc', // Or another field you want to order by
      },
      include: {
        farmer:{
          select: {
            name:true,
          }
        }
      },
    }),
    prisma.product.count()
  
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);
  // // const farmerNames = await prisma.user.findMany({
  // //   where: {
  // //     role: 'FARMER',
  // //   },
  // //   select: {
  // //     id: true,
  // //     name: true,
  // //   },
  // // });
  // products[1].farmer.name

  return {
    products,
    totalPages,
    currentPage: page,
    totalCount, 
  };
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