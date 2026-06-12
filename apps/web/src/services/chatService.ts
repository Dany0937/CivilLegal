import axios from 'axios'

interface ChatRequest {
  user_message: string
  area?: string
  document_type?: string
}

interface ChatResponse {
  status: string
  assistant_message: string
  hechos: string
  leyes: Array<{
    article: string
    source: string
    text: string
  }>
  estado: string
  confidence: number
  requires_intervention: boolean
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const ChatService = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await apiClient.post<ChatResponse>('/api/chat', {
        user_message: request.user_message,
        area: request.area || 'salud',
        document_type: request.document_type || 'tutela',
      })
      return response.data
    } catch (error: any) {
      console.error('Chat Service Error:', error)
      throw new Error(error.response?.data?.detail || error.message || 'Error al conectar con el servidor')
    }
  },

  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/health/')
      return response.data.status === 'healthy'
    } catch (error) {
      console.error('Health Check Error:', error)
      return false
    }
  },
}
