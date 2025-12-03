import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  volume: z.number().int().positive(),
  price: z.string().regex(/^\d+(\.\d+)?$/, "Invalid decimal number"),
});

export const updateProductSchema = createProductSchema.partial();
