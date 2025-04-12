import prisma from "$lib/prisma";
import type { Role } from "@prisma/client";

// USERS

export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { id: "asc" }
  });
}

export async function deleteUserById(id: number) {
  return await prisma.user.delete({
    where: { id }
  });
}

export async function updateUserById(id: number, data: { email: string; username: string; role: Role }) {
  return await prisma.user.update({
    where: { id },
    data
  });
}

// PRODUCTS

export async function getAllProducts() {
  return await prisma.product.findMany({
    orderBy: { id: "asc" }
  });
}

export async function deleteProductById(id: number) {
  return await prisma.product.delete({
    where: { id }
  });
}

export async function updateProductById(id: number, data: { name: string; description: string; price: number }) {
  return await prisma.product.update({
    where: { id },
    data
  });
}
