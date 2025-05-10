from fastapi import APIRouter, HTTPException
from app.database import usuarios_collection
from app.schemas.usuario import UsuarioRegistro
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()
SECRET_KEY = "supersecreta"

# Contexto de hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/auth/register")
def registrar_usuario(usuario: UsuarioRegistro):
    if usuarios_collection.find_one({"correo": usuario.correo}):
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    nuevo_usuario = {
        "nombre": usuario.nombre,
        "correo": usuario.correo,
        "contraseña": pwd_context.hash(usuario.contraseña),
        "rol": usuario.rol
    }

    resultado = usuarios_collection.insert_one(nuevo_usuario)

    usuario_creado = {
        "_id": str(resultado.inserted_id),  # <-- Aseguramos incluir el ID
        "nombre": usuario.nombre,
        "correo": usuario.correo,
        "rol": usuario.rol
    }

    return {"mensaje": "Usuario creado correctamente", "usuario": usuario_creado}

@router.post("/auth/login")
def login(data: dict):
    user = usuarios_collection.find_one({"correo": data["correo"]})
    if not user or not pwd_context.verify(data["contraseña"], user["contraseña"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token_data = {
        "sub": user["correo"],
        "nombre": user["nombre"],
        "exp": datetime.utcnow() + timedelta(hours=12)
    }

    token = jwt.encode(token_data, SECRET_KEY)

    return {
        "access_token": token,
        "usuario": {
            "_id": str(user["_id"]),  # <-- Incluimos el ID
            "nombre": user["nombre"],
            "correo": user["correo"]
        }
    }