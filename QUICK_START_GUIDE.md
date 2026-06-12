# 📁 Guía Rápida de Archivos - Fase 0

## 🎯 Comienza Aquí

### 1. `README.md` (raíz)
**Qué:** Guía general del proyecto
**Contiene:**
- Quick Start 5 minutos (backend + frontend)
- Estructura del repositorio
- Flujo de comunicación
- Roadmap de fases
- Troubleshooting

**Cuándo leerlo:** Primero, para entender qué es CivicLegal AI

---

### 2. `CIVIC_LEGAL_AI_PLAN.md`
**Qué:** Plan completo del proyecto (Fases 0-4)
**Contiene:**
- Visión y propuesta de valor
- Arquitectura técnica
- Stack tecnológico
- Roadmap detallado (Fase 0 actualizada)
- KPIs de éxito
- Seguridad y privacidad

**Cuándo leerlo:** Cuando necesites entender la visión completa

---

### 3. `IMPLEMENTATION_CHECKLIST.md`
**Qué:** Resumen de qué se implementó en Fase 0
**Contiene:**
- Checklist de requisitos cumplidos
- Estructura de archivos
- Features implementadas
- Validaciones completadas
- Limitaciones intencionales

**Cuándo leerlo:** Para confirmar que se cumplió todo en Fase 0

---

## 🏗️ Backend

### `apps/api/README.md`
**Qué:** Documentación del backend FastAPI
**Contiene:**
- Requisitos e instalación
- Quick Start (crear venv, pip install, uvicorn)
- Documentación de API endpoints
- Configuración variables entorno
- Troubleshooting específico backend

**Acciones:**
```bash
cd apps/api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

---

### `apps/api/main.py`
**Qué:** Punto de entrada FastAPI
**Contiene:**
- FastAPI app initialization
- CORS configuration
- Security headers middleware
- Lifespan events (startup/shutdown)
- Custom error handlers
- Route registrations

**Rutas expuestas:**
- `GET /` → Root endpoint
- `GET /health/` → Health check
- `POST /api/chat` → Chat endpoint (mock)
- `GET /api/chat/health` → Chat health

---

### `apps/api/app/core/config.py`
**Qué:** Configuración centralizada
**Contiene:**
- Pydantic BaseSettings
- Variables de entorno cargadas automáticamente
- Valores por defecto seguros
- Comentarios sobre RAG y OpenAI (Fase 1+)

**Uso:**
```python
from app.core.config import settings

print(settings.SERVER_PORT)  # 8000
print(settings.ENVIRONMENT)  # development
```

---

### `apps/api/app/routes/chat.py`
**Qué:** Endpoint POST /api/chat (mock)
**Contiene:**
- Pydantic models (ChatRequest, ChatResponse)
- Endpoint handler con documentación automática
- JSON respuesta estática determinista
- Validación básica de entrada

**Respuesta mock:**
```json
{
  "status": "success",
  "assistant_message": "...",
  "hechos": "El ciudadano reporta...",
  "leyes": [{"article": "Art. X", "source": "...", "text": "..."}],
  "estado": "urgente",
  "confidence": 0.95,
  "requires_intervention": false
}
```

---

### `apps/api/.env.example`
**Qué:** Template de variables entorno
**Acción:**
```bash
cp .env.example .env
# Editar .env con valores locales si es necesario
```

**Variables principales:**
- `ENVIRONMENT` → development/staging/production
- `SERVER_HOST` → 127.0.0.1
- `SERVER_PORT` → 8000
- `CORS_ORIGINS` → lista de origins permitidos
- `FOUNDRY_IQ_ENABLED`, `AZURE_OPENAI_ENABLED` → False en Fase 0

---

### `apps/api/requirements.txt`
**Qué:** Dependencias Python
**Instalar:**
```bash
pip install -r requirements.txt
```

**Paquetes clave:**
- fastapi 0.104.1
- uvicorn[standard] 0.24.0
- pydantic 2.5.0
- python-dotenv 1.0.0

---

## 🎨 Frontend

### `apps/web/README.md`
**Qué:** Documentación del frontend React
**Contiene:**
- Requisitos e instalación
- Quick Start (npm install, npm run dev)
- Estructura de componentes
- Configuración variables entorno
- Troubleshooting CORS y puertos

**Acciones:**
```bash
cd apps/web
npm install
npm run dev
```

---

### `apps/web/package.json`
**Qué:** Dependencias Node
**Instalar:**
```bash
npm install
```

**Scripts:**
- `npm run dev` → Inicia servidor de desarrollo (puerto 5173)
- `npm run build` → Build para producción
- `npm run lint` → Linting
- `npm run preview` → Preview de build

---

### `apps/web/vite.config.ts`
**Qué:** Configuración Vite
**Contiene:**
- Proxy: `/api` → `http://localhost:8000` (CRUCIAL para CORS)
- Servidor: puerto 5173
- Plugin React

**Importante:** Si cambias puerto del backend, actualiza aquí.

---

### `apps/web/src/App.tsx`
**Qué:** Componente principal React
**Contiene:**
- Form para enviar mensajes a /api/chat
- Visualización de respuesta JSON
- Demo contador (ejemplo React)
- Manejo de loading y errors

**Uso:** Abre http://localhost:5173 después de `npm run dev`

---

### `apps/web/src/services/chatService.ts`
**Qué:** Cliente HTTP tipado para /api/chat
**Contiene:**
- Tipos TypeScript: ChatRequest, ChatResponse, LegalFundament
- Función sendMessage(request)
- Función healthCheck()
- Error handling

**Uso:**
```typescript
import { ChatService } from './services/chatService'

const response = await ChatService.sendMessage({
  user_message: 'Me negaron un medicamento',
  area: 'salud',
  document_type: 'tutela'
})
```

---

### `apps/web/.env.example`
**Qué:** Template variables entorno frontend
**Acción:**
```bash
cp .env.example .env.local
```

**Variables:**
- `REACT_APP_API_URL` → URL del backend (default: http://127.0.0.1:8000)
- `VITE_ENV` → development/production

---

## 🔐 Seguridad

### `.gitignore`
**Qué:** Define qué archivos NO se comitean
**Cubre:**
- Python: `__pycache__/`, `venv/`, `*.pyc`, `dist/`, `build/`
- React: `node_modules/`, `dist/`, `.env.local`
- IDE: `.vscode/`, `.idea/`, `*.swp`
- **Secretos:** `.env`, `*.pem`, `*.key`, `secrets.json`

**Verificar:**
```bash
git status
# No deberían aparecer .env, node_modules/, venv/, etc.
```

---

## 🚀 Flujo Típico de Desarrollo

### 1. Setup inicial (una sola vez)

```bash
# Backend
cd apps/api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend (en otra terminal)
cd apps/web
npm install
```

### 2. Desarrollo diario

Terminal 1 (Backend):
```bash
cd apps/api
venv\Scripts\activate
python -m uvicorn main:app --reload
```

Terminal 2 (Frontend):
```bash
cd apps/web
npm run dev
```

### 3. Probar

- Backend Docs: http://localhost:8000/docs
- Frontend: http://localhost:5173
- Form test /api/chat: llenar mensaje → enviar → ver respuesta

---

## 📝 Resumen Rápido

| Qué | Dónde | Acción |
|-----|-------|--------|
| **Plan** | `CIVIC_LEGAL_AI_PLAN.md` | Leer visión general |
| **Quick Start** | `README.md` | Iniciar backend + frontend |
| **Backend Setup** | `apps/api/README.md` | pip install, uvicorn |
| **Frontend Setup** | `apps/web/README.md` | npm install, npm run dev |
| **Variables entorno** | `.env.example` files | Copiar, rellenar si es necesario |
| **API Mock** | `apps/api/app/routes/chat.py` | Ver respuesta JSON |
| **Cliente HTTP** | `apps/web/src/services/chatService.ts` | Ver tipos y uso |
| **Checklist Fase 0** | `IMPLEMENTATION_CHECKLIST.md` | Validar que todo está hecho |

---

## 🆘 Troubleshooting Rápido

**Backend no inicia:**
```bash
# Verificar venv activado
python -m pip list | grep fastapi  # Debe aparecer

# Reinstalar dependencias
pip install --upgrade -r requirements.txt
```

**Frontend no conecta a backend:**
1. Verificar backend corriendo en http://localhost:8000
2. Verificar CORS_ORIGINS en `apps/api/.env`
3. Verificar proxy en `apps/web/vite.config.ts`
4. Limpiar cache: `rm -rf node_modules/.vite`

**Puerto en uso:**
```bash
# Backend: cambiar puerto en uvicorn
python -m uvicorn main:app --port 8001

# Frontend: cambiar en vite.config.ts (server.port)
```

---

**Última actualización:** Junio 11, 2026
**Fase:** 0 - Fundación Segura ✅
