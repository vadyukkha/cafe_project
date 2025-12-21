import { z } from "zod";

export const createProductSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	volume: z.number().int().positive(),
	price: z.string().regex(/^\d+(\.\d+)?$/, "Invalid decimal number"),
});

export const updateProductSchema = z.object({
  productName: z.string().min(1),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  volume: z.number().int().positive().optional(),
  price: z.string().regex(/^\d+(\.\d+)?$/, "Invalid decimal number").optional(),
});

export const deleteProductSchema = z.object({
  productName: z.string().min(1),
});
