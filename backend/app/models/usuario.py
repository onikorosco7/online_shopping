from pydantic import BaseModel, EmailStr

class Usuario(BaseModel):
    nombre: str
    correo: EmailStr
    contraseña: str


# routes/auth.py
from fastapi import APIRouter, HTTPException
from app.database import usuarios_collection
from jose import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel

SECRET_KEY = "supersecreta"

router = APIRouter()

class LoginData(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginData):
    user = usuarios_collection.find_one({"username": data.username})
    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token_data = {
        "sub": user["username"],
        "rol": user["rol"],
        "exp": datetime.utcnow() + timedelta(hours=12)
    }

    token = jwt.encode(token_data, SECRET_KEY)
    return {"access_token": token, "rol": user["rol"]}