import axios from 'axios';

const api = axios.create({
  // Use VITE_API_URL if set, otherwise detect if we are in production (Vercel)
  // based on the vercel.json routePrefix '/_/backend'
  baseURL: import.meta.env.VITE_API_URL || 
           (import.meta.env.PROD ? '/_/backend' : 'http://127.0.0.1:8000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SyncResponse {
  message: string;
  documents_processed: number;
  chunks_created: number;
}

export interface AskResponse {
  answer: string;
  sources: string[];
}

export const syncDrive = async (folderId?: string): Promise<SyncResponse> => {
  const response = await api.post('/sync-drive', folderId ? { folder_id: folderId } : {});
  return response.data;
};

export const askQuestion = async (query: string): Promise<AskResponse> => {
  const response = await api.post('/ask', { query });
  return response.data;
};

export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
