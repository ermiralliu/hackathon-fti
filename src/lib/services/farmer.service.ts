
import type { Product } from "@prisma-types";
import prisma from "../prisma";

export async function addProduct(farmerId: number, entry: Omit<Product, 'id' | 'farmer' | 'farmerId'>) {
  try {
      await prisma.product.create({
          data: {
              ...entry,
              farmer: {
                  connect: { id: farmerId } // Connect to an existing farmer
              }
          }
      });
      console.log("Product created successfully");
  } catch (error: any) {
      console.error('Error creating product:', error);
  }
}


export async function deleteProduct(entryId: number, farmerId: number) {
  // po ve userId =2 just for tests for convenience sake
  try {
    await prisma.product.delete({
      where: {
        id: entryId,
        farmerId
      },
    });
    return {
      success: true,
      message: "Product deleted successfully"
    };
  } catch (error: any) {
    console.error('Error deleting record:', error);
    if (error?.code === 'P2025') {
      return { 
        success: false,
        message:  'Record with the given ID not found.'
      };
    }
    return { 
      success: false,
      message: error.message 
    }; // Re-throw other errors
  }
}

export async function updateProduct(productId: number, updates: Partial<Product>): Promise<Product | null> {
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: updates,
    });
    console.log(`Product with ID ${productId} updated successfully`);
    return updatedProduct;
  } catch (error: any) {
    console.error(`Error updating product with ID ${productId}:`, error);
    return null; // Or you could throw the error if you want the calling function to handle it
  }
}
export async function getFarmer(userId: number) {
  return await prisma.user.findUnique({where: {id: userId}})
  
}