import { fetchProductById } from "@/src/entities/product/lib/api";
import { ProductPageView } from "@/src/entities/product/ui/ProductPage";

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const product = await fetchProductById(id);
    return <ProductPageView product={product} />;
}
