# 📒 Mini Sistema de Notas Personales con Autenticación y API

## 📌 Descripción del Proyecto

Este proyecto consiste en el desarrollo de una aplicación web moderna construida con **React + Vite + TailwindCSS**, que permite a los usuarios gestionar notas personales de manera organizada y segura.

La aplicación implementa un sistema de **autenticación real con JWT**, rutas protegidas y conexión a una **API REST desarrollada con FastAPI y PostgreSQL**, además de operaciones CRUD completas utilizando **Axios**.

---

## 🎯 Funcionalidades del Sistema

El sistema permite a los usuarios:

- Registrarse e iniciar sesión.
- Crear notas personales.
- Asignar categorías a cada nota.
- Editar notas existentes.
- Eliminar notas.
- Filtrar notas por categoría.
- Visualizar la información en una interfaz responsiva y moderna.

---

## 🗂 Categorías Disponibles

Las categorías disponibles son:

- Personal
- Trabajo
- Ideas
- Recordatorios

---

## 📝 Estructura de Cada Nota

Cada nota contiene los siguientes campos:

- **Título**
- **Contenido**
- **Categoría**
- **Fecha de creación**

---
  # 🛠 Tecnologías Utilizadas

| **Capa**           | **Tecnología**              |
|--------------------|----------------------------|
| Frontend           | React                      |
| Bundler            | Vite                       |
| Estilos            | TailwindCSS                |
| Navegación         | React Router               |
| HTTP               | Axios                      |
| Backend            | FastAPI                    |
| ORM                | SQLAlchemy                 |
| Base de datos      | PostgreSQL                 |
| Seguridad          | JWT (python-jose)          |
| Hashing            | bcrypt (Passlib)           |
| Configuración      | Pydantic Settings          |
| Logging            | Logging con rotación diaria|

---

# 🏗 Arquitectura del Proyecto

El sistema sigue una arquitectura **cliente-servidor desacoplada**, donde el frontend y el backend funcionan como capas independientes conectadas mediante solicitudes HTTP.

---

## 📌 Diagrama General de Arquitectura

```text
Frontend (React)
      │
      │  HTTP Requests (Axios)
      ▼
Backend (FastAPI)
      │
      │  ORM (SQLAlchemy)
      ▼
PostgreSQL
```

---

# 📂 Estructura del Proyecto

```bash
backend/
│
├── app/
│   ├── main.py
│   ├── auth/
│   ├── core/
│   ├── models/
│   ├── routes/
│   └── schemas/
│
├── logs/
├── .env
└── requirements.txt
```
### 🔎 Descripción de Carpetas Backend

auth/ → Lógica de autenticación (JWT, hashing, dependencias).

core/ → Configuración, base de datos y logging.

models/ → Modelos ORM (User, Note).

routes/ → Endpoints de la API.

schemas/ → Validaciones con Pydantic.

```bash
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── api/
│   └── routes/
│
└── package.json
```
### 🔎 Descripción de Carpetas Frontend

components/ → Componentes reutilizables.

pages/ → Vistas principales (Login, Register, Notes).

hooks/ → Hooks personalizados (useFormValidation).

api/ → Configuración centralizada de Axios.

routes/ → Protección y definición de rutas.


### 🔐 Flujo de Autenticación

```bash
Usuario
   │
   ▼
Registro / Login (Frontend)
   │
   ▼
POST /auth/login (Backend)
   │
   ▼
Validación contraseña (bcrypt)
   │
   ▼
Generación JWT
   │
   ▼
Frontend guarda token (localStorage)
   │
   ▼
Axios envía Authorization: Bearer TOKEN
   │
   ▼
Backend valida token
   │
   ▼
Acceso a rutas protegidas (/notes)
🔐 Backend (FastAPI)
```
### 🚀 Funcionalidades 

- Registro de usuarios.
- Login con generación de JWT firmado.
- CRUD de notas protegido por autenticación.
- Validación de usuario activo.
- Hash seguro de contraseñas con bcrypt.
- Logging profesional con rotación diaria.
- Configuración centralizada mediante variables de entorno.

---

# 🚀 Cómo Ejecutar el Backend

## 1️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd backend
```
2️⃣ Crear y activar entorno virtual
```bash
python -m venv venv
venv\Scripts\activate
```
3️⃣ Instalar dependencias
```bash
pip install -r requirements.txt
```
4️⃣ Configurar variables de entorno

Crear un archivo .env en la raíz del backend con el siguiente contenido:
```bash
# ===============================
# BASE DE DATOS POSTGRESQL
# ===============================
DB_USER=postgres
DB_PASS=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_notas

# ===============================
# SEGURIDAD JWT
# ===============================
SECRET_KEY=CAMBIAR_ESTE_SECRETO_LARGO_Y_UNICO
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ===============================
# CORS
# ===============================
CORS_ORIGINS=http://localhost:5173
```
5️⃣ Crear la base de datos

En PostgreSQL ejecutar:
```bash
CREATE DATABASE sistema_notas;
```
6️⃣ Ejecutar el servidor
```bash
uvicorn main:app --reload
```
🌐 Acceso a la API
La API estará disponible en:
```bash
http://127.0.0.1:8000
```
Documentación automática (Swagger UI):
```bash
http://127.0.0.1:8000/docs
```
---

# 🎨 Frontend (React + Vite + tailwind css)

### 🚀 Funcionalidades

- Registro y login.
- Protección de rutas con `ProtectedRoute`.
- Interceptor Axios automático.
- CRUD completo de notas.
- Validación mediante hook personalizado (`useFormValidation`).
- Manejo global de errores 401.

---

# 🚀 Cómo Ejecutar el Frontend

## 1️⃣ Ingresar a la carpeta del frontend

```bash
cd frontend
```
2️⃣ Instalar dependencias
```bash
npm install
```
📌 Requisitos

Node.js v18 o superior.
npm.

3️⃣ Configurar URL del backend

En el archivo axiosClient.js configurar el baseURL:
```bash
baseURL: "http://127.0.0.1:8000"
```
4️⃣ Iniciar el servidor de desarrollo
```bash
npm run dev
```
🌐 Aplicación disponible en:
```bash
http://localhost:5173
```
---

# 🔎 Flujo Detallado de Autenticación

## 1️⃣ Registro

- El usuario ingresa **email** y **password**.
- El hook `useFormValidation` valida los campos.
- Se envía una petición `POST /auth/register`.
- El backend:
  - Hashea la contraseña con **bcrypt**.
  - Guarda el usuario en la base de datos.

---

## 2️⃣ Login

- El usuario ingresa sus credenciales.
- El backend:
  - Verifica la contraseña con **bcrypt**.
  - Genera un **JWT firmado**.
- El frontend guarda el token en `localStorage`:

```bash
localStorage.setItem("auth", JSON.stringify(auth));
```
## 3️⃣ Protección de Rutas

El componente ProtectedRoute:

- Verifica la existencia del token.
- Si no existe → redirige a /login.
- Si existe → permite el acceso a la ruta protegida.

## 4️⃣ Validación en Backend

El backend valida:

- Firma del token.
- Fecha de expiración.
- Que el usuario esté activo.
- Que la nota pertenezca al usuario autenticado.
- Si alguna validación falla → devuelve 401 Unauthorized.

## 🤖 Uso de Inteligencia Artificial

Durante el desarrollo se utilizó IA como herramienta de apoyo técnico y estructural.

### 1️⃣ Componentes refactorizados

- Refactorización completa de NoteForm.
- Corrección de errores de estado.
- Mejora estructural de NoteCard.

### 2️⃣ Mejora de lógica

- Implementación correcta de autenticación real con JWT.
- Interceptor Axios automático.
- Manejo global de errores 401.
- Organización modular del proyecto.

### 3️⃣ Sugerencias aceptadas

- Separar validaciones en useFormValidation.
- Centralizar peticiones en axiosClient.
- Implementar autenticación real con JWT.
- Crear un backend independiente con FastAPI + PostgreSQL, aunque no era obligatorio.
- Modularizar la arquitectura.
- Manejar el token automáticamente en los headers.
- Estructurar profesionalmente el flujo completo cliente-servidor.

### 📊 Estado Actual del Proyecto

✔ Backend con JWT funcional.

✔ Registro y login seguros.

✔ CRUD protegido por usuario.

✔ Frontend conectado a backend real.

✔ Interceptor Axios implementado.

✔ Arquitectura modular.

✔ Seguridad con bcrypt.

✔ Proyecto escalable.

## Capturas UI


### 🎯 Conclusión

El proyecto evolucionó de un ejercicio básico a una implementación profesional cliente-servidor con autenticación segura, arquitectura modular y buenas prácticas de desarrollo.

Se superó el alcance mínimo solicitado para demostrar dominio completo del flujo:

Frontend → Backend → Base de datos → Seguridad → Autorización
