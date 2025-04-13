// @ts-nocheck
// src/routes/products/+page.server.js
import { paginateUserRequests } from '$lib/services/productCatalog.service';
import { fail, redirect, type Actions } from "@sveltejs/kit"; 
import { deleteProduct, updateProduct } from "$lib/services/farmer.service";
import { updateRequestStatus } from '$lib/services/request.service.js';

//import { depends}  from '$app/navigation';

export async function load({params, url, locals }) {
  const page = url.searchParams.get('page') || 1;
 // depends(`url:page=${page}`);

  const requestsData = await paginateUserRequests(locals.user ? locals.user.id : 1, page) //params.limit, params.sort, params.search, params.category);
  console.log(page);
  return{
    purchaseRequests: {
        requests: requestsData.requests,
        currentPage: requestsData.currentPage,
        totalPages: requestsData.totalPages,
        totalCount: requestsData.totalCount
    }
  }
}


export const actions: Actions = {

    updateRequestStatus: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = Number(formData.get("requestId"));
        const status = formData.get("status");

        try {
            

            // const existingRequest = await prisma.purchaseRequest.findUnique({
            //     where: { id: parseInt(requestId) },
            //     include: { product: true }
            // });

            // if (!existingRequest || existingRequest.product.farmerId !== session.user.userId) {
            //     return fail(403, {
            //         success: false,
            //         message: 'Not authorized to modify this request'
            //     });
            // }

            const updatedRequest = await updateRequestStatus(id, status);

            // 6. Return success response
            return {
                success: true,
                message: 'Status updated successfully',
                request: updatedRequest
            };

        } catch (error) {
            console.error('Error updating request status:', error);
            return fail(500, {
                success: false,
                message: 'Internal server error'
            });
        }
    },
    
};