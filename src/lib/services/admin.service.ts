import prisma from "$lib/prisma";


export async function getAllUsers(){
  console.log("called get all users");
  const users = await prisma.user.findMany(); 
  console.log
  return users;
}
export async function getAllProducts() {
  return await prisma.product.findMany();
}