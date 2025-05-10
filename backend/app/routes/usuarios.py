from fastapi import APIRouter, HTTPException
from app.models.usuario import Usuario
from app.database import usuarios_collection  # asegúrate de tenerla en tu database.py
from bson import ObjectId
from pydantic import BaseModel

router = APIRouter()

# Ruta para registrar un usuario
@router.post("/usuarios/registrar")
def registrar_usuario(usuario: Usuario):
    # Verificar si ya existe ese nombre o correo
    if usuarios_collection.find_one({"nombre": usuario.nombre}):
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso")
    
    if usuarios_collection.find_one({"correo": usuario.correo}):
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    nuevo_usuario = usuario.dict()
    usuarios_collection.insert_one(nuevo_usuario)
    return {"mensaje": "Usuario registrado correctamente"}

# Ruta para obtener todos los usuarios
@router.get("/usuarios")
def obtener_usuarios():
    usuarios = usuarios_collection.find()
    return [{"_id": str(usuario["_id"]), "nombre": usuario["nombre"], "correo": usuario["correo"], "rol": usuario["rol"]} for usuario in usuarios]

# Ruta para eliminar un usuario
@router.delete("/usuarios/{id}")
def eliminar_usuario(id: str):
    # Primero obtenemos el usuario
    usuario = usuarios_collection.find_one({"_id": ObjectId(id)})

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Aseguramos que no se pueda eliminar al administrador
    if usuario["rol"] == "admin":
        raise HTTPException(status_code=400, detail="No se puede eliminar al administrador")

    # Eliminamos el usuario
    resultado = usuarios_collection.delete_one({"_id": ObjectId(id)})
    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return {"mensaje": "Usuario eliminado correctamente"}