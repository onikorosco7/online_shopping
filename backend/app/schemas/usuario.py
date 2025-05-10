from pydantic import BaseModel, EmailStr

class UsuarioRegistro(BaseModel):
    nombre: str
    correo: EmailStr
    contraseña: str
    rol: str = "cliente"

class UsuarioLogin(BaseModel):
    correo: EmailStr
    contraseña: str