from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging
from ..models import User, Product, Cart, Order, OrderItem, OrderStatus

logger = logging.getLogger(__name__)

def process_checkout(db: Session, user_id: int, idempotency_key: str) -> Order:
    """
    This function handles the entire checkout process.
    
    It implements three SDE-level engineering patterns:
    
    1. IDEMPOTENCY CHECK
       Problem: User double-clicks "Place Order" due to slow internet
       Solution: If we've seen this idempotency_key before, return the existing order
       
    2. ROW-LEVEL LOCKING (SELECT FOR UPDATE)
       Problem: Two users simultaneously try to buy the last Gojo Figure
       Solution: Lock the product rows in the database so only one transaction 
                 can modify them at a time
                 
    3. ATOMIC TRANSACTION
       Problem: What if we deduct stock but then the order creation fails?
       Solution: Wrap everything in one transaction. If anything fails, 
                 ROLLBACK undoes ALL changes
    """
    
    existing_order = db.query(Order).filter(
        Order.user_id == user_id,
        Order.idempotency_key == idempotency_key
    ).first()
    
    if existing_order:
        logger.info(f"Idempotent hit for user {user_id} with key {idempotency_key}")
        return existing_order

    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    

    product_ids = [item.product_id for item in cart.items]
    
    try:

        locked_products = db.query(Product).filter(
            Product.id.in_(sorted(product_ids))  
        ).with_for_update().all()
        
        product_map = {p.id: p for p in locked_products}
        
        total_price = 0.0
        order_items_to_create = []
        
        for cart_item in cart.items:
            product = product_map.get(cart_item.product_id)
            
            if not product:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Product {cart_item.product_id} no longer exists"
                )
            
            if product.stock_quantity < cart_item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}. Only {product.stock_quantity} left."
                )
            
            product.stock_quantity -= cart_item.quantity
            
            item_total = product.price * cart_item.quantity
            total_price += item_total
            
            order_items_to_create.append(
                OrderItem(
                    product_id=product.id,
                    quantity=cart_item.quantity,
                    price_at_purchase=product.price 
                )
            )
        
        new_order = Order(
            user_id=user_id,
            total_price=total_price,
            idempotency_key=idempotency_key,
            status=OrderStatus.CREATED,
            items=order_items_to_create  
        )
        
        db.add(new_order)

        for item in cart.items:
            db.delete(item)
        

        db.commit()
        db.refresh(new_order)
        
        logger.info(f"Successfully processed order {new_order.id} for user {user_id}")
        return new_order

    except Exception as e:
        db.rollback()
        logger.error(f"Order failed for user {user_id}. Rolled back. Error: {str(e)}")
        
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Internal server error during checkout")