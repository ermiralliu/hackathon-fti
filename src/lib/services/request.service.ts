import prisma from "../prisma";
import type { Status } from "$prisma-client";


export async function updateRequestStatus(requestId: number, status: Status){
    try {
        const updateData = {
            status: status,
            finished: new Date(),
        };

        const updatedRequest = await prisma.purchaseRequest.update({
            where: {
                id: requestId,
            },
            data: updateData,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                consumer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        console.log(`Request with ID ${requestId} updated to status ${status}`);
        return updatedRequest;
    } catch (error: any) {
        console.error(`Error updating request with ID ${requestId}:`, error);
        return null;
    }
}