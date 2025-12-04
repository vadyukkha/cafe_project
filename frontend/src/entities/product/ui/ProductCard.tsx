import Image from "next/image";
import { Product } from "../model/types";
import coffeeImage from "@/public/coffee.png";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <Image
        src={coffeeImage}
        alt={product.name}
        width={300}
        height={200}
        className="rounded-md object-cover w-full h-48"
      />

      <h3 className="text-lg font-semibold mt-3">{product.name}</h3>

      <p className="text-sm text-neutral-500">{product.description}</p>

      <div className="mt-4 font-bold text-xl">{product.price} ₽</div>
    </div>
  );
}
