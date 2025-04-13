import prisma from "$lib/prisma";
import type { Role, ProductType } from "@prisma/client";// USERS

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
        orderBy: { id: "asc" },
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
  data: { 
    name: string; 
    description: string; 
    price: number;
    type: ProductType;
    availability: boolean;
  }
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
export async function getFarmerProducts(userId: number) {
  try {
    const products = await prisma.product.findMany({
      where: {
        farmerId: userId
      },
      include: {
        farmer: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return products;
  } catch (error) {
    console.error(`Error fetching products for farmer ${userId}:`, error);
    throw new Error(`Failed to fetch products for farmer ${userId}`);
  }
}

/**
 * Përditëson produktin e një fermeri specifik
 */
export async function updateFarmerProduct(
  userId: number,
  productId: number,
  data: { 
    name: string; 
    description: string; 
    price: number; 
    type: ProductType // Përdorni ProductType në vend të string
  }
) {
  try {
    // Kontrollo që produkti i përket fermerit
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        farmerId: userId
      }
    });

    if (!product) {
      throw new Error('Product not found or does not belong to this farmer');
    }

    return await prisma.product.update({
      where: { id: productId },
      data
    });
  } catch (error) {
    console.error(`Error updating product ${productId} for farmer ${userId}:`, error);
    throw error;
  }
}

/**
 * Fshin produktin e një fermeri specifik
 */
export async function deleteFarmerProduct(userId: number, productId: number) {
  try {
    // Kontrollo që produkti i përket fermerit
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        farmerId: userId
      }
    });

    if (!product) {
      throw new Error('Product not found or does not belong to this farmer');
    }

    return await prisma.product.delete({
      where: { id: productId }
    });
  } catch (error) {
    console.error(`Error deleting product ${productId} for farmer ${userId}:`, error);
    throw error;
  }
}