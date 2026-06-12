import React from 'react'
import './App.css'
import { ChatService } from './services/chatService'

type LawItem = {
  article: string
  source: string
  text: string
}

type ChatResponse = {
  status: string
  assistant_message: string
  hechos: string
  leyes: LawItem[]
  estado: string
  confidence: number
  requires_intervention: boolean
  message?: string
}

function App() {
  const [count, setCount] = React.useState(0)
  const [chatMessage, setChatMessage] = React.useState('')
  const [chatResponse, setChatResponse] = React.useState<ChatResponse | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setChatResponse(null)

    try {
      const response = await ChatService.sendMessage({
        user_message: chatMessage,
        area: 'salud',
        document_type: 'tutela',
      })
      setChatResponse(response)
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="hero">
        <p className="eyebrow">CivicLegal AI</p>
        <h1>Frontend base para el mock legal</h1>
        <p className="hero-copy">
          Prueba el endpoint <strong>/api/chat</strong> con un flujo limpio para validar el contrato
          entre React y FastAPI antes de conectar RAG o IA real.
        </p>
      </header>

      <section className="card">
        <h2>🧪 Test Mock /api/chat</h2>
        <form onSubmit={handleChatSubmit}>
          <div>
            <label htmlFor="message">Describe tu caso:</label>
            <textarea
              id="message"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ej: Me negaron un medicamento en la EPS"
              disabled={loading}
              rows={4}
              style={{ width: '100%', marginBottom: '10px' }}
            />
          </div>
          <button type="submit" disabled={loading || !chatMessage.trim()}>
            {loading ? 'Procesando...' : 'Enviar al Backend'}
          </button>
        </form>

        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {chatResponse && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <h3>Respuesta del Backend:</h3>
            <p>
              <strong>Estado:</strong> {chatResponse.status}
            </p>
            <p>
              <strong>Mensaje:</strong> {chatResponse.assistant_message}
            </p>
            <p>
              <strong>Hechos:</strong> {chatResponse.hechos}
            </p>
            <p>
              <strong>Urgencia:</strong> {chatResponse.estado}
            </p>
            <p>
              <strong>Confianza:</strong> {(chatResponse.confidence * 100).toFixed(0)}%
            </p>
            <p>
              <strong>Requiere intervención:</strong> {chatResponse.requires_intervention ? 'Sí' : 'No'}
            </p>
            <h4>Fundamentos Legales:</h4>
            <ul>
              {chatResponse.leyes &&
                chatResponse.leyes.map((law, idx) => (
                  <li key={idx}>
                    <strong>{law.article}</strong> ({law.source}): {law.text}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </section>

      <section className="card subtle-card">
        <h2>🔧 Estado local</h2>
        <button onClick={() => setCount((value) => value + 1)}>count is {count}</button>
        <p>Este contador solo verifica que React esté montando correctamente.</p>
      </section>
    </>
  )
}

export default App
