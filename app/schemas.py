from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from .models import OrderStatus

# ============================================================
# REQUEST SCHEMAS (data coming IN to the API)
# ============================================================

class OrderCreateRequest(BaseModel):
    idempotency_key: str = Field(..., description="Unique key to prevent duplicate orders")

# ============================================================
# RESPONSE SCHEMAS (data going OUT from the API)
# ============================================================

class ProductResponse(BaseModel):
    id: int
    name: str
    anime_title: str
    price: float
    stock_quantity: int
    
    class Config:
        from_attributes = True

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductResponse
    
    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    id: int
    user_id: int
    items: List[CartItemResponse] = []
    
    class Config:
        from_attributes = True

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_purchase: float
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: OrderStatus
    total_price: float
    idempotency_key: str
    created_at: datetime
    items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True