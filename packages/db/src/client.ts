import { PrismaClient } from "../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";

export const prisma = new PrismaClient().$extends(withAccelerate())