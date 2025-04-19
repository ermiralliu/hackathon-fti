import prisma from "../prisma";
import type { Role, Product } from "$prisma-client";// USERS

/**
 * Merr përdoruesit me pagination.
 */
export async function getAllUsers(page: number = 1, pageSize: number = 6) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [users, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take,
        orderBy: { id: "asc" },
        where : {
          isValid: true
        }
      }),
      prisma.user.count(), 
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      users,
      totalPages,
      currentPage: page,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * Përdor për të vërtetuar përdoruesin (aktivizuar/invaliduar).
 */
export async function invalidateUser(userId: number) {
  try {
    console.log("Invalidating user with id:", userId);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isValid: false },
    });
    return updatedUser; // Make sure to return the updated user
  } catch (error) {
    console.error(`Error invalidating user with id ${userId}:`, error);
    throw new Error(`Failed to invalidate user with id ${userId}`);
  }
}

/**
 * Përditëson të dhënat e një përdoruesi në bazën e të dhënave me id të dhënë.
 */
export async function updateUserById(
  id: number,
  data: { email: string; username: string; role: Role }
) {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw new Error(`Failed to update user with id ${id}`);
  }
}

// PRODUCTS

/**
 * Merr produktet me pagination.
 */
export async function getAllProducts(page: number = 1, pageSize: number = 6) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [products, totalCount] = await prisma.$transaction([
      prisma.product.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          type: true,
          availability: true,
          imagePath: true,
          farmer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.product.count(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      products,
      totalPages,
      currentPage: page,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}
/**
 * Fshin një produkt nga baza e të dhënave me id të dhënë.
 */
export async function deleteProductById(id: number) {
  try {
    return await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw new Error(`Failed to delete product with id ${id}`);
  }
}

/**
 * Përditëson të dhënat e një produkti në bazën e të dhënave me id të dhënë.
 */
export async function updateProductById(
  id: number,
  data: Partial<Omit<Product, 'id'|'createdAt'|'farmerId'>> // heqim fushat qe nuk i nderrojme dot, 
  //dhe bejme nullable fushat te cilat nuk kemi nevoje t'i kalojme
) {
  try {
    return await prisma.product.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw new Error(`Failed to update product with id ${id}`);
  }
}
