from pydantic import BaseModel, Field

class ItemCarrito(BaseModel):
    producto_id: str
    cantidad: int = Field(..., gt=0, description="Cantidad debe ser mayor que 0")