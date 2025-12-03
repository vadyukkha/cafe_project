export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    volume: number;
  }
  
export interface ApiResponse {
    status: number;
    products: Product[];
}