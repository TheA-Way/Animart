import axios from 'axios';
import type { Product, Cart, Order } from '../types';


const API_BASE_URL = 'http://localhost:8000';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export async function fetchProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>('/products/');
  return response.data;
}


export async function fetchCart(): Promise<Cart> {
  const response = await api.get<Cart>('/cart/');
  return response.data;
}


export async function placeOrder(idempotencyKey: string): Promise<Order> {
  const response = await api.post<Order>('/orders/', {
    idempotency_key: idempotencyKey,
  });
  return response.data;
}

export async function addToCart(productId: number): Promise<void> {
  await api.post(`/cart/items?product_id=${productId}&quantity=1`);
}