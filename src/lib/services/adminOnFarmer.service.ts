import prisma from "../prisma";

export async function paginateProductsForFarmer(farmerId: number, page = 1, pageSize = 6){ // do shtohen extra arguments per search me specifike
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [products, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        farmerId
      },
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
    prisma.product.count({
      where: {farmerId}
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
