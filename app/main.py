from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers.orders import router as orders_router, products_router, cart_router
from .models import User, Product, Cart, CartItem, Order, OrderItem

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AniMart API",
    description="Scalable Anime Merch Backend — demonstrating atomic transactions, row-level locking, and idempotency.",
    version="1.0.0"
)

# ============================================================
# CORS CONFIGURATION
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  
        "http://localhost:3000",  
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],   
)

app.include_router(orders_router)
app.include_router(products_router)
app.include_router(cart_router)

@app.get("/")
def health_check():
    """A simple endpoint to verify the server is running."""
    return {"status": "ok", "message": "⛩️ AniMart Systems Online."}

# ============================================================
# DATABASE SEED DATA
# ============================================================
@app.on_event("startup")
def seed_db():
    from .database import SessionLocal
    from .models import User, Product, Cart, CartItem
    from passlib.context import CryptContext

    db = SessionLocal()
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    try:
        if not db.query(User).first():
            user = User(
                email="otaku@example.com",
                hashed_password=pwd_context.hash("password123")
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            cart = Cart(user_id=user.id)
            db.add(cart)

            products = [
                Product(
                    name="Gojo Satoru 1/7 Scale Figure",
                    anime_title="Jujutsu Kaisen",
                    price=199.99,
                    stock_quantity=1   
                ),
                Product(
                    name="Chainsaw Man Vol 1 Manga",
                    anime_title="Chainsaw Man",
                    price=9.99,
                    stock_quantity=50
                ),
                Product(
                    name="Demon Slayer Tanjiro Nendoroid",
                    anime_title="Demon Slayer",
                    price=79.99,
                    stock_quantity=12
                ),
                Product(
                    name="Attack on Titan Survey Corps Hoodie",
                    anime_title="Attack on Titan",
                    price=59.99,
                    stock_quantity=25
                ),
                Product(
                    name="One Piece Luffy Gear 5 Statue",
                    anime_title="One Piece",
                    price=149.99,
                    stock_quantity=5
                ),
                Product(
                    name="Spy x Family Anya Forger Plush",
                    anime_title="Spy x Family",
                    price=24.99,
                    stock_quantity=100
                ),
            ]
            db.add_all(products)
            db.commit()

            for p in products:
                db.refresh(p)

            cart_item = CartItem(cart_id=cart.id, product_id=products[0].id, quantity=1)
            db.add(cart_item)
            db.commit()

            print("✅ Database seeded successfully!")
        else:
            print("ℹ️ Database already has data — skipping seed.")
    finally:
        db.close()