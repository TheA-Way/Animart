export interface Product {
  id: number;
  name: string;
  anime_title: string;
  price: number;
  stock_quantity: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;  
}


export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];  
}


export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;  
}

export interface Order {
  id: number;
  user_id: number;
  status: 'CREATED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'FAILED';
  total_price: number;
  idempotency_key: string;
  created_at: string;
  items: OrderItem[];
}