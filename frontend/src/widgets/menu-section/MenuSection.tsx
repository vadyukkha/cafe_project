import { Product } from "@/src/entities/product/model/types";
import { ProductList } from "@/src/entities/product/ui/ProductList";

interface Props {
  products: Product[];
}

export function MenuSection({ products }: Props) {
  return (
    <section className="space-y-8 py-4">
      <h1 className="text-3xl font-bold">Наш кофе</h1>

      <ProductList products={products} />
    </section>
  );
}
