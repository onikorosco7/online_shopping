from fastapi import FastAPI
from app.routes import productos
from app.routes import carrito 
from app.routes import pedido
from app.routes import usuarios
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.routes.statistics import router as statistics_router

app = FastAPI(
    title="Carrito App",
    description="API para gestionar productos, usuarios, pedidos y carrito de compras",
    version="1.0.0"
)

# Luego agregás el middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar las rutas
app.include_router(productos.router)
app.include_router(carrito.router)
app.include_router(pedido.router)
app.include_router(usuarios.router)
app.include_router(auth.router)
app.include_router(statistics_router)