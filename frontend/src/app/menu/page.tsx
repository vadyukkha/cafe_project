import { fetchProducts } from "@/src/entities/product/lib/api";
import { MenuSection } from "@/src/widgets/menu-section/MenuSection";

export default async function MenuPage() {
  const products = await fetchProducts();

  return (
    <main className="container mx-auto py-10">
      <MenuSection products={products} />
    </main>
  );
}
