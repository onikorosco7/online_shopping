from pydantic import BaseModel
from typing import List
from datetime import datetime

class ItemPedido(BaseModel):
    producto_id: str
    cantidad: int

class Pedido(BaseModel):
    cliente: str
    usuarioId: str
    productos: List[ItemPedido]
    total: float 
    fecha: datetime 