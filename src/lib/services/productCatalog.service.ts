
import prisma from "../prisma";

export async function paginate( page = 1, pageSize = 20){ // do shtohen extra arguments per search me specifike
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [foodEntries, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      // where: {
      //   userId
      // },
      skip,
      take,
      orderBy: {
        createdAt: 'desc', // Or another field you want to order by
      },
    }),
    prisma.product.count()
  
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    foodEntries,
    totalPages,
    currentPage: page,
    totalCount,
  };
}