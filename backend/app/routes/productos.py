from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.models.producto import Producto
from app.database import productos_collection

router = APIRouter()

# Crear producto
@router.post("/productos/")
def agregar_producto(producto: Producto):
    nuevo = producto.dict()
    result = productos_collection.insert_one(nuevo)
    return {"id": str(result.inserted_id), "mensaje": "Producto agregado"}

# Obtener todos los productos
@router.get("/productos/")
def obtener_productos():
    productos = []
    for prod in productos_collection.find():
        prod["_id"] = str(prod["_id"])  # Convertir ObjectId a string
        productos.append(prod)
    return productos

# Obtener un producto por ID
@router.get("/productos/{producto_id}")
def obtener_producto_por_id(producto_id: str):
    prod = productos_collection.find_one({"_id": ObjectId(producto_id)})
    if not prod:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    prod["_id"] = str(prod["_id"])
    return prod

# 🔴 Eliminar un producto
@router.delete("/productos/{producto_id}")
def eliminar_producto(producto_id: str):
    result = productos_collection.delete_one({"_id": ObjectId(producto_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"mensaje": "Producto eliminado correctamente"}

# 🟡 Editar un producto
@router.put("/productos/{producto_id}")
def editar_producto(producto_id: str, producto: Producto):
    update_data = {k: v for k, v in producto.dict().items() if v is not None}
    result = productos_collection.update_one(
        {"_id": ObjectId(producto_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"mensaje": "Producto actualizado correctamente"}