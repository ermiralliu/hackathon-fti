import { getFarmerProducts, updateFarmerProduct, deleteFarmerProduct } from '$lib/services/admin.service';
import { fail } from '@sveltejs/kit';
import type { ProductType } from '@prisma/client';

export async function load({ params }) {
    try {
        const userId = Number(params.userId);
        const products = await getFarmerProducts(userId);
        
        return {
            products,
            userId
        };
    } catch (error) {
        console.error('Error loading farmer products:', error);
        return fail(500, { error: 'Failed to load farmer products' });
    }
}

function isProductType(value: string): value is ProductType {
    return ['FRUIT', 'VEGETABLE', 'DAIRY', 'OTHER'].includes(value);
}

export const actions = {
    updateProduct: async ({ request, params }) => {
        const formData = await request.formData();
        const userId = Number(params.userId);
        
        try {
            const productId = Number(formData.get('id'));
            const typeValue = String(formData.get('type'));
            
            if (!isProductType(typeValue)) {
                throw new Error('Invalid product type');
            }

            const updates = {
                name: String(formData.get('name')),
                description: String(formData.get('description')),
                price: Number(formData.get('price')),
                type: typeValue
            };

            await updateFarmerProduct(userId, productId, updates);
            return { success: true };
        } catch (error) {
            console.error('Error updating product:', error);
            let errorMessage = 'Failed to update product';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return fail(500, { error: errorMessage });
        }
    },

    deleteProduct: async ({ request, params }) => {
        const formData = await request.formData();
        const userId = Number(params.userId);
        
        try {
            const productId = Number(formData.get('id'));
            await deleteFarmerProduct(userId, productId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            let errorMessage = 'Failed to delete product';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return fail(500, { error: errorMessage });
        }
    }
};