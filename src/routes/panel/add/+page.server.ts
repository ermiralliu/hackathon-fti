import { addProduct } from "$lib/services/farmer.service";
import { saveImageToStaticFolder } from "$lib/helpers/saveImage.helper";
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { ProductType, type Product, type User } from "$prisma-client";

export const actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    const user = locals.user as User;
    if (!user)
      fail(401, { message: 'unauthorized' })

    console.log(user);
    const farmerId = user.id;

    const name = form.get("name")?.toString();
    const type = form.get("type")?.toString();
    if (!type || !Object.keys(ProductType).includes(type))
      return fail(400, { message: 'Invalid type' });

    const price = Number(form.get("price"));
    const description = form.get("description")?.toString() ?? null;
    const photo = form.get("photo");

    // Basic validation
    if (!name || !type || !price) {
      return error(400, 'Missing required fields');
    }

    try {
      let imagePath = null;

      // Process image if provided
      if (photo instanceof File && photo.size > 0) {
        imagePath = await saveImageToStaticFolder(photo);
      }

      // Add product to database
      // await addProduct(farmerId, {
      //   name,
      //   type: type as ProductType,
      //   price,
      //   description,
      //   imagePath
      // });

      const product: Omit<Product, 'id'| 'farmerId'> & {farmer:{name: string}} = {
        name,
        description,
        price,
        farmer: {
          name: 'You'
        },
        createdAt: new Date(),
        availability: true,
        imagePath,
        type: "fruit"
      }

      return {
        success: true,
        product,
        message: "Product added successfully"
      };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'problem in creating this stuff';
      return error(500, message);
    }
  }
} satisfies Actions;