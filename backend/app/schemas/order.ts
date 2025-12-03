import { z } from 'zod'

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.string().regex(/^\d+(\.\d+)?$/, "Invalid decimal number"),
  })),
})

// a = {
//     items: {
//         "productId": "b876c145-0d50-4c72-acc2-0010c8c66520",
//         "quantity": 2,
//         "price": "49.99"
//     }
// }