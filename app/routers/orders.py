import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import OrderCreateRequest, OrderResponse, CartResponse, ProductResponse
from ..services.order_service import process_checkout
from ..models import Cart, Product, CartItem

router = APIRouter(prefix="/orders", tags=["Orders"])

def get_current_user_id():
    return 1

@router.post("/", response_model=OrderResponse)
def place_order(
    request: OrderCreateRequest,
    db: Session = Depends(get_db),              
    user_id: int = Depends(get_current_user_id) 
):
    """
    Place a new order from the current user's cart.
    Requires an idempotency_key to prevent duplicate charges.
    """
    order = process_checkout(db=db, user_id=user_id, idempotency_key=request.idempotency_key)
    return order




products_router = APIRouter(prefix="/products", tags=["Products"])

@products_router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    """Return all products in the store."""
    products = db.query(Product).all()
    return products

cart_router = APIRouter(prefix="/cart", tags=["Cart"])

@cart_router.get("/", response_model=CartResponse)
def get_cart(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Return the current user's cart."""
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart


@cart_router.post("/items")
def add_to_cart(
    product_id: int,
    quantity: int = 1,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # If item already in cart, increase quantity
    existing = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id
    ).first()
    
    if existing:
        existing.quantity += quantity
    else:
        db.add(CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity))
    
    db.commit()
    return {"message": "Added to cart"}

@cart_router.post("/admin/reset")
def reset_db(secret: str, db: Session = Depends(get_db)):
    if secret != os.getenv("RESET_SECRET"):
        raise HTTPException(status_code=403, detail="Forbidden")
    db.query(OrderItem).delete()
    db.query(Order).delete()
    db.query(CartItem).delete()
    db.query(Cart).delete()
    db.query(User).delete()
    db.query(Product).delete()
    db.commit()
    return {"message": "Database reset — restart the Render service to reseed"}