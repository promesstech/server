import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const connectToDatabase = () => { return prisma; };
export const disconnectFromDatabase = () => { return prisma.$disconnect(); };