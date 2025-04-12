
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

  return {
    products,
    totalPages,
    currentPage: page,
    totalCount, 
  };
}

export async function addProdRequest(consumerId: number, productId:number, entry: Omit<PurchaseRequest, 'id' |'consumerId' | 'consumer' | 'createdAt' | 'product'|'productId' | 'finished'>) {
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