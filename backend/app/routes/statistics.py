from fastapi import APIRouter
from app.database import db
from collections import defaultdict
from datetime import datetime

router = APIRouter(prefix="/estadisticas", tags=["Estadísticas"])

# 📊 Estadísticas generales
@router.get("/ventas-totales")
async def obtener_ventas_totales():
    pedidos = list(db["pedidos"].find())

    total_ventas = sum(p.get("total", 0) for p in pedidos)
    total_pedidos = len(pedidos)

    productos_vendidos = 0
    for p in pedidos:
        for item in p.get("productos", []):
            try:
                productos_vendidos += int(item.get("cantidad", 0))
            except (ValueError, TypeError):
                continue

    return {
        "total_ventas": total_ventas,
        "total_pedidos": total_pedidos,
        "productos_vendidos": productos_vendidos,
    }

# 📅 Ventas por día
@router.get("/ventas-por-dia")
async def obtener_ventas_por_dia():
    pedidos = list(db["pedidos"].find())
    ventas_por_dia = {}

    for p in pedidos:
        fecha = p.get("fecha")
        total = p.get("total", 0)
        if fecha:
            ventas_por_dia.setdefault(fecha, 0)
            ventas_por_dia[fecha] += total

    return [
        {"fecha": fecha, "total_ventas": total}
        for fecha, total in ventas_por_dia.items()
    ]

# 🔝 Producto más vendido
@router.get("/producto-mas-vendido")
async def producto_mas_vendido():
    pedidos = list(db["pedidos"].find())
    productos = defaultdict(int)

    for p in pedidos:
        for item in p.get("productos", []):
            nombre = item.get("nombre", "Desconocido")
            try:
                cantidad = int(item.get("cantidad", 0))
                productos[nombre] += cantidad
            except (ValueError, TypeError):
                continue

    if not productos:
        return {"producto": None, "cantidad": 0}

    producto = max(productos.items(), key=lambda x: x[1])
    return {"producto": producto[0], "cantidad": producto[1]}

# 📦 Categorías más populares
@router.get("/categorias-populares")
async def categorias_populares():
    pedidos = list(db["pedidos"].find())
    categorias = defaultdict(int)

    for p in pedidos:
        for item in p.get("productos", []):
            categoria = item.get("categoria", "Sin categoría")
            try:
                cantidad = int(item.get("cantidad", 0))
                categorias[categoria] += cantidad
            except (ValueError, TypeError):
                continue

    lista = sorted(
        [{"categoria": k, "cantidad": v} for k, v in categorias.items()],
        key=lambda x: x["cantidad"],
        reverse=True,
    )
    return lista

# 👤 Clientes frecuentes
@router.get("/clientes-frecuentes")
async def clientes_frecuentes():
    pedidos = list(db["pedidos"].find())
    clientes = defaultdict(int)

    for p in pedidos:
        cliente = p.get("cliente", "Desconocido")
        clientes[cliente] += 1

    lista = sorted(
        [{"cliente": k.strip(), "pedidos": v} for k, v in clientes.items()],
        key=lambda x: x["pedidos"],
        reverse=True,
    )
    return lista

# 🗓️ Ventas por día de la semana
@router.get("/ventas-por-dia-semana")
async def ventas_por_dia_semana():
    pedidos = list(db["pedidos"].find())
    dias = defaultdict(float)

    for p in pedidos:
        fecha_str = p.get("fecha")
        total = p.get("total", 0)
        if fecha_str:
            try:
                fecha = datetime.fromisoformat(fecha_str)
                nombre_dia = fecha.strftime("%A")
                dias[nombre_dia] += total
            except ValueError:
                continue

    return [
        {"dia": k, "total": v} for k, v in sorted(dias.items(), key=lambda x: x[0])
    ]