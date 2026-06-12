# CivicLegal AI — Plan de Proyecto

> **Versión:** 2.0
> **Fecha:** Junio 2026
> **Estado:** Planificación / Pre-MVP

---

## 1. Visión del Proyecto

### 1.1 Propósito

Democratizar el acceso a la justicia en Colombia mediante una plataforma web inteligente que permita a cualquier ciudadano —sin importar edad, nivel educativo o recursos económicos— generar documentos legales válidos (Tutelas, Derechos de Petición, PQRS) en lenguaje natural, sin necesidad de abogados ni conocimientos jurídicos previos.

### 1.2 Áreas de Enfoque (MVP)

| Área                         | Tipo Documento       | Base Legal                                     |
| ----------------------------- | -------------------- | ---------------------------------------------- |
| **Salud**               | Acción de Tutela    | Constitución Política Art. 86, Ley 1751/2015 |
| **Salud**               | Derecho de Petición | Ley 1751/2015 Art. 17                          |
| **Servicios Públicos** | PQRS                 | Ley 142/1994, Art. 24, 79, 80                  |

### 1.3 Propuesta de Valor

- **Barreras eliminadas:** Lenguaje técnico jurídico, costos de representación, desconocimiento de derechos
- **Inclusividad:** Entrada por voz + texto, diseño responsivo, accesibilidad WCAG 2.1 AA
- **Velocidad:** Documento listo en minutos (vs. horas/días tradicionales)
- **Confiabilidad:** RAG sobre normativa real indexada, citas textuales, 0 alucinaciones
- **Trazabilidad:** Envío automatizado a entidades competentes vía webhook (n8n)

---

## 2. Arquitectura Técnica

### 2.1 Stack Tecnológico Unificado

| Capa                                 | Tecnología                                         | Enfoque                                                    |
| ------------------------------------ | --------------------------------------------------- | ---------------------------------------------------------- |
| **Frontend (Creative Apps)**   | React (Vite)                                        | SPA rápida, cero configuración                           |
| **Estilos y UX**               | Tailwind CSS                                        | Accesible, fuentes legibles, contrastes altos              |
| **Voz**                        | Web Speech API (nativa del navegador)               | Speech-to-Text en tiempo real, sin costos externos         |
| **PDF**                        | jspdf / react-pdf                                   | Generación client-side, sin archivos binarios en backend  |
| **Backend (Reasoning Agents)** | Python (FastAPI)                                    | Async, eficiente para IA, Swagger automático              |
| **Variables de Entorno**       | python-dotenv                                       | Zero secretos expuestos en repositorio público            |
| **RAG Engine**                 | Microsoft Foundry IQ*(obligatorio)*                 | Recuperación conocimiento sobre legislación real         |
| **LLM**                        | Azure OpenAI (GPT) vía GitHub Education / OpenCode | Procesa lenguaje natural, estructura JSON de salida        |
| **Automatización**            | FastAPI Webhooks + n8n (o Power Automate)           | HTTP POST al generar documento, enrutamiento institucional |

### 2.2 Flujo del Sistema

```
┌──────────────┐    ┌──────────────────┐    ┌─────────────────────────┐    ┌────────────────┐
│  USUARIO     │    │  FRONTEND (Vite) │    │  BACKEND FastAPI        │    │  GENERADOR     │
│  (voz/texto) │───▶│  - Captura caso  │───▶│  - Clasificación        │───▶│  DOCUMENTO     │
│              │    │  - Web Speech API│    │  - Extraer entidades    │    │  - Vista previa│
│              │    │  - Tailwind CSS  │    │  - RAG + argumentos     │    │  - PDF (jspdf) │
│              │    │  - jspdf/react  │    │  - python-dotenv        │    │  - JSON output │
└──────────────┘    └──────────────────┘    └─────────────┬───────────┘    └───────┬────────┘
                                                          │                         │
                                                          ▼                         ▼
                                                  ┌──────────────────┐    ┌──────────────────────────┐
                                                  │  FOUNDRY IQ (RAG) │    │  FastAPI Webhook → n8n   │
                                                  │  - Index legal   │    │  (o Power Automate)      │
                                                  │  - Hybrid search │    │  - Clasificar urgencia   │
                                                  │  - Grounding     │    │  - Enrutar a entidad    │
                                                  │  - Anti-alucina  │    │  - Notificar / tracking │
                                                  └──────────────────┘    └──────────────────────────┘
```

### 2.3 Flujo Detallado (Paso a Paso)

1. **Usuario ingresa** → Texto libre o dictado por voz vía Web Speech API (navegador)
2. **Frontend (Vite + React)** → Envía caso a backend FastAPI como JSON
3. **FastAPI** → Clasifica área (Salud / Servicios) y tipo documento (Tutela / DP / PQRS)
4. **Extracción** → Extrae nombre, CC, entidad demandada, hechos, pruebas vía Azure OpenAI
5. **RAG** → Consulta Microsoft Foundry IQ: recupera artículos relevantes del corpus legal
6. **Argumentación** → Azure OpenAI estructura: hechos → fundamentos legales → petitorio (JSON)
7. **Validación** → Verifica cada cita legal contra el corpus (anti-alucinación)
8. **PDF (cliente)** → jspdf / react-pdf renderiza documento con plantilla oficial, vista previa y descarga
9. **Envío** → FastAPI dispara webhook HTTP POST a n8n (o Power Automate) con datos del caso
10. **n8n** → Clasifica urgencia, determina entidad destino, notifica y lleva tracking

> **Variables de entorno:** python-dotenv carga credenciales de Azure y Foundry IQ, garantizando cero secretos en el repositorio público.

---

## 3. Base de Conocimiento Jurídico (RAG Corpus)

### 3.1 Documentos Indexados en Foundry IQ

| Documento                            | Artículos Clave                        | Prioridad |
| ------------------------------------ | --------------------------------------- | --------- |
| Constitución Política de Colombia  | 11, 13, 49, 85, 86, 93, 94              | Alta      |
| Ley 1751/2015 (Estatutaria de Salud) | 3, 4, 5, 6, 16, 17, 18, 19, 20, 23      | Alta      |
| Ley 142/1994 (Servicios Públicos)   | 24, 25, 79, 80, 81, 82, 156             | Alta      |
| Jurisprudencia Corte Constitucional  | T-760/08, T-380/17, SU-099/18, T-065/22 | Media     |
| Circulares Supersalud vigentes       | PQRS Salud, Tutelas                     | Media     |
| Circulares SSPD vigentes             | Reclamaciones servicios públicos       | Media     |

### 3.2 Estructura de Chunk

```json
{
  "id": "const_art_86",
  "source": "Constitución Política de Colombia",
  "article": "Artículo 86",
  "text": "Toda persona tendrá acción de tutela para reclamar ante los jueces...",
  "legal_area": ["salud", "general"],
  "doc_type": "constitucion",
  "rights": ["tutela", "derechos_fundamentales", "proteccion_inmediata"],
  "metadata": {
    "year": 1991,
    "last_reform": "2024",
    "hierarchy": "constitucional"
  }
}
```

### 3.3 Estrategia de Retrieval

- **Search type:** Híbrido (semántico + BM25 keyword)
- **Filters:** `legal_area` + `doc_type` según caso
- **Top-K:** 8 chunks, threshold ≥ 0.72 similitud
- **Reranking:** Cross-encoder para relevancia
- **Grounding:** Toda afirmación legal debe incluir cita `[Artículo X, Fuente Y]`

### 3.4 Anti-Alucinación

- Prompt instructivo: _"Solo usa la información del corpus proporcionado. Si no hay soporte normativo, indícalo al usuario."_
- Validación post-generación: cada cita se verifica vs. corpus
- Score de confianza por párrafo (mostrado al usuario si < 0.85)
- Fallback: sugerencia de consulta con abogado si el caso no encaja en el corpus

---

## 4. Módulos del Sistema

### 4.1 Módulo de Entrada (Input)

- **Texto:** Textarea con auto-expand, placeholder contextual
- **Voz:** Botón con indicador de grabación, transcripción en vivo (interimResults), confirmación auditiva
- **Guía:** Preguntas sugeridas según área detectada
- **Idioma:** Español Colombia (es-CO) para voz

### 4.2 Módulo de Procesamiento Legal

| Sub-módulo         | Función                                          | Tecnología        |
| ------------------- | ------------------------------------------------- | ------------------ |
| Clasificador        | Detecta área y tipo documento                    | LLM + few-shot     |
| Extractor NER       | Extrae entidades: persona, entidad, fecha, hechos | LLM + regex        |
| Analizador Urgencia | Clasifica: Inmediata / Alta / Normal              | Reglas + LLM       |
| Argumentador        | Estructura: hechos → derecho → petitorio        | RAG + LLM          |
| Validador           | Verifica citas contra corpus                      | Algoritmo matching |

### 4.3 Módulo de Generación de Documentos

- **Plantillas (3 tipos base):**
  - Tutela Salud (formato Corte Constitucional)
  - Derecho de Petición Salud (Ley 1751)
  - PQRS Servicios Públicos (Ley 142)
- **Campos dinámicos:** Datos usuario, entidad, hechos, fundamentos, pruebas, firma
- **Formato:** PDF A4, márgenes legales, numeración, vista previa HTML
- **Salida adicional:** JSON estructurado (interoperabilidad con n8n)

### 4.4 Módulo de Orquestación (FastAPI Webhooks + n8n / Power Automate)

**Disparador:** FastAPI expone un endpoint `/webhook/caso` que recibe el payload del documento generado y lo reenvía como HTTP POST a n8n (o Power Automate).

**Workflow en n8n:**

1. **Webhook de entrada** ← FastAPI envía `{documento, urgencia, entidad, datos_usuario}`
2. **Enriquecimiento** → Valida datos, busca entidad en catálogo
3. **Clasificación entidad destino:**
   - Salud → Supersalud / EPS / IPS / Secretaría de Salud
   - Servicios → SSPD / Empresa prestadora
4. **Canal de envío:** Email (plantilla oficial) + API simulación
5. **Tracking:** Estado del radicado, logs de entrega
6. **Recordatorios:** A las 48h y a los 15 días según términos legales

**Catálogo de Entidades (MVP ~500 más comunes):**

- EPS / IPS registradas (Supersalud)
- Empresas servicios públicos por municipio (SSPD)
- Secretarías de Salud departamentales/municipales

---

## 5. Experiencia de Usuario

### 5.1 Principios de Diseño

1. **Lenguaje llano:** "¿Te negaron un medicamento?" no "¿Vulneración del derecho fundamental a la salud?"
2. **Progresivo:** Un paso a la vez, guardado automático (localStorage)
3. **Feedback constante:** Mensajes de estado, animaciones, indicadores de carga
4. **Accesible:** WCAG 2.1 AA, contraste 4.5:1, navegación teclado, lectores pantalla
5. **Mobile-first:** >70% del tráfico esperado desde dispositivos móviles

### 5.2 Flujo de Pantallas

```
🏠 LANDING
├── Hero: "Tu derecho, tu voz, tu documento"
├── Selector: Salud 🏥 | Servicios Públicos 💡
└── Botón rápido: "Hablar ahora" / "Escribir mi caso"

📝 CAPTURA DEL CASO (Conversacional)
├── Paso 1: ¿Qué pasó? (voz o texto libre)
├── Paso 2: ¿Quién eres? (nombre, CC, teléfono, email)
├── Paso 3: ¿Contra quién? (seleccionar entidad)
├── Paso 4: ¿Qué pruebas tienes? (recibos, historias, comunicaciones)
└── 📋 Resumen editable

📄 DOCUMENTO GENERADO
├── Explicación en lenguaje llano
├── Vista previa HTML / PDF
├── Descargar PDF
└── Enviar a entidad

✅ CONFIRMACIÓN Y SEGUIMIENTO
├── Radicado: ABC-123
├── Tiempo estimado respuesta
├── Notificaciones (email / WhatsApp futuro)
└── Historial de casos
```

### 5.3 Componentes Clave

- `VoiceInput`: Captura de voz con feedback visual + fallback texto
- `LegalChatInterface`: Burbujas conversacionales usuario/asistente
- `DocumentPreview`: Vista previa con scroll + acción de descarga
- `ProgressStepper`: Indicador de progreso con aria-live
- `EntityAutocomplete`: Búsqueda inteligente de entidades

---

## 6. Seguridad y Privacidad

### 6.1 Cumplimiento Legal (Colombia)

- **Ley 1581/2012 (Habeas Data):** Consentimiento explícito, minimización, derechos ARCO
- **Ley 1266/2008 (Protección datos financieros):** No aplica al MVP
- **Decreto 1377/2013:** Registro de bases de datos ante SIC (fase producción)

### 6.2 Medidas Técnicas

| Capa                  | Medida                                                            |
| --------------------- | ----------------------------------------------------------------- |
| **Tránsito**   | TLS 1.3, HSTS, certificados administrados                         |
| **Reposo**      | AES-256 en Azure Storage                                          |
| **Aplicación** | CSP estricto, X-Frame-Options DENY, rate limiting (10 req/min)    |
| **Secretos**    | python-dotenv + .env (nunca commiteado) + variables entorno Azure |
| **Auditoría**  | Logs inmutables (Azure Monitor), retención 1 año                |
| **Datos**       | Purga automática a los 2 años, exportación bajo demanda        |

### 6.3 Consentimiento (UX)

Checkbox granular al momento de crear documento:

- [ ] Almacenar mis datos para generar el documento
- [ ] Enviar el documento a la entidad correspondiente
- [ ] Recibir notificaciones sobre el estado de mi caso
- [ ] Acepto términos y condiciones (link)

---

## 7. Estrategia de Pruebas

### 7.1 Pirámide

| Tipo                        | Herramienta               | Cobertura Objetivo         |
| --------------------------- | ------------------------- | -------------------------- |
| **Unitarias**         | Vitest + Testing Library  | 85% componentes, 90% utils |
| **Integración**      | Playwright (API + UI)     | 100% flujos críticos      |
| **E2E**               | Playwright                | 5 journeys completos       |
| **Accesibilidad**     | axe-core + pa11y + manual | WCAG 2.1 AA                |
| **Calidad Jurídica** | Custom eval suite         | 100 casos benchmark        |
| **Rendimiento**       | k6                        | 1000 usuarios concurrentes |

### 7.2 Benchmark Jurídico (Legal Eval)

Dataset: **100 casos anonimizados** (50 Salud, 50 Servicios Públicos)

| Métrica                             | Target       |
| ------------------------------------ | ------------ |
| Precisión clasificación tipo doc   | ≥ 95%       |
| Precisión entidad destino           | ≥ 90%       |
| Cobertura fundamentos legales        | ≥ 90%       |
| Citas correctas (existen + vigentes) | ≥ 98%       |
| Tasa de alucinaciones                | **0%** |
| Claridad lenguaje (Flesch-Spanish)   | ≥ 60        |
| Tiempo generación documento         | ≤ 10s p95   |

---

## 8. Roadmap y Milestones

### Fase 0: Fundación Técnica Segura

#### 0.1 Seguridad e Higiene del Repositorio

| Tarea                                      | Entregable                                   | Prioridad   |
| ------------------------------------------ | -------------------------------------------- | ----------- |
| `.gitignore` estricto (Python + React)   | Ignore caches, builds,`.env` locales, IDE  | 🔴 Crítica |
| Política Zero Secretos + pre-commit       | Scan local antes de push, detecta tokens     | 🔴 Crítica |
| Configurar python-dotenv +`.env.example` | Zero secretos en repositorio + variables env | 🔴 Crítica |
| GitHub Actions Secret Scanning             | Pipeline rechaza commits con credenciales    | 🔴 Crítica |

#### 0.2 Backend FastAPI Mínimo + Mock

| Tarea                                      | Entregable                                       | Prioridad   |
| ------------------------------------------ | ------------------------------------------------ | ----------- |
| Setup backend (Python + FastAPI + Uvicorn) | Proyecto base con Swagger + healthcheck          | 🔴 Crítica |
| Endpoint mock `POST /api/chat`           | JSON estático determinista, lista para frontend | 🔴 Crítica |
| Logging y error handling básico           | Logs inmutables, mensajes claros                 | 🟠 Alta     |
| CORS + seguridad headers mínima           | Válido para desarrollo local y CI/CD            | 🟠 Alta     |

#### 0.3 Frontend Base Mínima

| Tarea                                             | Entregable                                 | Prioridad |
| ------------------------------------------------- | ------------------------------------------ | --------- |
| Setup frontend (Vite + React + Tailwind)          | Proyecto base con routing + env de CI/CD   | 🟠 Alta   |
| Consumir mock `/api/chat` (prueba integración) | Landing + form básico, verifica contrato  | 🟠 Alta   |
| Configurar variables entorno para API             | Apunta a localhost en dev, a Azure en prod | 🟠 Alta   |

#### 0.4 Infraestructura y Deployment (Opcional para MVP)

| Tarea                                    | Entregable                                | Prioridad |
| ---------------------------------------- | ----------------------------------------- | --------- |
| Setup repositorio + CI/CD mínimo        | GitHub Actions: lint, test, security scan | 🟡 Media  |
| Dockerfile base (Python + Node opcional) | Imágenes reproducibles, sin secretos     | 🟡 Media  |

**Notas de Fase 0:**

- **Alcance:** Solo seguridad, contrato API y arranque técnico. Sin RAG, sin PDF, sin n8n.
- **Mock `/api/chat`:** JSON estático determinista para desbloquear frontend. Se reemplaza en Fase 1 sin cambiar contrato.
- **Secretos:** Cero credenciales en código, cero tokens hardcodeados. Variables entorno vía `.env.example` y CI/CD secrets.
- **Resultado esperado:** Repositorio limpio, backend responde, frontend puede integrarse, primer CI/CD ejecuta exitosamente.

### Fase 1: Core MVP

| Tarea                                             | Entregable                                    |
| ------------------------------------------------- | --------------------------------------------- |
| Componente entrada voz/texto (Web Speech API)     | VoiceInput funcional + fallback               |
| Pipeline RAG (FastAPI → Foundry → Azure OpenAI) | Respuestas con citas legales                  |
| Clasificador de casos                             | Detección área + tipo + entidades           |
| Generación PDF (jspdf / react-pdf)               | 3 plantillas con datos dinámicos             |
| FastAPI webhook + n8n workflow envío             | POST /webhook/caso → clasificar → notificar |
| Vista previa documento                            | HTML + PDF descargable                        |

### Fase 2: Pulido

| Tarea                      | Entregable                           |
| -------------------------- | ------------------------------------ |
| Accesibilidad WCAG 2.1 AA  | Auditoría + correcciones            |
| Catálogo entidades        | Autocomplete + datos Supersalud/SSPD |
| Optimización RAG latencia | Caché semántica, ≤ 3s p95         |
| UX: progreso + guardado    | localStorage, steps, feedback        |
| Analytics privado          | Plausible / Umami auto-hosted        |

### Fase 3: Piloto

| Tarea                        | Entregable                    |
| ---------------------------- | ----------------------------- |
| Piloto con ONG / Personería | 50 usuarios reales            |
| Validación jurídica        | Abogado revisa 100 documentos |
| Ajustes según feedback      | Iteración rápida            |
| Hardening seguridad          | Auditoría + pentest          |
| Documentación               | README, guías, API specs     |

### Fase 4: Escala (Post-MVP

- Ampliar áreas legales: Pensiones, Laboral, Consumidor
- Integración real APIs entidades (Radicación electrónica)
- App móvil (React Native / Capacitor)
- Asistente multi-turno con memoria
- Módulo de acompañamiento (notificaciones proactivas)

---

## 9. Estructura del Repositorio

```
civiclegal-ai/
├── .github/workflows/          # CI/CD
├── docs/
│   ├── architecture/           # ADRs, diagramas
│   ├── legal/                  # Corpus, plantillas, eval
│   └── api/                    # OpenAPI / Postman
├── apps/
│   ├── web/                    # React + Vite (Frontend)
│   │   ├── src/
│   │   │   ├── components/     # UI atómicos + compuestos
│   │   │   ├── features/       # input/ / document/ / tracking/
│   │   │   ├── hooks/          # useVoice, usePDF
│   │   │   ├── services/       # API client (fetch a FastAPI)
│   │   │   ├── lib/            # Utils, constants, types
│   │   │   └── styles/         # Tailwind, globals
│   │   └── public/             # Assets, manifest, workers
│   ├── api/                    # Python FastAPI (Backend)
│   │   ├── app/
│   │   │   ├── routes/         # generate.py, webhook.py, entities.py
│   │   │   ├── services/       # foundry.py, openai.py, n8n.py
│   │   │   ├── models/         # Pydantic schemas (request/response)
│   │   │   ├── middleware/     # rate-limit, cors, validation
│   │   │   └── core/           # config.py (python-dotenv), logging
│   │   ├── .env.example        # Variables de entorno (template)
│   │   ├── requirements.txt    # FastAPI, uvicorn, openai, httpx
│   │   └── main.py             # Entrypoint FastAPI
│   └── n8n/                    # Workflows exportados (.json)
├── packages/
│   ├── shared/                 # Types, Zod schemas, constants
│   └── legal-templates/        # Plantillas PDF
├── infrastructure/
│   ├── azure/                  # Bicep / Terraform
│   └── docker/                 # Dockerfiles + compose
└── tests/
    ├── unit/
    ├── integration/
    ├── e2e/
    └── legal-eval/             # Benchmark jurídico
```

---

## 10. Riesgos y Mitigaciones

| Riesgo                          | Prob. | Impacto  | Mitigación                                                   |
| ------------------------------- | ----- | -------- | ------------------------------------------------------------- |
| Alucinaciones del LLM           | Media | Crítico | Grounding forzado, validación post-gen, human-in-loop piloto |
| Latencia Foundry IQ + OpenAI    | Media | Alto     | Caché semántica, Async FastAPI, streaming responses         |
| Cambios normativos              | Alta  | Alto     | Job mensual re-indexación, alertas Diario Oficial            |
| Baja adopción (brecha digital) | Media | Alto     | Alianzas con personerías, PWA offline, interfaz por voz      |
| Fallo en webhook n8n            | Media | Medio    | Retry policy + email de respaldo + logs de auditoría         |
| Exposición de secretos (.env)  | Baja  | Crítico | python-dotenv + .gitignore + revisión en CI/CD               |

---

## 11. Métricas de Éxito (KPIs)

| KPI                                  | Target 3 Meses | Target Año 1 |
| ------------------------------------ | -------------- | ------------- |
| Usuarios activos mensuales           | 500            | 15,000        |
| Documentos generados                 | 1,000          | 50,000        |
| Tasa de completitud (abandono < 40%) | >60%           | >75%          |
| Tiempo generación PDF               | <10s           | <5s           |
| Precisión legal (benchmark)         | >95%           | >98%          |
| Casos enviados exitosamente          | >80%           | >90%          |
| NPS (satisfacción usuario)          | >40            | >60           |
| Tasa de alucinaciones                | 0%             | 0%            |

---

## 12. Próximos Pasos

1. **Setup inicial:** Crear repositorio, configurar Azure Foundry IQ, indexar corpus legal
2. **Backend FastAPI:** Proyecto base con rutas `/generate`, `/webhook/caso`, `/entities` + Swagger automático
3. **Frontend Vite + React:** Landing + flujo conversacional básico + Web Speech API
4. **Conexión Foundry IQ:** Pipeline RAG desde FastAPI → Foundry → Azure OpenAI
5. **PDF cliente:** jspdf / react-pdf con 3 plantillas, vista previa y descarga
6. **Webhook n8n:** FastAPI dispara POST a n8n (o Power Automate) al generar documento
7. **Primera iteración completa:** Usuario habla/escribe → FastAPI procesa → RAG argumenta → jspdf genera → webhook notifica

> **Nota:** Este plan asume acceso a Microsoft Foundry IQ (tenant Azure activo) y Azure OpenAI vía GitHub Education / OpenCode. Las claves se gestionan exclusivamente con python-dotenv sin exponer secretos en el repositorio.

---

**Documento mantenido por:** Equipo CivicLegal AI
**Última actualización:** Junio 2026
**Stack definido:** React (Vite) + Tailwind CSS + Web Speech API + jspdf/react-pdf | Python FastAPI + python-dotenv | Microsoft Foundry IQ + Azure OpenAI | FastAPI Webhooks + n8n/Power Automate
