from fastapi import APIRouter, HTTPException, Body
from app.database import carrito_collection, productos_collection
from app.models.item_carrito import ItemCarrito
from bson import ObjectId

router = APIRouter()


@router.post("/carrito/")
def agregar_al_carrito(item: ItemCarrito):
    producto = productos_collection.find_one({"_id": ObjectId(item.producto_id)})
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if item.cantidad > producto["stock"]:
        raise HTTPException(status_code=400, detail="Stock insuficiente")

    existente = carrito_collection.find_one({"producto_id": item.producto_id})

    if existente:
        nueva_cantidad = existente["cantidad"] + item.cantidad
        if nueva_cantidad > (existente["cantidad"] + producto["stock"]):
            raise HTTPException(status_code=400, detail="Stock insuficiente")

        carrito_collection.update_one(
            {"producto_id": item.producto_id},
            {"$inc": {"cantidad": item.cantidad}}
        )
    else:
        carrito_collection.insert_one({
            "producto_id": item.producto_id,
            "cantidad": item.cantidad
        })

    productos_collection.update_one(
        {"_id": ObjectId(item.producto_id)},
        {"$inc": {"stock": -item.cantidad}}
    )

    return {"mensaje": "Producto agregado al carrito"}


@router.get("/carrito/")
def ver_carrito():
    carrito = list(carrito_collection.find())
    resultado = []

    for item in carrito:
        producto = productos_collection.find_one({"_id": ObjectId(item["producto_id"])})
        if producto:
            resultado.append({
                "_id": str(item["_id"]),
                "producto_id": item["producto_id"],
                "nombre": producto["nombre"],
                "precio_unitario": producto["precio"],
                "cantidad": item["cantidad"],
                "stock_restante": producto["stock"]
            })

    return resultado


@router.delete("/carrito/{producto_id}")
def eliminar_del_carrito(producto_id: str):
    item = carrito_collection.find_one({"producto_id": producto_id})
    if not item:
        raise HTTPException(status_code=404, detail="Producto no está en el carrito")

    productos_collection.update_one(
        {"_id": ObjectId(producto_id)},
        {"$inc": {"stock": item["cantidad"]}}
    )

    carrito_collection.delete_one({"producto_id": producto_id})

    return {"mensaje": "Producto eliminado del carrito"}


@router.delete("/carrito/")
def vaciar_carrito():
    carrito = list(carrito_collection.find())

    for item in carrito:
        productos_collection.update_one(
            {"_id": ObjectId(item["producto_id"])},
            {"$inc": {"stock": item["cantidad"]}}
        )

    carrito_collection.delete_many({})

    return {"mensaje": "Carrito vaciado y stock restaurado"}


@router.get("/carrito/total")
def total_carrito():
    carrito = list(carrito_collection.find())
    total = 0.0

    for item in carrito:
        producto = productos_collection.find_one({"_id": ObjectId(item["producto_id"])})
        if producto:
            total += producto["precio"] * item["cantidad"]

    return {"total": round(total, 2)}


@router.put("/carrito/")
def editar_cantidad_carrito(
    producto_id: str = Body(...),
    nueva_cantidad: int = Body(...)
):
    if nueva_cantidad < 0:
        raise HTTPException(status_code=400, detail="Cantidad inválida")

    item = carrito_collection.find_one({"producto_id": producto_id})
    if not item:
        raise HTTPException(status_code=404, detail="Producto no está en el carrito")

    producto = productos_collection.find_one({"_id": ObjectId(producto_id)})
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    diferencia = nueva_cantidad - item["cantidad"]

    if diferencia > 0 and diferencia > producto["stock"]:
        raise HTTPException(status_code=400, detail="Stock insuficiente para actualizar")

    productos_collection.update_one(
        {"_id": ObjectId(producto_id)},
        {"$inc": {"stock": -diferencia}}
    )

    if nueva_cantidad == 0:
        carrito_collection.delete_one({"producto_id": producto_id})
        return {"mensaje": "Producto eliminado del carrito (cantidad 0)"}

    carrito_collection.update_one(
        {"producto_id": producto_id},
        {"$set": {"cantidad": nueva_cantidad}}
    )

    return {"mensaje": "Cantidad actualizada correctamente"}