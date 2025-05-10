from fastapi import APIRouter, HTTPException, Body
from bson import ObjectId
from pydantic import BaseModel
from app.database import carrito_collection, productos_collection, ordenes_collection as pedidos_collection
from datetime import datetime

router = APIRouter()

class PedidoSimpleSchema(BaseModel):
    cliente: str
    usuarioId: str

@router.post("/pedidos/")
def crear_pedido(data: PedidoSimpleSchema):
    cliente = data.cliente.strip()
    usuarioId = data.usuarioId.strip()

    carrito = list(carrito_collection.find())
    if not carrito:
        raise HTTPException(status_code=400, detail="El carrito está vacío")

    total = 0.0
    productos_pedido = []

    for item in carrito:
        producto = productos_collection.find_one({"_id": ObjectId(item["producto_id"])})
        if producto:
            precio = producto["precio"]
            cantidad = item["cantidad"]
            subtotal = round(precio * cantidad, 2)
            total += subtotal

            productos_pedido.append({
                "producto_id": str(producto["_id"]),
                "nombre": producto["nombre"],
                "precio_unitario": precio,
                "cantidad": cantidad,
                "subtotal": subtotal
            })

    pedido = {
        "cliente": cliente,
        "usuarioId": usuarioId,
        "productos": productos_pedido,
        "total": round(total, 2),
        "estado": "Pendiente",
        "fecha": datetime.now().date().isoformat()  # ⬅️ Campo agregado
    }

    pedidos_collection.insert_one(pedido)
    carrito_collection.delete_many({})

    return {
        "mensaje": "Pedido creado",
        "cliente": cliente,
        "total": round(total, 2),
        "productos": productos_pedido
    }

@router.get("/pedidos/")
def obtener_pedidos(usuarioId: str = None):
    query = {}
    if usuarioId:
        query["usuarioId"] = usuarioId
    pedidos = []
    for pedido in pedidos_collection.find(query):
        pedido["_id"] = str(pedido["_id"])
        for producto in pedido.get("productos", []):
            producto["producto_id"] = str(producto["producto_id"])
        pedidos.append(pedido)
    return pedidos

@router.get("/pedidos/{id}")
def obtener_pedido_por_id(id: str):
    try:
        pedido = pedidos_collection.find_one({"_id": ObjectId(id)})
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        pedido["_id"] = str(pedido["_id"])
        for producto in pedido.get("productos", []):
            producto["producto_id"] = str(producto["producto_id"])
        return pedido
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")

@router.delete("/pedidos/{id}")
def eliminar_pedido(id: str):
    try:
        result = pedidos_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        return {"mensaje": "Pedido eliminado correctamente"}
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido")

@router.put("/pedidos/{id}")
def actualizar_estado_pedido(id: str, datos: dict = Body(...)):
    try:
        estado = datos.get("estado")
        estados_permitidos = ["Pendiente", "Enviado", "Entregado", "Cancelado"]

        if not estado or estado not in estados_permitidos:
            raise HTTPException(
                status_code=400,
                detail=f"Estado inválido. Debe ser uno de: {', '.join(estados_permitidos)}"
            )

        result = pedidos_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"estado": estado}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")

        return {
            "mensaje": "Estado actualizado correctamente",
            "estado_actualizado": estado
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# 🛠️ Utilidad para actualizar pedidos antiguos sin fecha
@router.post("/pedidos/agregar-fecha-a-antiguos")
def agregar_fecha_a_pedidos_antiguos():
    pedidos = list(pedidos_collection.find({"fecha": {"$exists": False}}))
    actualizados = 0

    for pedido in pedidos:
        pedidos_collection.update_one(
            {"_id": pedido["_id"]},
            {"$set": {"fecha": datetime.now().date().isoformat()}}
        )
        actualizados += 1

    return {"mensaje": f"{actualizados} pedidos actualizados con fecha actual"}