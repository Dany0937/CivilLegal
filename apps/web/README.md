# ============================================================================
# CivicLegal AI - Frontend Setup and Getting Started
# ============================================================================

## 📋 Requisitos

- Node.js 16+ (probado con 18, 20)
- npm o yarn

## 🚀 Quick Start

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar la plantilla de ejemplo
cp .env.example .env.local

# Editar .env.local con tus valores
```

### 3. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

El frontend estará disponible en: **http://127.0.0.1:5173**

### 4. Compilar para Producción

```bash
npm run build
```

## 🧪 Probar Integración con Backend

1. Asegúrate de que el backend FastAPI esté corriendo en `http://127.0.0.1:8000`
2. Abre http://127.0.0.1:5173 en tu navegador
3. Completa el formulario "Test Mock /api/chat" y envía
4. Deberías ver la respuesta JSON estática del backend

## 📁 Estructura del Frontend

```
apps/web/
├── src/
│   ├── App.tsx                # Componente principal
│   ├── main.tsx               # Punto de entrada
│   ├── index.css              # Estilos globales
│   ├── services/
│   │   └── chatService.ts     # Cliente HTTP para /api/chat
│   └── assets/                # Imágenes, íconos
├── public/                    # Assets estáticos
├── vite.config.ts            # Configuración Vite
├── package.json              # Dependencias
├── tsconfig.json             # TypeScript config
├── .env.example              # Plantilla de variables entorno
└── index.html                # HTML base
```

## ⚙️ Configuración

### Variables de Entorno

Crear `.env.local`:

```env
# Backend API
VITE_API_URL=http://127.0.0.1:8000

# Environment
VITE_ENV=development
```

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `http://127.0.0.1:8000` | URL del backend FastAPI |
| `VITE_ENV` | `development` | Entorno: development, production |

## 🧩 Componentes Base

### `ChatService` (services/chatService.ts)

Cliente HTTP para comunicarse con `/api/chat`:

```typescript
import { ChatService } from './services/chatService'

// Enviar mensaje
const response = await ChatService.sendMessage({
  user_message: 'Me negaron un medicamento',
  area: 'salud',
  document_type: 'tutela'
})

// Health check
const isHealthy = await ChatService.healthCheck()
```

### `App.tsx`

Componente principal que:
- Formulario para enviar mensajes a `/api/chat`
- Muestra la respuesta JSON del mock
- Incluye contador demo de React

## 🌐 CORS y Proxy

Vite proxy (`vite.config.ts`) redirige `/api/*` al backend:

```
Frontend (5173) → /api/chat → Backend (8000)
```

Si cambias el puerto del backend, actualiza `vite.config.ts`.

## 📝 Próximas Fases

**Fase 1: UI Mejorada**
- Separar componentes: Landing, ChatForm, DocumentPreview
- Agregar estilos Tailwind CSS
- Integración Web Speech API para voz

**Fase 2: Flujo Conversacional**
- Multi-step form (paso a paso)
- Guardado automático en localStorage
- Validación de inputs

**Fase 3: Generación de Documentos**
- Previsualización PDF
- Descarga de documentos
- Historial de casos

## 🐛 Troubleshooting

### CORS Error: `Access to XMLHttpRequest blocked`

Solución:
1. Asegúrate de que el backend está corriendo en `http://127.0.0.1:8000`
2. Verifica que `CORS_ORIGINS` en `.env` del backend incluye `http://127.0.0.1:5173`
3. Recarga el frontend

### 404 en `/api/chat`

Solución: El backend no está corriendo. Inicia FastAPI:
```bash
cd apps/api
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Puerto 5173 ya en uso

Solución: Cambia el puerto en `vite.config.ts`:
```typescript
server: {
  port: 5174,  // o el puerto que prefieras
}
```

## 👨‍💻 Desarrollo

### Linting

```bash
npm run lint
```

### Formato de Código

```bash
npx prettier --write src/
```

## 📞 Contacto

Para preguntas, consulta `CIVIC_LEGAL_AI_PLAN.md`.

---

**Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Axios

**Última actualización:** Junio 2026
