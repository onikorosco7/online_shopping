from pymongo import MongoClient

# Conexión al servidor local de MongoDB
client = MongoClient("mongodb://localhost:27017")

# Base de datos
db = client["carrito_db"]

# Colecciones
productos_collection = db["productos"]
carrito_collection = db["carrito"]
ordenes_collection = db["pedidos"]
usuarios_collection = db["usuarios"]