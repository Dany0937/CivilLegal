# 🏛️ CivicLegal AI - Hackathon Microsoft 2026

> Democratizar el acceso a la justicia en Colombia mediante una plataforma web inteligente.

---

## 📋 Estado Actual

**Fase 0: Fundación Técnica Segura** ✅

- ✅ `.gitignore` estricto para Python y React
- ✅ Política zero secretos (variables entorno, `.env.example`)
- ✅ Backend FastAPI base con endpoint mock `/api/chat`
- ✅ Frontend React/Vite base con integración API
- ✅ Documentación README para ambas partes
- ✅ Centro de documentación en `docs/`
- ⏳ Próximo: Fase 1 (RAG, OpenAI, PDF)

---

## 🚀 Quick Start (5 minutos)

### Backend (FastAPI)

```bash
# 1. Navegar al directorio
cd apps/api

# 2. Crear virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Ejecutar servidor
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

✅ Backend disponible en: **http://127.0.0.1:8000**
- Docs: http://127.0.0.1:8000/docs

### Frontend (React + Vite)

En otra terminal:

```bash
# 1. Navegar al directorio
cd apps/web

# 2. Instalar dependencias
npm install

# 3. Ejecutar servidor de desarrollo
npm run dev
```

✅ Frontend disponible en: **http://127.0.0.1:5173**

### Probar Integración

1. Abre http://127.0.0.1:5173 en tu navegador
2. Ingresa un mensaje en la sección "Test Mock /api/chat"
3. Verás la respuesta JSON estática del backend 🎉

---

## 📁 Estructura del Repositorio

```
civiclegal-ai/
├── .gitignore                      # Estricto: Python, React, secretos
├── docs/                           # Centro de documentación
│   ├── README.md                   # Índice de documentación
│   └── ...                         # Markdowns del proyecto
├── CIVIC_LEGAL_AI_PLAN.md          # Plan completo del proyecto (referencia)
├── README.md                       # Este archivo
│
├── apps/
│   ├── api/                        # Backend FastAPI
│   │   ├── main.py                 # Punto de entrada
│   │   ├── requirements.txt        # Dependencias Python
│   │   ├── .env.example            # Template variables entorno
│   │   ├── README.md               # Docs backend
│   │   ├── app/
│   │   │   ├── core/config.py      # Configuración centralizada
│   │   │   └── routes/
│   │   │       ├── health.py       # Health checks
│   │   │       └── chat.py         # POST /api/chat (mock)
│   │   └── test_startup.py         # Validar que FastAPI inicia
│   │
│   └── web/                        # Frontend React + Vite
│       ├── package.json            # Dependencias Node
│       ├── vite.config.ts          # Vite config + proxy
│       ├── .env.example            # Template variables entorno
│       ├── README.md               # Docs frontend
│       ├── index.html              # HTML base
│       └── src/
│           ├── App.tsx             # Componente principal
│           ├── main.tsx            # Entry point
│           └── services/
│               └── chatService.ts  # Cliente HTTP /api/chat
│
└── docs/
  └── README.md                   # Índice central de documentación
```

---

## 🔐 Seguridad (Fase 0)

### ✅ Implementado

- **`.gitignore` estricto:** Cubre Python (`__pycache__`, `venv/`), React (`node_modules/`, `dist/`), IDE (`.vscode/`, `.idea/`), y archivos sensibles (`.env.*`)
- **Zero secretos:** `python-dotenv` carga variables entorno, nunca hardcodeadas
- **`.env.example`:** Plantilla sin valores sensibles para documentar qué variables se necesitan
- **Validación mínima:** El endpoint `/api/chat` valida entrada básica antes de responder

### 📝 Por Implementar (Fases 1+)

- GitHub Secret Scanning en CI/CD
- Pre-commit hooks para detectar secretos localmente
- Auditoría de dependencias (Dependabot, Snyk)
- Inyección de secretos via GitHub Secrets / Azure Pipeline

---

## 📚 Documentación

### Documentación Central
→ [docs/README.md](docs/README.md)

### Plan Completo
→ [CIVIC_LEGAL_AI_PLAN.md](CIVIC_LEGAL_AI_PLAN.md)

### Backend
→ [apps/api/README.md](apps/api/README.md)

### Frontend
→ [apps/web/README.md](apps/web/README.md)

---

## 🧪 Testing

### Backend (FastAPI)

```bash
cd apps/api

# Validar que la app carga sin errores
python test_startup.py

# Ejecutar tests (próximamente)
pytest
```

### Frontend (React)

```bash
cd apps/web

# Linting
npm run lint

# Build
npm run build
```

---

## 🌐 API Mock

### Endpoint: `POST /api/chat`

**Request:**
```json
{
  "user_message": "Me negaron un medicamento en la EPS",
  "area": "salud",
  "document_type": "tutela"
}
```

**Response (Fase 0 - Estático):**
```json
{
  "status": "success",
  "assistant_message": "Encontré artículos relevantes...",
  "hechos": "El ciudadano reporta un corte de agua...",
  "leyes": [
    {
      "article": "Art. 86, Constitución Política",
      "source": "constitucion",
      "text": "Toda persona tendrá acción de tutela..."
    }
  ],
  "estado": "urgente",
  "confidence": 0.95,
  "requires_intervention": false,
  "message": "Este análisis es válido bajo legislación colombiana..."
}
```

**En Fase 1:** Se reemplazará con lógica real (Foundry IQ + Azure OpenAI), pero el contrato se mantiene igual.

---

## 🔗 Flujo de Comunicación

```
USER (navegador)
    ↓
    └─→ Frontend (http://localhost:5173)
            ├─ Form: user_message, area, document_type
            └─→ POST /api/chat (proxy a localhost:8000)
                    ↓
                    Backend FastAPI (http://localhost:8000)
                    ├─ Valida request
                    ├─ [Fase 0] Retorna JSON estático
                    ├─ [Fase 1] Consulta RAG + OpenAI
                    └─→ Response JSON
                            ↓
                    Frontend
                    └─ Muestra respuesta en UI
```

---

## ⚠️ Limitaciones (Fase 0)

- ❌ Sin autenticación (anónimo)
- ❌ Sin persistencia (no se guardan casos)
- ❌ Sin RAG real (respuesta estática)
- ❌ Sin generación PDF
- ❌ Sin webhook a n8n
- ❌ Sin base de datos

**Esto es normal en Fase 0. Todas estas features se agregan en Fases 1, 2, 3.**

---

## 🛠️ Troubleshooting

### Backend

**Error: `ModuleNotFoundError: No module named 'fastapi'`**
→ Asegúrate de activar el venv y ejecutar `pip install -r requirements.txt`

**Error: `Port 8000 already in use`**
→ Cambia el puerto: `python -m uvicorn main:app --port 8001`

**Error: `CORS blocked request`**
→ Verifica `CORS_ORIGINS` en `.env` del backend

### Frontend

**Error: `GET /api/chat 404`**
→ Backend no está corriendo. Inicia FastAPI primero.

**Error: `Port 5173 already in use`**
→ Cambia el puerto en `vite.config.ts`

---

## 📊 Roadmap

| Fase | Estado | Entregables | Estimado |
|------|--------|-------------|----------|
| **0: Fundación** | ✅ Completa | `.gitignore`, Backend base, Frontend base, Mock API | ✅ Hecho |
| **1: Core MVP** | ⏳ Próximo | RAG, OpenAI, PDF, Clasificador | 2 semanas |
| **2: Pulido** | ⏳ Planned | WCAG 2.1 AA, Catálogo entidades, UX mejorada | 1 semana |
| **3: Piloto** | ⏳ Planned | Validación legal, hardening seguridad | 2 semanas |
| **4: Escala** | 🔮 Futuro | App móvil, Áreas legales adicionales, IA mejorada | Post-MVP |

---

## 📞 Contacto y Contribución

- **Plan Completo:** Consultar [CIVIC_LEGAL_AI_PLAN.md](CIVIC_LEGAL_AI_PLAN.md)
- **Issues / Preguntas:** Crear issue o PRs en el repositorio
- **Seguridad:** NUNCA committear `.env` con valores reales

---

## 📄 Licencia

(Por definir - típicamente MIT o Apache 2.0 para proyectos públicos)

---

**Última actualización:** Junio 11, 2026
**Stack:** FastAPI + React + Vite + Tailwind + Python + TypeScript
**Equipo:** CivicLegal AI - Hackathon Microsoft

🚀 ¡Vamos a democratizar el acceso a la justicia en Colombia!
