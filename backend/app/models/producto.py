from pydantic import BaseModel
from typing import Optional

class Producto(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: float
    stock: int
    imagen: str = ""