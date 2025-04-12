// @ts-nocheck
import { addProduct } from "$lib/services/farmer.service";
import { saveImageToStaticFolder } from "$lib/helpers/saveImage.helper";
import { error, redirect } from '@sveltejs/kit';

export function load(){

}

export const actions = {
    create: async ({ request, locals }) => {
        const form = await request.formData();
        const farmerId = locals.user?.id;
        
        

        const name = form.get("name");
        const type = form.get("type");
        const price = Number(form.get("price"));
        const description = form.get("description");
        const photo = form.get("photo");

        // Basic validation
        if (!name || !type || !price) {
            return error(400, {
                error: 'Missing required fields',
                message: 'Name, type, and price are required'
            });
        }

        try {
            let imagePath = null;
            
            // Process image if provided
            if (photo instanceof File && photo.size > 0) {
                imagePath = await saveImageToStaticFolder(photo);
            }

            // Add product to database
            const product = await addProduct(farmerId, { 
                name, 
                type, 
                price, 
                description, 
                image: imagePath
            });

            return {
                success: true,
                product,
                message: "Product added successfully"
            };
            
        } catch (err) {
            return error(500, {
                err: 'Server Error',
                message: error.message || 'Failed to add product'
            });
        }
    }
};