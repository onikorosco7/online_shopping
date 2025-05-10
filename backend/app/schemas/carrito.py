from pydantic import BaseModel

class ItemCarrito(BaseModel):
    producto_id: str
    cantidad: int