// src/routes/products/+page.server.js
import { paginateUserRequests } from '$lib/services/productCatalog.service';
import { fail, type Actions } from "@sveltejs/kit";
import { updateRequestStatus } from '$lib/services/request.service.js';
import type { PageServerLoad } from '../$types';
import { Status } from '$prisma-client';

function isValidStatus(value: string): value is Status {  
  return Object.values(Status).includes(value as Status);
} // si ky duhet te perdor dhe ne vende tjera

export const load: PageServerLoad = async ({url, locals }) => {
  const page = Number(url.searchParams.get('page')) || 1;
 // depends(`url:page=${page}`);

  const requestsData = await paginateUserRequests(locals.user ? locals.user.id : 1, page) //params.limit, params.sort, params.search, params.category);
  console.log(page);
  return{
    purchaseRequests: {
        requests: requestsData.requests || [],
        currentPage: requestsData.currentPage,
        totalPages: requestsData.totalPages,
        totalCount: requestsData.totalCount
    }
  }
}

export const actions = {
    updateRequestStatus: async ({ request }) => {
        const formData = await request.formData();
        const idStr = formData.get("requestId")?.toString();
        if( !idStr ){
        }
        let id;
        if(!idStr || (id = Number.parseInt(idStr)) <= 0){
          return fail(400, {message: 'Id has been given an invalid value'});
        }

        const status = formData.get("status")?.toString();
        if(!status || !isValidStatus(status)){
          return fail(400, {message: 'Status has been given an invalid value'});  // 400 esht bad request
        }

        try {

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
    
} satisfies Actions; 