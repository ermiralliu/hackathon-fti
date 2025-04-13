import prisma from "../prisma";

export async function paginateProductRequest( page = 1, pageSize = 6, consumerId: number){ // do shtohen extra arguments per search me specifike
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [products, totalCount] = await prisma.$transaction([
    prisma.purchaseRequest.findMany({
      // where: {
      //   userId
      // },
      skip,
      take,
      orderBy: {
        createdAt: 'desc', // Or another field you want to order by
      },
      where:{
        consumerId
      }
    }),
    prisma.purchaseRequest.count({
      where:{
        consumerId
      }
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
